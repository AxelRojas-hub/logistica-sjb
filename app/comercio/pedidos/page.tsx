"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Plus,
    X,
    Eye,
    ArrowLeft
} from "lucide-react"
import { mockBusinessOrders } from "@/lib/mock-data"
import type { BusinessOrder } from "@/lib/types"
import Link from "next/link"

export default function ComercioPedidosPage() {
    const [selectedOrder, setSelectedOrder] = useState<BusinessOrder | null>(null)
    const [orders, setOrders] = useState(mockBusinessOrders)
    const [newOrder, setNewOrder] = useState({
        recipient: "",
        address: "",
        neighborhood: "",
        phone: "",
        description: "",
        weight: "",
        specialInstructions: "",
        totalAmount: 0,
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "en proceso":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "completado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "pendiente":
                return "Pendiente"
            case "en_transito":
                return "En Tránsito"
            case "entregado":
                return "Entregado"
            case "cancelado":
                return "Cancelado"
            default:
                return status
        }
    }

    const handleCreateOrder = () => {
        const order: BusinessOrder = {
            id: `PED-COM-${String(orders.length + 1).padStart(3, '0')}`,
            ...newOrder,
            status: "pendiente",
            createdAt: new Date().toISOString().split('T')[0],
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
        setOrders([...orders, order])
        setNewOrder({
            recipient: "",
            address: "",
            neighborhood: "",
            phone: "",
            description: "",
            weight: "",
            specialInstructions: "",
            totalAmount: 0,
        })
    }

    const handleCancelOrder = (orderId: string) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: "cancelado" } : order
        ))
    }

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                    <p className="mt-2 text-muted-foreground">Crea y gestiona tus pedidos de entrega</p>
                </div>

                {/* Botón para volver al menú principal */}
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

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Mis Pedidos</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Crear Nuevo Pedido
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Crear Nuevo Pedido</DialogTitle>
                                    <DialogDescription>
                                        Completa la información para crear un nuevo pedido de entrega
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Destinatario *</label>
                                            <Input
                                                placeholder="Nombre completo"
                                                value={newOrder.recipient}
                                                onChange={(e) => setNewOrder({ ...newOrder, recipient: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Teléfono *</label>
                                            <Input
                                                placeholder="+54 11 1234-5678"
                                                value={newOrder.phone}
                                                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Dirección *</label>
                                        <Input
                                            placeholder="Dirección completa"
                                            value={newOrder.address}
                                            onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Barrio *</label>
                                            <Input
                                                placeholder="Barrio"
                                                value={newOrder.neighborhood}
                                                onChange={(e) => setNewOrder({ ...newOrder, neighborhood: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Peso *</label>
                                            <Input
                                                placeholder="2.5 kg"
                                                value={newOrder.weight}
                                                onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Descripción del producto *</label>
                                        <Textarea
                                            placeholder="Describe el producto a entregar"
                                            value={newOrder.description}
                                            onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Monto *</label>
                                            <Input
                                                type="number"
                                                placeholder="15000"
                                                value={newOrder.totalAmount}
                                                onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Instrucciones especiales</label>
                                        <Textarea
                                            placeholder="Instrucciones adicionales para la entrega"
                                            value={newOrder.specialInstructions}
                                            onChange={(e) => setNewOrder({ ...newOrder, specialInstructions: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Button onClick={handleCreateOrder} className="flex-1">
                                            Crear Pedido
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Destinatario</TableHead>
                                    <TableHead className="w-[120px]">Estado</TableHead>
                                    <TableHead className="w-[150px]">Entrega Estimada</TableHead>
                                    <TableHead className="w-[120px]">Monto</TableHead>
                                    <TableHead className="w-[120px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-accent/50">
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="font-medium">{order.recipient}</p>
                                                <p className="text-sm text-muted-foreground">{order.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)}>
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.estimatedDelivery}</TableCell>
                                        <TableCell className="font-bold text-lg">
                                            ${order.totalAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Detalles del Pedido {selectedOrder?.id}</DialogTitle>
                                                        </DialogHeader>
                                                        {selectedOrder && (
                                                            <div className="grid gap-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Destinatario</h4>
                                                                        <p className="text-sm">{selectedOrder.recipient}</p>
                                                                        <p className="text-xs text-gray-500">{selectedOrder.phone}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Estado</h4>
                                                                        <Badge className={getStatusColor(selectedOrder.status)}>
                                                                            {getStatusText(selectedOrder.status)}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Dirección</h4>
                                                                    <p className="text-sm">{selectedOrder.address}</p>
                                                                    <p className="text-xs text-gray-500">{selectedOrder.neighborhood}</p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Creado</h4>
                                                                        <p className="text-sm">{selectedOrder.createdAt}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Entrega estimada</h4>
                                                                        <p className="text-sm">{selectedOrder.estimatedDelivery}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Descripción</h4>
                                                                    <p className="text-sm">{selectedOrder.description}</p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Peso</h4>
                                                                        <p className="text-sm">{selectedOrder.weight}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Monto</h4>
                                                                        <p className="text-sm">${selectedOrder.totalAmount.toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                                {selectedOrder.specialInstructions && (
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Instrucciones especiales</h4>
                                                                        <p className="text-sm">{selectedOrder.specialInstructions}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                {order.status === "pendiente" && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    )
}