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
import type { Pedido} from "@/lib/types"

interface Sucursal {
    idSucursal: number
    direccionSucursal: string
    ciudadSucursal: string
}

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

interface CreateOrderDialogProps {
    onCreateOrder: (order: NewOrderForm) => Promise<boolean>
    disabled?: boolean
    loading?: boolean
    error?: string
    fieldErrors?: Record<string, string>
    onSuccess?: () => void
    initialValues?: Pedido | null
    modoEdicion?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateOrderDialog({ 
    onCreateOrder, 
    disabled = false,
    loading = false,
    error,
    fieldErrors = {},
    onSuccess,
    initialValues = null,
    modoEdicion = false,
    open,
    onOpenChange
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

    const [servicios, setServicios] = useState<Servicio[]>([])
    const [sucursales, setSucursales] = useState<Sucursal[]>([])
    const [loadingSucursales, setLoadingSucursales] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [precioCalculado, setPrecioCalculado] = useState<number | null>(null)
    const [precioSinDescuento, setPrecioSinDescuento] = useState<number | null>(null)
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0)
    const [calculandoPrecio, setCalculandoPrecio] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const dialogOpen = modoEdicion ? (open ?? false) : isOpen
    const handleOpenChange = modoEdicion ? (onOpenChange ?? setIsOpen) : setIsOpen

    const isFieldDisabled = (fieldName: string) => {
        if (!modoEdicion) return false // En modo creación, todos habilitados
        
        // En modo edición, solo habilitar estos campos:
        const camposEditables = ['ciudadDestino', 'idSucursalDestino', 'fechaLimiteEntrega']
        return !camposEditables.includes(fieldName)
    }
    useEffect(() => {
        if (modoEdicion && initialValues && sucursales.length > 0) {
            const sucursalDestino = sucursales.find(s => s.idSucursal === initialValues.idSucursalDestino)
            const ciudadDestino = sucursalDestino?.ciudadSucursal || ""
            
            let fechaFormateada = ""
            if (initialValues.fechaLimiteEntrega) {
                const fechaString = initialValues.fechaLimiteEntrega
                if (fechaString.includes('T')) {
                    fechaFormateada = fechaString.split('T')[0]
                } else {
                    fechaFormateada = fechaString.slice(0, 10)
                }
            }
            
            setNewOrder({
                ciudadDestino: ciudadDestino,
                idSucursalDestino: initialValues.idSucursalDestino,
                fechaLimiteEntrega: fechaFormateada,
                
                dniCliente: initialValues.dniCliente,
                nombreCliente: "",
                telefonoCliente: "",
                emailCliente: "",
                direccionCliente: "",
                peso: 1,
                tipoTransporte: null,
                serviciosOpcionales: []
            })
        }
    }, [modoEdicion, initialValues, sucursales])

    const limpiarFormulario = useCallback(() => {
        const servicioTransporte = servicios.find(s => 
            s.nombre_servicio.toLowerCase().includes('transporte')
        )
        
        const transportePorDefecto = servicioTransporte?.id_servicio || null
        
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
            tipoTransporte: transportePorDefecto,
            serviciosOpcionales: []
        })
    }, [servicios])

    const fetchServicios = async () => {
        try {
            const response = await fetch('/api/servicios')
            if (response.ok) {
                const data = await response.json()
                setServicios(data)
            }
        } catch (error) {
            console.error("Error al cargar servicios:", error)
        }
    }

    const fetchSucursales = useCallback(async () => {
        setLoadingSucursales(true)
        try {
            const response = await fetch('/api/sucursales/alcanzables')
            
            if (response.ok) {
                const data = await response.json()
                setSucursales(data)
            } else {
                console.error('Error al cargar sucursales:', response.statusText)
            }
        } catch (error) {
            console.error("Error al cargar sucursales:", error)
        } finally {
            setLoadingSucursales(false)
        }
    }, [])

    useEffect(() => {
        fetchServicios()
        fetchSucursales()
    }, [fetchSucursales])

    useEffect(() => {
        if (servicios.length > 0) {
            const servicioTransporte = servicios.find(s => 
                s.nombre_servicio.toLowerCase().includes('transporte')
            )
            
            if (servicioTransporte && newOrder.tipoTransporte === null) {
                setNewOrder(prev => ({
                    ...prev,
                    tipoTransporte: servicioTransporte.id_servicio
                }))
            }
        }
    }, [servicios, newOrder.tipoTransporte])


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

            // TODO: Cambiar precio en el modoEdicion
            if (
                modoEdicion ||
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
        modoEdicion,
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
            handleOpenChange(false)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            {!modoEdicion && (
                <DialogTrigger asChild>
                    <Button 
                        className="flex items-center gap-2"
                        disabled={disabled}
                    >
                        <Plus className="h-4 w-4" />
                        Registrar Pedido
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent 
                className="w-full !max-w-[85vw] max-h-[90vh] overflow-y-auto"
                aria-describedby="dialog-description"
            >
                <DialogHeader>
                    <DialogTitle>
                        {modoEdicion ? "Editar Pedido" : "Registrar nuevo Pedido"}
                    </DialogTitle>
                    <div id="dialog-description" className="sr-only">
                        {modoEdicion 
                            ? "Formulario para editar los datos de un pedido existente"
                            : "Formulario para registrar un nuevo pedido de entrega con datos del destinatario y servicios"
                        }
                    </div>
                </DialogHeader>
                
                <div className="grid gap-6">
                    {!modoEdicion && (
                        <>
                            {/* Datos del destinatario */}
                            <DatosDestinatario 
                                newOrder={newOrder}
                                setNewOrder={setNewOrder}
                                loading={loading}
                                fieldErrors={fieldErrors}
                                isFieldDisabled={isFieldDisabled}
                            />

                            {/* Datos del pedido completo */}
                            <DatosPedido 
                                newOrder={newOrder}
                                setNewOrder={setNewOrder}
                                sucursales={sucursales}
                                loading={loading}
                                loadingSucursales={loadingSucursales}
                                fieldErrors={fieldErrors}
                                onCiudadChange={handleCiudadChange}
                                isFieldDisabled={isFieldDisabled}
                            />

                            {/* Datos de los servicios */}
                            <ServiciosSection 
                                servicios={servicios}
                                newOrder={newOrder}
                                setNewOrder={setNewOrder}
                                loading={loading}
                                isFieldDisabled={isFieldDisabled}
                            />
                        </>
                    )}

                    {modoEdicion && (
                        <>
                            {/* Solo se muestran los campos modificables */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Modificar Pedido</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Solo puedes modificar la ciudad de destino y la fecha límite de entrega.
                                </p>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Ciudad de destino *
                                        </label>
                                        <select
                                            value={newOrder.ciudadDestino}
                                            onChange={(e) => handleCiudadChange(e.target.value)}
                                            disabled={loading || loadingSucursales}
                                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.ciudadDestino ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                                        >
                                            <option value="">Seleccionar ciudad</option>
                                            {Array.from(new Set(sucursales.map(s => s.ciudadSucursal)))
                                                .filter(ciudad => ciudad && ciudad.trim() !== "")
                                                .sort()
                                                .map((ciudad, index) => (
                                                    <option key={`ciudad-${index}-${ciudad}`} value={ciudad}>
                                                        {ciudad}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        {fieldErrors.ciudadDestino && (
                                            <p className="text-sm text-red-600">{fieldErrors.ciudadDestino}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Fecha límite de entrega *
                                        </label>
                                        <input
                                            type="date"
                                            value={newOrder.fechaLimiteEntrega}
                                            onChange={(e) => setNewOrder({ ...newOrder, fechaLimiteEntrega: e.target.value })}
                                            disabled={loading}
                                            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.fechaLimiteEntrega ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                                        />
                                        {fieldErrors.fechaLimiteEntrega && (
                                            <p className="text-sm text-red-600">{fieldErrors.fechaLimiteEntrega}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-4 pt-4 border-t">
                        {!modoEdicion && (
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
                                                        ${precioSinDescuento?.toFixed(2)}
                                                    </span>
                                                )}
                                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${precioCalculado.toFixed(2)}
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
                                                    ¡Descuento del {descuentoPorcentaje}% aplicado! Ahorrás ${(precioSinDescuento! - precioCalculado).toFixed(2)} en transporte
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
                            {loading 
                                ? (modoEdicion ? "Actualizando pedido..." : "Creando pedido...")
                                : (modoEdicion ? "Actualizar Pedido" : "Crear Pedido")
                            }
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}