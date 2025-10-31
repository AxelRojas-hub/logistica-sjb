"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Pedido, EstadoPedido, Comercio } from "@/lib/types"
import { CreateOrderDialog, OrderDetailsDialog, OrdersTable } from "."

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
    
    // Servicios dinámicos
    tipoTransporte: number | null
    serviciosOpcionales: number[]
}

interface PedidosContentProps {
    pedidos: Pedido[]
    comercio: Comercio
}

export function PedidosContent({ pedidos: initialPedidos, comercio }: PedidosContentProps) {
    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null)
    const [orders, setOrders] = useState<Pedido[]>(initialPedidos)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})


    const validateField = (fieldName: keyof NewOrderForm, value: unknown): string | null => {
        switch (fieldName) {
            case 'dniCliente':
                if (!value || value === 0) return "El DNI es obligatorio"
                if (value.toString().length < 7 || value.toString().length > 8) return "El DNI debe tener entre 7 y 8 dígitos"
                return null
            
            case 'nombreCliente':
                if (!value || typeof value !== 'string' || value.trim() === "") return "El nombre del cliente es obligatorio"
                if (value.length < 2) return "El nombre debe tener al menos 2 caracteres"
                return null
            
            case 'telefonoCliente':
                if (!value || typeof value !== 'string' || value.trim() === "") return "El teléfono es obligatorio"
                if (!/^\d{8,15}$/.test(value.replace(/[\s-]/g, ''))) return "El teléfono debe tener entre 8 y 15 dígitos"
                return null
            
            case 'emailCliente':
                if (!value || typeof value !== 'string' || value.trim() === "") return "El email es obligatorio"
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingrese un email válido"
                return null
            
            case 'direccionCliente':
                if (!value || typeof value !== 'string' || value.trim() === "") return "La dirección es obligatoria"
                if (value.length < 5) return "La dirección debe tener al menos 5 caracteres"
                return null
            
            case 'ciudadDestino':
                if (!value || typeof value !== 'string' || value.trim() === "") return "Debe seleccionar una ciudad de destino"
                return null
            
            case 'peso':
                if (!value || typeof value !== 'number' || value <= 0) return "El peso debe ser mayor a 0 kg"
                if (value > 1000) return "El peso no puede superar los 1000 kg"
                return null
            
            case 'tipoTransporte':
                if (!value) return "Debe seleccionar un tipo de transporte"
                return null
            
            case 'fechaLimiteEntrega':
                if (!value || typeof value !== 'string' || value.trim() === "") return "La fecha límite de entrega es obligatoria"
                const today = new Date()
                const selectedDate = new Date(value)
                if (selectedDate <= today) return "La fecha debe ser posterior a hoy"
                return null
            
            default:
                return null
        }
    }

    const handleCreateOrder = async (orderData: NewOrderForm): Promise<boolean> => {
        const errors: Record<string, string> = {}
        
        Object.entries(orderData).forEach(([key, value]) => {
            const error = validateField(key as keyof NewOrderForm, value)
            if (error) {
                errors[key] = error
            }
        })
        
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            setError("Por favor corrija los errores en el formulario")
            return false
        }
        
        setLoading(true)
        
        try {
            const apiData = {
                ...orderData,
                idComercio: comercio.idComercio
            }
            
            const response = await fetch('/api/pedidos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            })
            
            const result = await response.json()
            
            if (!response.ok || !result.success) {
                console.error("Error de la API:", result.message || result.error)
                setError(result.message || "Error al crear el pedido")
                return false
            }
            
            // Crear pedido local para la UI
            const nuevoPedido: Pedido = {
                idPedido: result.data.pedidoId,
                idEnvio: null,
                idComercio: comercio.idComercio,
                idFactura: null,
                idSucursalDestino: orderData.idSucursalDestino,
                dniCliente: orderData.dniCliente,
                estadoPedido: "en_preparacion" as EstadoPedido,
                precio: 0,
                fechaEntrega: null,
                fechaLimiteEntrega: orderData.fechaLimiteEntrega,
            }

            setOrders(prev => [...prev, nuevoPedido])
            
            setError("")
            setFieldErrors({})
            
            return true
            
        } catch (error) {
            console.error("Error de conexión:", error)
            setError("Error de conexión. Intente nuevamente.")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async (orderId: number) => {
        
        setLoading(true)
        
        try {
            const response = await fetch('/api/pedidos/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idPedido: orderId })
            })
            
            const result = await response.json()
            
            if (!response.ok || !result.success) {
                console.error("Error al cancelar pedido:", result.message)
                setError(`Error al cancelar el pedido: ${result.message}`)
                return
            }
            
            setOrders(orders.map(order =>
                order.idPedido === orderId ? { ...order, estadoPedido: "cancelado" as EstadoPedido } : order
            ))
            
        } catch (error) {
            console.error("Error de conexión al cancelar pedido:", error)
            setError("Error de conexión al cancelar el pedido. Intente nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    const handleViewOrder = (order: Pedido) => {
        setSelectedOrder(order)
        setShowDetailsDialog(true)
    }

    const handleOrderSuccess = () => {
        setError("")
        setFieldErrors({})
    }

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al menú principal
                        </Button>
                    </Link>
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                    <p className="mt-2 text-muted-foreground">Crea y gestiona tus pedidos de entrega</p>
                    {comercio.estadoComercio === "deshabilitado" && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Comercio Deshabilitado
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>Su cuenta está deshabilitada por facturas pendientes de pago. No puede registrar nuevos pedidos hasta que sea reactivado.</p>
                                        <p>Vaya a la sección <span className="font-bold" >Facturas</span> para realizar su pago y reactivar el servicio.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Mis Pedidos</h2>
                        <CreateOrderDialog
                            onCreateOrder={handleCreateOrder}
                            disabled={comercio.estadoComercio === "deshabilitado" || loading}
                            loading={loading}
                            error={error}
                            fieldErrors={fieldErrors}
                            onSuccess={handleOrderSuccess}
                        />
                    </div>

                    <OrdersTable
                        orders={orders}
                        onViewOrder={handleViewOrder}
                        onCancelOrder={handleCancelOrder}
                        comercioHabilitado={comercio.estadoComercio === "habilitado"}
                    />

                    <OrderDetailsDialog
                        order={selectedOrder}
                        isOpen={showDetailsDialog}
                        onOpenChange={setShowDetailsDialog}
                    />
                </div>
            </div>
        </div>
    )
}
