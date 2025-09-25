"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Truck,
    Filter,
    Search,
    Eye,
    Clock,
    CheckCircle,
    X,
    ArrowLeft
} from "lucide-react"
import { mockBusinessOrders } from "@/lib/mock-data"
import type { BusinessOrder } from "@/lib/types"
import Link from "next/link"

export default function AdminPedidosPage() {
    const [orders, setOrders] = useState(mockBusinessOrders)
    const [selectedOrder, setSelectedOrder] = useState<BusinessOrder | null>(null)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "en proceso":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "completado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "en_transito":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "entregado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
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

    const handleUpdateOrderStatus = (orderId: string, newStatus: "pendiente" | "en_transito" | "entregado" | "cancelado") => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ))
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                        <p className="mt-2 text-muted-foreground">Administra y controla todos los pedidos del sistema</p>
                    </div>

                    {/* Botón para volver al menú principal */}
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

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-foreground">Lista de Pedidos</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtrar
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar
                                </Button>
                            </div>
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
                                                                    <div className="flex gap-2 pt-4 border-t">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "en_transito")}
                                                                            disabled={selectedOrder.status === "entregado" || selectedOrder.status === "cancelado"}
                                                                        >
                                                                            Marcar en Tránsito
                                                                        </Button>
                                                                        <Button
                                                                            variant="default"
                                                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "entregado")}
                                                                            disabled={selectedOrder.status === "entregado" || selectedOrder.status === "cancelado"}
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                                            Marcar Entregado
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "cancelado")}
                                                                            disabled={selectedOrder.status === "entregado" || selectedOrder.status === "cancelado"}
                                                                        >
                                                                            <X className="h-4 w-4 mr-2" />
                                                                            Cancelar
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleUpdateOrderStatus(order.id, "en_transito")}
                                                                disabled={order.status === "entregado" || order.status === "cancelado"}
                                                            >
                                                                <Truck className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Marcar en tránsito</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleUpdateOrderStatus(order.id, "entregado")}
                                                                disabled={order.status === "entregado" || order.status === "cancelado"}
                                                                className="border-green-500 hover:bg-green-50"
                                                            >
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Marcar como entregado</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Resumen de estadísticas */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <Clock className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {orders.filter(order => order.status === "pendiente").length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Truck className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">En Tránsito</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {orders.filter(order => order.status === "en_transito").length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Entregados</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {orders.filter(order => order.status === "entregado").length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <X className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Cancelados</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {orders.filter(order => order.status === "cancelado").length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}