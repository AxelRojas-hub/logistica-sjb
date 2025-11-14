"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface Servicio {
    id_servicio: number
    nombre_servicio: string
    costo_servicio: number
}

interface NewOrderForm {
    // Datos del destinatario
    dniCliente: number
    nombreCliente: string
    telefonoCliente: string
    emailCliente: string
    direccionCliente: string
    
    // Datos del pedido
    ciudadDestino: string
    idSucursalDestino: number
    peso: number
    fechaLimiteEntrega: string
    
    // Datos para pedido_servicio
    tipoTransporte: number | null 
    serviciosOpcionales: number[]
}

interface ServiciosSectionProps {
    servicioTransporte: Servicio | null
    serviciosOpcionales: Servicio[]
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    loading: boolean
    isFieldDisabled?: (fieldName: string) => boolean
}

export function ServiciosSection({ 
    servicioTransporte,
    serviciosOpcionales, 
    newOrder, 
    setNewOrder, 
    loading,
    isFieldDisabled = () => false
}: ServiciosSectionProps) {

    const actualizarServiciosOpcionales = (opcionales: number[]) => {
        setNewOrder({ 
            ...newOrder, 
            serviciosOpcionales: opcionales
        })
    }

    return (
        <div className="space-y-4">
            {/* Servicio de Transporte (FIJO) */}
            {servicioTransporte ? (
                <div className="space-y-3">
                    <h4 className="font-medium">Servicio de Transporte</h4>
                    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                <div>
                                    <Label className="font-medium text-base">
                                        {servicioTransporte.nombre_servicio}
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Incluido en tu contrato
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                ${servicioTransporte.costo_servicio.toLocaleString("es-AR", {minimumFractionDigits: 2})} (base)
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50/50 dark:bg-red-950/30 dark:border-red-800">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900 dark:text-red-100">
                                No puede crear pedidos
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                No tiene el servicio de transporte contratado.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Servicios Adicionales Opcionales */}
            {serviciosOpcionales.length > 0 && servicioTransporte && (
                <div className="space-y-3">
                    <h4 className="font-medium">Servicios Adicionales (Opcionales)</h4>
                    <div className="grid gap-3">
                        {serviciosOpcionales.map((servicio) => (
                            <div key={servicio.id_servicio} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={`servicio-${servicio.id_servicio}`}
                                        checked={newOrder.serviciosOpcionales.includes(servicio.id_servicio)}
                                        onCheckedChange={(checked) => {
                                            const nuevosOpcionales = checked 
                                                ? [...newOrder.serviciosOpcionales, servicio.id_servicio]
                                                : newOrder.serviciosOpcionales.filter(id => id !== servicio.id_servicio)
                                            actualizarServiciosOpcionales(nuevosOpcionales)
                                        }}
                                        disabled={loading || isFieldDisabled('serviciosOpcionales')}
                                    />
                                    <Label 
                                        htmlFor={`servicio-${servicio.id_servicio}`}
                                        className="cursor-pointer text-foreground"
                                    >
                                        {servicio.nombre_servicio}
                                    </Label>
                                </div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    +${servicio.costo_servicio.toLocaleString("es-AR", {minimumFractionDigits: 2})}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}