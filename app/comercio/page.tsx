"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    Package,
    FileText,
    ScrollText,
    Eye,
    Download,
    CreditCard,
    Plus,
    X,
    Calendar,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    Clock,
} from "lucide-react"
import {
    mockBusinessOrders,
    mockInvoices,
    mockContract,
    mockAvailableServices
} from "@/lib/mock-data"
import type { BusinessOrder, Invoice } from "@/lib/types"

export default function ComercioPage() {
    const [activeSection, setActiveSection] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<BusinessOrder | null>(null)
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
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
            case "pagada":
                return "Pagada"
            case "vencida":
                return "Vencida"
            case "activo":
                return "Activo"
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
                    <h1 className="text-3xl font-bold text-foreground">Panel de Comercio</h1>
                    <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                </div>

                {/* Menu Inicial - Solo mostrar si no hay sección activa */}
                {!activeSection && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
                                onClick={() => setActiveSection("pedidos")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <Package className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Pedidos</h3>
                                    <p className="text-muted-foreground">Gestiona tus pedidos y entregas</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
                                onClick={() => setActiveSection("facturas")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <FileText className="h-12 w-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Facturas</h3>
                                    <p className="text-muted-foreground">Consulta tu historial de facturación</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
                                onClick={() => setActiveSection("contrato")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <ScrollText className="h-12 w-12 text-purple-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Mi Contrato</h3>
                                    <p className="text-muted-foreground">Gestiona tu contrato y servicios</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Contenido de secciones - Solo mostrar si hay una sección activa */}
                {activeSection && (
                    <div className="space-y-6">
                        {/* Botón para volver al menú principal */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="outline"
                                onClick={() => setActiveSection("")}
                                className="flex items-center gap-2"
                            >
                                ← Volver al menú principal
                            </Button>
                        </div>

                        {/* Pedidos Section */}
                        {activeSection === "pedidos" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-foreground">Gestión de Pedidos</h2>
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
                        )}

                        {/* Facturas Section */}
                        {activeSection === "facturas" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-foreground">Historial de Facturas</h2>
                                </div>

                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha Emisión</TableHead>
                                                <TableHead>Vencimiento</TableHead>
                                                <TableHead>Servicios</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Monto</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockInvoices.map((invoice) => (
                                                <TableRow key={invoice.id} className="hover:bg-accent/50">
                                                    <TableCell>{invoice.issuedDate}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell>
                                                        <p className="text-sm max-w-[150px] truncate" title={invoice.services.join(", ")}>
                                                            {invoice.services.join(", ")}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={getStatusColor(invoice.status)}>
                                                                {getStatusText(invoice.status)}
                                                            </Badge>
                                                            {invoice.status === "vencida" && (
                                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-lg">
                                                        ${invoice.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Detalle de Factura {selectedInvoice?.id}</DialogTitle>
                                                                    </DialogHeader>
                                                                    {selectedInvoice && (
                                                                        <div className="grid gap-4">
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <h4 className="font-medium mb-1">Estado</h4>
                                                                                    <Badge className={getStatusColor(selectedInvoice.status)}>
                                                                                        {getStatusText(selectedInvoice.status)}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium mb-1">Monto Total</h4>
                                                                                    <p className="text-xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <h4 className="font-medium mb-1">Fecha de emisión</h4>
                                                                                    <p className="text-sm">{selectedInvoice.issuedDate}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <h4 className="font-medium mb-1">Fecha de vencimiento</h4>
                                                                                    <p className="text-sm">{selectedInvoice.dueDate}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-medium mb-1">Descripción</h4>
                                                                                <p className="text-sm">{selectedInvoice.description}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-medium mb-1">Servicios incluidos</h4>
                                                                                <ul className="text-sm space-y-1">
                                                                                    {selectedInvoice.services.map((service, index) => (
                                                                                        <li key={index} className="flex items-center gap-2">
                                                                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                                                                            {service}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-medium mb-1">Pedidos incluidos</h4>
                                                                                <p className="text-sm">{selectedInvoice.orders.join(", ")}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button variant="outline" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                            {invoice.status !== "pagada" && (
                                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                                    <CreditCard className="h-4 w-4" />
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
                        )}

                        {/* Contrato Section */}
                        {activeSection === "contrato" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold text-foreground">Mi Contrato</h2>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl">Contrato {mockContract.id}</CardTitle>
                                                <CardDescription>Plan de servicios logísticos</CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(mockContract.status)}>
                                                {getStatusText(mockContract.status)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Fecha inicio</p>
                                                <p className="font-medium flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {mockContract.startDate}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Fecha fin</p>
                                                <p className="font-medium flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {mockContract.endDate}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Tarifa mensual</p>
                                                <p className="font-bold text-lg flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    ${mockContract.monthlyFee.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Servicios incluidos</p>
                                            <div className="space-y-1">
                                                {mockContract.services.map((service, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                        <span className="text-sm">{service}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>                                        <div className="border-t pt-6">
                                            <h3 className="font-medium mb-4">Servicios Adicionales Disponibles</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {mockAvailableServices
                                                    .filter(service => !mockContract.services.includes(service.name))
                                                    .map((service) => (
                                                        <Card key={service.id} className="border border-gray-200">
                                                            <CardContent className="p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">{service.name}</h4>
                                                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold">${service.monthlyFee.toLocaleString()}</p>
                                                                        <p className="text-xs text-gray-500">por mes</p>
                                                                    </div>
                                                                </div>
                                                                <Button size="sm" className="w-full mt-3">
                                                                    <Plus className="h-3 w-3 mr-2" />
                                                                    Agregar
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button className="dark:text-white bg-blue-600 hover:bg-blue-700">
                                                Renovar Contrato
                                            </Button>
                                            <Button variant="outline">
                                                Modificar Plan
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
