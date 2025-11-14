"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import type { PedidoConDetalles } from "@/lib/models/Pedido"
import Link from "next/link"
import { toast } from "sonner"
import { ActionGlossary, OrdersTable } from "."

interface PedidosAdminContentProps {
    pedidos: Pedido[]
    idSucursalAdmin: number | null
}

export function PedidosAdminContent({ pedidos: initialPedidos, idSucursalAdmin }: PedidosAdminContentProps) {
    const [orders, setOrders] = useState<Pedido[]>(initialPedidos)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Filtrar pedidos basado en búsqueda y estado
    const filteredOrders = orders.filter(order => {
        const pedidoConDetalles = order as PedidoConDetalles
        const matchesSearch = searchTerm === "" ||
            order.idPedido.toString().includes(searchTerm) ||
            pedidoConDetalles.nombreComercio?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.estadoPedido === statusFilter

        return matchesSearch && matchesStatus
    })

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
                        
                        {/* Controles de búsqueda y filtrado */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por ID o nombre del comercio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="en_preparacion">En preparación</SelectItem>
                                    <SelectItem value="en_camino">En camino</SelectItem>
                                    <SelectItem value="en_sucursal">En sucursal</SelectItem>
                                    <SelectItem value="entregado">Entregado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <OrdersTable
                            orders={filteredOrders}
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
