"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import Link from "next/link"
import { ActionGlossary, OrdersTable } from "."

interface PedidosAdminContentProps {
    pedidos: Pedido[]
}

export function PedidosAdminContent({ pedidos: initialPedidos }: PedidosAdminContentProps) {
    const [orders, setOrders] = useState<Pedido[]>(initialPedidos)

    const handleUpdateOrderStatus = (orderId: number, newStatus: EstadoPedido) => {
        setOrders(orders.map(order =>
            order.idPedido === orderId ? { ...order, estadoPedido: newStatus } : order
        ))
    }

    const handleSelectOrder = (order: Pedido) => {
        // TODO: Implementar selección de pedido
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
                        />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
