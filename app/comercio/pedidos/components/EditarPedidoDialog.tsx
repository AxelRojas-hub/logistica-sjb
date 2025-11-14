"use client"

import { Button } from "@/components/ui/button"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { CamposEditablesPedido } from "./CamposEditablesPedido"
import type { Pedido, Sucursal } from "@/lib/types"

interface EditOrderForm {
    ciudadDestino: string
    idSucursalDestino: number
    fechaLimiteEntrega: string
}

interface EditarPedidoDialogProps {
    pedido: Pedido
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateOrder: (orderId: number, updates: EditOrderForm) => Promise<boolean>
    loading?: boolean
    error?: string
    fieldErrors?: Record<string, string>
    onSuccess?: () => void
    sucursales: Sucursal[]
}

export function EditarPedidoDialog({ 
    pedido,
    open,
    onOpenChange,
    onUpdateOrder,
    loading = false,
    error,
    fieldErrors = {},
    onSuccess,
    sucursales
}: EditarPedidoDialogProps) {
    const [editForm, setEditForm] = useState<EditOrderForm>({
        ciudadDestino: "",
        idSucursalDestino: 0,
        fechaLimiteEntrega: ""
    })



    useEffect(() => {
        if (pedido && sucursales.length > 0) {
            const sucursalDestino = sucursales.find(s => s.idSucursal === pedido.idSucursalDestino)
            const ciudadDestino = sucursalDestino?.ciudadSucursal || ""
            
            let fechaFormateada = ""
            if (pedido.fechaLimiteEntrega) {
                const fechaString = pedido.fechaLimiteEntrega
                if (fechaString.includes('T')) {
                    fechaFormateada = fechaString.split('T')[0]
                } else {
                    fechaFormateada = fechaString.slice(0, 10)
                }
            }
            
            setEditForm({
                ciudadDestino: ciudadDestino,
                idSucursalDestino: pedido.idSucursalDestino,
                fechaLimiteEntrega: fechaFormateada
            })
        }
    }, [pedido, sucursales])

    const handleCiudadChange = (ciudadNombre: string) => {
        const sucursal = sucursales.find(s => s.ciudadSucursal === ciudadNombre)
        if (sucursal) {
            setEditForm({ 
                ...editForm, 
                ciudadDestino: ciudadNombre,
                idSucursalDestino: sucursal.idSucursal
            })
        }
    }

    const handleFechaChange = (fecha: string) => {
        setEditForm({
            ...editForm,
            fechaLimiteEntrega: fecha
        })
    }

    const handleSubmit = async () => {
        const resultado = await onUpdateOrder(pedido.idPedido, editForm)
        
        if (resultado === true && onSuccess) {
            onSuccess()
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="w-full !max-w-[85vw] max-h-[90vh] overflow-y-auto"
                aria-describedby="dialog-description"
            >
                <DialogHeader>
                    <DialogTitle>Editar Pedido #{pedido.idPedido}</DialogTitle>
                    <div id="dialog-description" className="sr-only">
                        Formulario para editar los datos de un pedido existente
                    </div>
                </DialogHeader>
                
                <div className="grid gap-6">
                    <CamposEditablesPedido 
                        ciudadDestino={editForm.ciudadDestino}
                        fechaLimiteEntrega={editForm.fechaLimiteEntrega}
                        sucursales={sucursales}
                        loading={loading}
                        loadingSucursales={false}
                        fieldErrors={fieldErrors}
                        onCiudadChange={handleCiudadChange}
                        onFechaChange={handleFechaChange}
                    />

                    <div className="space-y-4 pt-4 border-t">
                        {/* Mostrar precio calculado */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Precio del Pedido:
                                </span>
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    ${pedido.precio.toLocaleString("es-AR", {minimumFractionDigits: 2})}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                * El precio se fijó al crear el pedido y no cambia al editar
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/50 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <Button 
                            onClick={handleSubmit}
                            className="w-full h-12 text-base font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Actualizando pedido..." : "Actualizar Pedido"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
