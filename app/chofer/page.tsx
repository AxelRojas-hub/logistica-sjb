"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

{/* Contenido de secciones - Solo mostrar si hay una sección activa */ }
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Package,
    Search,
    Eye,
    Navigation,
    CheckCircle,
    Route,
    LucideTriangle as ExclamationTriangle,
    PackageCheck
} from "lucide-react"
import { mockDriverOrders, mockCurrentRoute } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

export default function ChoferPage() {
    const [activeDriverSection, setActiveDriverSection] = useState("")
    const [neighborhoodFilter, setNeighborhoodFilter] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null)
    const [deliveryData, setDeliveryData] = useState({ dni: "", receiverName: "" })
    const [orders, setOrders] = useState(mockDriverOrders)
    const [currentRoute, setCurrentRoute] = useState(mockCurrentRoute)

    const handleCheckIn = (branchName: string) => {
        setCurrentRoute(prev => {
            const branchIndex = prev.branches.findIndex(b => b.name === branchName)

            return {
                ...prev,
                branches: prev.branches.map((branch, index) => {
                    // La sucursal donde se hace check-in se marca como "current" (en progreso)
                    if (branch.name === branchName) {
                        return { ...branch, status: "current" as const }
                    }
                    // La sucursal anterior (que estaba en progreso) se marca como completada
                    if (index < branchIndex && branch.status === "current") {
                        return { ...branch, status: "completed" as const }
                    }
                    return branch
                }),
                currentBranch: branchName
            }
        })
    }

    const handleFinishRoute = () => {
        setCurrentRoute(prev => ({
            ...prev,
            branches: [] // Limpiar la lista de sucursales
        }))
    }

    const getNextBranch = () => {
        const currentIndex = currentRoute.branches.findIndex(branch => branch.status === "current")
        return currentRoute.branches[currentIndex + 1] || null
    }

    const isLastBranch = () => {
        const currentIndex = currentRoute.branches.findIndex(branch => branch.status === "current")
        return currentIndex === currentRoute.branches.length - 1
    }

    const handleDelivery = (orderId: string) => {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "entregado" } : order)))
        setDeliveryOrder(null)
        setDeliveryData({ dni: "", receiverName: "" })
    }

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

    const getFilteredOrders = () => {
        let filtered = orders

        if (neighborhoodFilter) {
            filtered = filtered.filter((order) => order.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase()))
        }

        return filtered.sort((a, b) => {
            if (a.status === "entregado" && b.status !== "entregado") return 1
            if (b.status === "entregado" && a.status !== "entregado") return -1
            return a.neighborhood.localeCompare(b.neighborhood)
        })
    }

    return (
        <TooltipProvider>
            <div className="h-screen bg-background flex flex-col overflow-hidden">
                {!activeDriverSection ? (
                    // Menu Inicial - Pantalla completa centrada
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-foreground">Panel de Chofer</h1>
                            <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
                                onClick={() => setActiveDriverSection("pedidos")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <Package className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Pedidos</h3>
                                    <p className="text-muted-foreground">Gestiona tus pedidos asignados</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
                                onClick={() => setActiveDriverSection("checkin")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Check-In</h3>
                                    <p className="text-muted-foreground">Realizar check-in en sucursal</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
                                onClick={() => setActiveDriverSection("ruta")}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <Route className="h-12 w-12 text-purple-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Consultar Ruta</h3>
                                    <p className="text-muted-foreground">Ver información de tu ruta</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    // Contenido de secciones
                    <div className="flex-1">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground">Panel de Chofer</h1>
                                <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                            </div>

                            {/* Botón para volver al menú principal */}
                            <div className="flex items-center gap-4 mb-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveDriverSection("")}
                                    className="flex items-center gap-2"
                                >
                                    ← Volver al menú principal
                                </Button>
                            </div>

                            {/* Pedidos Section */}
                            {activeDriverSection === "pedidos" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Pedidos Asignados</h2>
                                        <Badge variant="outline" className="text-lg px-3 py-1">
                                            {getFilteredOrders().filter((order) => order.status === "pendiente").length} pedidos pendientes
                                        </Badge>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle>Lista de Pedidos a Domicilio</CardTitle>
                                                    <CardDescription>
                                                        Pedidos ordenados alfabéticamente por barrio - Sucursal actual:{" "}
                                                        {mockCurrentRoute.currentBranch}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        placeholder="Buscar por barrio..."
                                                        value={neighborhoodFilter}
                                                        onChange={(e) => setNeighborhoodFilter(e.target.value)}
                                                        className="w-48"
                                                    />
                                                    <Search className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="bg-accent/50 p-3 rounded-lg">
                                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Glosario de Acciones:</h4>
                                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        <span>Ver pedido</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ExclamationTriangle className="h-3 w-3" />
                                                        <span>Reportar problema</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <PackageCheck className="h-3 w-3" />
                                                        <span>Entregar pedido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div>
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Pedido</th>
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Estado</th>
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Barrio</th>
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Destinatario</th>
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Ubicación</th>
                                                            <th className="text-left py-3 px-2 font-medium text-foreground">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getFilteredOrders().map((order, index) => (
                                                            <tr key={order.id} className="border-b hover:bg-accent/50">
                                                                <td className="py-4 px-4">
                                                                    <span className="font-mono text-sm">{order.id}</span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge className={getStatusColor(order.status)}>
                                                                        {order.status === "pendiente"
                                                                            ? "Pendiente"
                                                                            : order.status === "entregado"
                                                                                ? "Entregado"
                                                                                : order.status === "fallido"
                                                                                    ? "Fallido"
                                                                                    : order.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <Badge variant="outline" className="text-sm">
                                                                        {order.neighborhood}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div>
                                                                        <p className="font-medium text-sm">{order.recipient}</p>
                                                                        <p className="text-xs text-gray-500">{order.phone}</p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="text-sm text-foreground">{order.address}</p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex gap-1">
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <div>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                className="h-8 w-8 p-0"
                                                                                                onClick={() => setSelectedOrder(order)}
                                                                                            >
                                                                                                <Eye className="h-4 w-4" />
                                                                                            </Button>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            <p>Ver pedido</p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </div>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="backdrop-blur-sm bg-white/95">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Detalles del Pedido {selectedOrder?.id}</DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Información completa del pedido seleccionado
                                                                                    </DialogDescription>
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
                                                                                                <h4 className="font-medium mb-1">Ubicación</h4>
                                                                                                <p className="text-sm">{selectedOrder.address}</p>
                                                                                                <p className="text-xs text-gray-500">{selectedOrder.neighborhood}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-medium mb-1">Comercio</h4>
                                                                                            <p className="text-sm">{selectedOrder.business}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-medium mb-1">Tiempo Estimado</h4>
                                                                                            <p className="text-sm">{selectedOrder.estimatedTime}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-medium mb-1">Descripción del Producto</h4>
                                                                                            <p className="text-sm">{selectedOrder.description}</p>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                            <div>
                                                                                                <h4 className="font-medium mb-1">Peso</h4>
                                                                                                <p className="text-sm">{selectedOrder.weight}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-medium mb-1">Instrucciones Especiales</h4>
                                                                                            <p className="text-sm">{selectedOrder.specialInstructions}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                                    <ExclamationTriangle className="h-4 w-4 text-amber-600" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>Reportar problema</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>

                                                                        {order.status === "pendiente" && (
                                                                            <Dialog>
                                                                                <DialogTrigger asChild>
                                                                                    <div>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger asChild>
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-8 w-8 p-0"
                                                                                                    onClick={() => setDeliveryOrder(order)}
                                                                                                >
                                                                                                    <PackageCheck className="h-4 w-4 text-green-600" />
                                                                                                </Button>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent>
                                                                                                <p>Entregar pedido</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="backdrop-blur-sm bg-white/95">
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>Confirmar Entrega - {deliveryOrder?.id}</DialogTitle>
                                                                                        <DialogDescription>
                                                                                            Completa la información para confirmar la entrega del pedido
                                                                                        </DialogDescription>
                                                                                    </DialogHeader>
                                                                                    <div className="grid gap-4">
                                                                                        <div className="space-y-2">
                                                                                            <label className="text-sm font-medium">
                                                                                                DNI de quien recibe *
                                                                                            </label>
                                                                                            <Input
                                                                                                placeholder="Ingrese el DNI"
                                                                                                value={deliveryData.dni}
                                                                                                onChange={(e) =>
                                                                                                    setDeliveryData({ ...deliveryData, dni: e.target.value })
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <div className="space-y-2">
                                                                                            <label className="text-sm font-medium">
                                                                                                Nombre de quien recibe *
                                                                                            </label>
                                                                                            <Input
                                                                                                placeholder="Ingrese el nombre completo"
                                                                                                value={deliveryData.receiverName}
                                                                                                onChange={(e) =>
                                                                                                    setDeliveryData({ ...deliveryData, receiverName: e.target.value })
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex gap-2 pt-4">
                                                                                            <Button
                                                                                                onClick={() => deliveryOrder?.id && handleDelivery(deliveryOrder.id)}
                                                                                                disabled={!deliveryData.dni || !deliveryData.receiverName}
                                                                                                className="flex-1"
                                                                                            >
                                                                                                <PackageCheck className="h-4 w-4 mr-2" />
                                                                                                Confirmar Entrega
                                                                                            </Button>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                onClick={() => setDeliveryOrder(null)}
                                                                                                className="flex-1"
                                                                                            >
                                                                                                Cancelar
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Check-in en Sucursal */}
                            {activeDriverSection === "checkin" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Check-in en Sucursal</h2>
                                        <Badge variant="outline" className="text-lg px-3 py-1">
                                            Ruta: {currentRoute.name}
                                        </Badge>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Estado de la Ruta Actual</CardTitle>
                                            <CardDescription>Progreso y próximas sucursales en tu ruta</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                {currentRoute.branches.length === 0 ? (
                                                    <div className="text-center py-8">
                                                        <PackageCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-foreground mb-2">Ruta completada</h3>
                                                        <p className="text-muted-foreground">Has finalizado exitosamente la ruta de envío</p>
                                                    </div>
                                                ) : (
                                                    currentRoute.branches.map((branch, index) => {
                                                        const nextBranch = getNextBranch()
                                                        const showCheckInButton = nextBranch?.name === branch.name
                                                        const showFinishButton = branch.status === "current" && isLastBranch()

                                                        return (
                                                            <div
                                                                key={branch.name}
                                                                className={`flex items-center justify-between p-3 rounded-lg border ${branch.status === "current"
                                                                    ? "bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700"
                                                                    : branch.status === "completed"
                                                                        ? "bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700"
                                                                        : "bg-accent/30 border-border"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${branch.status === "completed"
                                                                            ? "bg-green-500 text-white"
                                                                            : branch.status === "current"
                                                                                ? "bg-blue-500 text-white"
                                                                                : "bg-gray-300 text-gray-600"
                                                                            }`}
                                                                    >
                                                                        {index + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium">{branch.name}</p>
                                                                        <p className="text-sm text-gray-500">Horario estimado: {branch.time}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        className={
                                                                            branch.status === "completed"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : branch.status === "current"
                                                                                    ? "bg-blue-100 text-blue-800"
                                                                                    : "bg-gray-100 text-gray-600"
                                                                        }
                                                                    >
                                                                        {branch.status === "completed"
                                                                            ? "Completado"
                                                                            : branch.status === "current"
                                                                                ? "En progreso"
                                                                                : "Pendiente"}
                                                                    </Badge>
                                                                    {showCheckInButton && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => handleCheckIn(branch.name)}
                                                                            className="bg-green-600 hover:bg-green-700"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                                            Check-in
                                                                        </Button>
                                                                    )}
                                                                    {showFinishButton && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={handleFinishRoute}
                                                                            className="bg-purple-600 hover:bg-purple-700"
                                                                        >
                                                                            <PackageCheck className="h-4 w-4 mr-2" />
                                                                            Finalizar ruta de envío
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Consultar Ruta */}
                            {activeDriverSection === "ruta" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Ruta Asignada</h2>
                                        <Button variant="outline">
                                            <Navigation className="h-4 w-4 mr-2" />
                                            Confirmar Ruta
                                        </Button>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Información de la Ruta</CardTitle>
                                            <CardDescription>{mockCurrentRoute.name}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h3 className="font-medium">Detalles Generales</h3>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Total de sucursales:</span>
                                                            <span className="font-medium">{mockCurrentRoute.totalBranches}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Sucursal actual:</span>
                                                            <span className="font-medium">{mockCurrentRoute.currentBranch}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Próxima sucursal:</span>
                                                            <span className="font-medium">{mockCurrentRoute.nextBranch}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Finalización estimada:</span>
                                                            <span className="font-medium">{mockCurrentRoute.estimatedCompletion}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="font-medium">Secuencia de Sucursales</h3>
                                                    <div className="space-y-2">
                                                        {mockCurrentRoute.branches.map((branch, index) => (
                                                            <div key={branch.name} className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${branch.status === "completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : branch.status === "current"
                                                                            ? "bg-blue-100 text-blue-800"
                                                                            : "bg-gray-100 text-gray-600"
                                                                        }`}
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex-1 flex justify-between items-center">
                                                                    <span className={branch.status === "current" ? "font-medium" : ""}>{branch.name}</span>
                                                                    <span className="text-sm text-gray-500">{branch.time}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}