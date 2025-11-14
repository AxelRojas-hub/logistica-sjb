"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"
import { ActionGlossary, OrdersTable } from "."

interface PedidosAdminContentProps {
    pedidos: Pedido[]
    idSucursalAdmin: number | null
}

export function PedidosAdminContent({ pedidos: initialPedidos, idSucursalAdmin }: PedidosAdminContentProps) {
    const [orders, setOrders] = useState<Pedido[]>(initialPedidos)

    const handleUpdateOrderStatus = async (orderId: number, newStatus: EstadoPedido) => {
        const response = await fetch("/api/pedidos/marcar-entregado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPedido: orderId })
        })

        const result = await response.json()
        
        if (result.success) {
            // Actualizar el pedido con el nuevo precio y fecha de entrega
            setOrders(orders.map(order =>
                order.idPedido === orderId 
                    ? { 
                        ...order, 
                        estadoPedido: newStatus, 
                        precio: result.precioFinal || order.precio,
                        fechaEntrega: new Date().toISOString()
                    } 
                    : order
            ))

            toast.success("Pedido marcado como entregado")
        } else {
            toast.error(result.message || "Error al marcar pedido como entregado")
        }
    }

    const handleSelectOrder = (order: Pedido) => {
        console.log("Selected order:", order)
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
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
                        <p className="mt-2 text-muted-foreground">Administra y controla todos los pedidos de tu sucursal</p>
                    </div>
                    <div className="space-y-6">
                        <ActionGlossary />
                        <OrdersTable
                            orders={orders}
                            onUpdateStatus={handleUpdateOrderStatus}
                            onSelectOrder={handleSelectOrder}
                            idSucursalAdmin={idSucursalAdmin}
                        />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
