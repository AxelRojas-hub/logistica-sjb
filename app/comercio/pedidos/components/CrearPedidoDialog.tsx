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
import { useEffect, useState, useCallback } from "react"
import { DatosDestinatario, DatosPedido, ServiciosSection } from "."

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
    // Datos del destinatario (→ cliente_destinatario)
    dniCliente: number
    nombreCliente: string
    telefonoCliente: string
    emailCliente: string
    direccionCliente: string
    
    // Datos del pedido (→ pedido)
    ciudadDestino: string
    idSucursalDestino: number
    peso: number
    fechaLimiteEntrega: string
    
    // Servicios dinámicos (→ pedido_servicio)
    tipoTransporte: number | null // ID del servicio de transporte (radio)
    serviciosOpcionales: number[] // Array de IDs de servicios opcionales (checkboxes)
}

interface CreateOrderDialogProps {
    onCreateOrder: (order: NewOrderForm) => Promise<boolean>
    disabled?: boolean
    loading?: boolean
    error?: string
    fieldErrors?: Record<string, string>
    onSuccess?: () => void // Nueva prop para limpiar el formulario
}

export function CreateOrderDialog({ 
    onCreateOrder, 
    disabled = false,
    loading = false,
    error,
    fieldErrors = {},
    onSuccess
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

    // Cargar todas las sucursales (simplificado)
    const fetchSucursales = useCallback(async () => {
        setLoadingSucursales(true)
        try {
            const response = await fetch('/api/sucursales')
            
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
    }, [fetchSucursales]) // Cargar servicios y sucursales al montar

    // Seleccionar transporte por defecto cuando se cargan los servicios
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



    // Limpiar formulario cuando se abre el dialog
    useEffect(() => {
        if (isOpen) {

            limpiarFormulario()
        }
    }, [isOpen, limpiarFormulario])
    
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    />

                    {/* Datos del pedido */}
                    <DatosPedido 
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                        sucursales={sucursales}
                        loading={loading}
                        loadingSucursales={loadingSucursales}
                        fieldErrors={fieldErrors}
                        onCiudadChange={handleCiudadChange}
                    />

                    {/* Servicios dinámicos */}
                    <ServiciosSection 
                        servicios={servicios}
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                        loading={loading}
                    />

                    {/* Sección de botón de crear pedido */}
                    <div className="space-y-4 pt-4 border-t">

                        {/* Mostrar error si existe */}
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