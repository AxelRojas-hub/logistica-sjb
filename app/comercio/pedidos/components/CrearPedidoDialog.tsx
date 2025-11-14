"use client"
import { Button } from "@/components/ui/button"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { DatosDestinatario, DatosPedido, ServiciosSection } from "."
import type { Sucursal, Servicio } from "@/lib/types"

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

interface CreateOrderDialogProps {
    onCreateOrder: (order: NewOrderForm) => Promise<boolean>
    disabled?: boolean
    loading?: boolean
    error?: string
    fieldErrors?: Record<string, string>
    onSuccess?: () => void
    onOpenChange?: (open: boolean) => void
    sucursales: Sucursal[]
    servicioTransporte: Servicio | null
    serviciosOpcionales: Servicio[]
}

export function CreateOrderDialog({ 
    onCreateOrder, 
    disabled = false,
    loading = false,
    error,
    fieldErrors = {},
    onSuccess,
    onOpenChange,
    sucursales,
    servicioTransporte,
    serviciosOpcionales
}: CreateOrderDialogProps) {
    const [newOrder, setNewOrder] = useState<NewOrderForm>({
        dniCliente: 0,
        nombreCliente: "",
        telefonoCliente: "",
        emailCliente: "",
        direccionCliente: "",
        ciudadDestino: "",
        idSucursalDestino: 0,
        peso: 0,
        fechaLimiteEntrega: "",
        tipoTransporte: null,
        serviciosOpcionales: [],

    })

    const [isOpen, setIsOpen] = useState(false)
    const [precioCalculado, setPrecioCalculado] = useState<number | null>(null)
    const [precioSinDescuento, setPrecioSinDescuento] = useState<number | null>(null)
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0)
    const [calculandoPrecio, setCalculandoPrecio] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)

    const limpiarFormulario = useCallback(() => {
        setNewOrder({
            dniCliente: 0,
            nombreCliente: "",
            telefonoCliente: "",
            emailCliente: "",
            direccionCliente: "",
            ciudadDestino: "",
            idSucursalDestino: 0,
            peso: 0,
            fechaLimiteEntrega: "",
            tipoTransporte: servicioTransporte?.idServicio || null,
            serviciosOpcionales: []
        })
    }, [servicioTransporte])

    useEffect(() => {
        if (servicioTransporte && newOrder.tipoTransporte === null) {
            setNewOrder(prev => ({
                ...prev,
                tipoTransporte: servicioTransporte.idServicio
            }))
        }
    }, [servicioTransporte, newOrder.tipoTransporte])


    useEffect(() => {
        if (isOpen) {

            limpiarFormulario()
        }
    }, [isOpen, limpiarFormulario])


    useEffect(() => {
        const calcularPrecio = async () => {
            // Cancelar petición anterior si existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            if (
                !newOrder.idSucursalDestino ||
                !newOrder.peso ||
                newOrder.peso <= 0 ||
                !newOrder.tipoTransporte
            ) {
                setPrecioCalculado(null)
                return
            }

            // AbortController para evitar condición de carrera
            const abortController = new AbortController()
            abortControllerRef.current = abortController

            setCalculandoPrecio(true)
            try {
                const response = await fetch('/api/pedidos/calcular-precio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idSucursalDestino: newOrder.idSucursalDestino,
                        peso: newOrder.peso,
                        idServicioTransporte: newOrder.tipoTransporte,
                        idsServiciosAdicionales: newOrder.serviciosOpcionales,
                    }),
                    signal: abortController.signal,
                })

                if (response.ok) {
                    const data = await response.json()
                    setPrecioCalculado(data.precio)
                    setPrecioSinDescuento(data.precioSinDescuento)
                    setDescuentoPorcentaje(data.descuentoPorcentaje)
                } else {
                    console.error('Error al calcular precio:', response.statusText)
                    setPrecioCalculado(null)
                    setPrecioSinDescuento(null)
                    setDescuentoPorcentaje(0)
                }
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    return
                }
                console.error('Error al calcular precio:', error)
                setPrecioCalculado(null)
                setPrecioSinDescuento(null)
                setDescuentoPorcentaje(0)
            } finally {
                if (!abortController.signal.aborted) {
                    setCalculandoPrecio(false)
                }
            }
        }

        calcularPrecio()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [
        newOrder.idSucursalDestino,
        newOrder.peso,
        newOrder.tipoTransporte,
        newOrder.serviciosOpcionales,
    ])
    
    const handleCiudadChange = (ciudadNombre: string) => {
        const sucursal = sucursales.find(s => s.ciudadSucursal === ciudadNombre)
        if (sucursal) {
            setNewOrder({ 
                ...newOrder, 
                ciudadDestino: ciudadNombre,
                idSucursalDestino: sucursal.idSucursal
            })
        }
    }

    const handleSubmit = async () => {
        const resultado = await onCreateOrder(newOrder)
        
        if (resultado === true && onSuccess) {
            onSuccess()
            setIsOpen(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            onOpenChange?.(open)
        }}>
            <DialogTrigger asChild>
                <Button 
                    className="flex items-center gap-2"
                    disabled={disabled}
                >
                    <Plus className="h-4 w-4" />
                    Registrar Pedido
                </Button>
            </DialogTrigger>
            <DialogContent 
                className="w-full !max-w-[85vw] max-h-[90vh] overflow-y-auto"
                aria-describedby="dialog-description"
            >
                <DialogHeader>
                    <DialogTitle>Registrar nuevo Pedido</DialogTitle>
                    <div id="dialog-description" className="sr-only">
                        Formulario para registrar un nuevo pedido de entrega con datos del destinatario y servicios
                    </div>
                </DialogHeader>
                
                <div className="grid gap-6">
                    {/* Datos del destinatario */}
                    <DatosDestinatario 
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                        loading={loading}
                        fieldErrors={fieldErrors}
                        isFieldDisabled={() => false}
                    />

                    {/* Datos del pedido completo */}
                    <DatosPedido 
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                        sucursales={sucursales}
                        loading={loading}
                        loadingSucursales={false}
                        fieldErrors={fieldErrors}
                        onCiudadChange={handleCiudadChange}
                        isFieldDisabled={() => false}
                    />

                    {/* Datos de los servicios */}
                    <ServiciosSection 
                        servicioTransporte={servicioTransporte ? {
                            id_servicio: servicioTransporte.idServicio,
                            nombre_servicio: servicioTransporte.nombreServicio,
                            costo_servicio: servicioTransporte.costoServicio
                        } : null}
                        serviciosOpcionales={serviciosOpcionales.map(s => ({
                            id_servicio: s.idServicio,
                            nombre_servicio: s.nombreServicio,
                            costo_servicio: s.costoServicio
                        }))}
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                        loading={loading}
                        isFieldDisabled={() => false}
                    />

                    <div className="space-y-4 pt-4 border-t">
                        {(
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Precio Total Estimado:
                                    </span>
                                    <div className="text-right">
                                        {calculandoPrecio ? (
                                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                Calculando...
                                            </span>
                                        ) : precioCalculado !== null ? (
                                            <div className="flex items-center gap-2">
                                                {descuentoPorcentaje > 0 && (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                        ${precioSinDescuento?.toLocaleString("es-AR", {minimumFractionDigits: 2})}
                                                    </span>
                                                )}
                                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${precioCalculado.toLocaleString("es-AR", {minimumFractionDigits: 2})}
                                                    
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                Complete los datos
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {precioCalculado !== null && !calculandoPrecio && (
                                    <>
                                        {descuentoPorcentaje > 0 && (
                                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded dark:bg-green-950/30 dark:border-green-800">
                                                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                                    ¡Descuento del {descuentoPorcentaje}% aplicado! Ahorrás ${(precioSinDescuento! - precioCalculado).toLocaleString("es-AR", {minimumFractionDigits: 2})} en transporte
                                                </p>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            * Incluye transporte base + costo por distancia y peso + servicios adicionales
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

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
                            {loading ? "Creando pedido..." : "Crear Pedido"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}