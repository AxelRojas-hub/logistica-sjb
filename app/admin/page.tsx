"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Truck,
    Building2,
    FileText,
    Package,
    MapPin,
    Clock,
    AlertTriangle,
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    DollarSign,
} from "lucide-react"
import { mockShipments, mockBusinesses, mockRoutes, mockBranches } from "@/lib/mock-data"

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("")

    const getStatusColor = (status: string) => {
        switch (status) {
            case "En ruta":
                return "bg-blue-100 text-blue-800"
            case "En sucursal":
                return "bg-green-100 text-green-800"
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

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
                        <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                    </div>

                    {/* Menu Inicial - Solo mostrar si no hay sección activa */}
                    {!activeSection && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <Card
                                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
                                    onClick={() => setActiveSection("envios")}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                        <Truck className="h-12 w-12 text-blue-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Envíos</h3>
                                        <p className="text-muted-foreground">Gestiona y monitorea todos los envíos</p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
                                    onClick={() => setActiveSection("comercios")}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                        <Building2 className="h-12 w-12 text-green-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Comercios</h3>
                                        <p className="text-muted-foreground">Administra comercios y contratos</p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
                                    onClick={() => setActiveSection("reportes")}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                        <FileText className="h-12 w-12 text-purple-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Reportes</h3>
                                        <p className="text-muted-foreground">Genera y visualiza reportes</p>
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

                            {/* Envíos Section */}
                            {activeSection === "envios" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Gestión de Envíos</h2>
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

                                    {/* Shipments Grid */}
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {mockShipments.map((shipment) => (
                                            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-lg">{shipment.id}</CardTitle>
                                                        <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                                                    </div>
                                                    <CardDescription>Chofer: {shipment.driver}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Package className="h-4 w-4 text-gray-500" />
                                                        <span>{shipment.orders} pedidos</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                        <span>{shipment.currentBranch}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span>Actualizado: {shipment.lastUpdate}</span>
                                                    </div>
                                                    <div className="pt-2 border-t">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Duración: {shipment.estimatedDuration}</span>
                                                            <span>Distancia: {shipment.totalDistance}</span>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Ver Detalles
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Routes and Branches */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Catálogo de Rutas</CardTitle>
                                                <CardDescription>Rutas predefinidas disponibles</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="max-h-80 overflow-y-auto space-y-4">
                                                    {mockRoutes.map((route) => (
                                                        <div key={route.id} className="border rounded-lg p-3">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-medium">{route.name}</h4>
                                                                <span className="text-sm text-muted-foreground">{route.estimatedTime}</span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">{route.branches.join(" → ")}</p>
                                                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{route.segments} segmentos</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Catálogo de Sucursales</CardTitle>
                                                <CardDescription>Sucursales disponibles</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="max-h-80 overflow-y-auto space-y-4">
                                                    {mockBranches.map((branch) => (
                                                        <div key={branch.id} className="border rounded-lg p-3">
                                                            <h4 className="font-medium mb-1">{branch.name}</h4>
                                                            <p className="text-sm text-muted-foreground mb-1">{branch.location}</p>
                                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                                <span>{branch.phone}</span>
                                                                <span>{branch.email}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Comercios Section */}
                            {activeSection === "comercios" && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Gestión de Comercios</h2>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Input placeholder="Buscar comercio..." className="w-full sm:w-64" />

                                        </div>
                                    </div>

                                    <div className="bg-accent/50 p-3 rounded-lg">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Glosario de Acciones:</h4>
                                        <div className="dark:text-gray-300 flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                <span>Ver detalles del comercio</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                <span>Historial de pedidos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Card className="overflow-hidden w-full">
                                        <div className="overflow-x-auto">
                                            <Table className="w-full">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead >Nombre</TableHead>
                                                        <TableHead >Contacto</TableHead>
                                                        <TableHead >Contrato</TableHead>
                                                        <TableHead >Estado</TableHead>
                                                        <TableHead >Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {mockBusinesses.map((business) => (
                                                        <TableRow key={business.id} className="hover:bg-accent/50">
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-medium text-sm truncate max-w-[180px]" title={business.name}>
                                                                        {business.name}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge className={getStatusColor(business.status)} variant="outline">
                                                                            {business.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="text-sm truncate max-w-[160px]" title={business.email}>
                                                                        {business.email}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground truncate max-w-[160px]" title={business.fiscalAddress}>
                                                                        {business.fiscalAddress}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="text-sm font-medium">{business.contractDuration}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {business.services.length} servicios
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        ${business.totalDebt.toLocaleString()}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        {business.pendingInvoices > 0 && (
                                                                            <Badge variant="destructive" className="text-xs">
                                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                                {business.pendingInvoices}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-1">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="outline" size="sm">
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Ver detalles del comercio</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="outline" size="sm">
                                                                                <FileText className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Historial de pedidos</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Reportes Section */}
                            {activeSection === "reportes" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-foreground">Reportes y Análisis</h2>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Reporte de Comercios Morosos</CardTitle>
                                                <CardDescription>Genera un reporte con comercios que tienen facturas vencidas</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Filtros</label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar período" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="30">Últimos 30 días</SelectItem>
                                                            <SelectItem value="60">Últimos 60 días</SelectItem>
                                                            <SelectItem value="90">Últimos 90 días</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button className="w-full">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Generar Reporte
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Reporte de Facturación por Período</CardTitle>
                                                <CardDescription>
                                                    Genera un reporte de facturación en un rango de fechas específico
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Fecha Inicio</label>
                                                        <Input type="date" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Fecha Fin</label>
                                                        <Input type="date" />
                                                    </div>
                                                </div>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Estado de facturas" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">Todas</SelectItem>
                                                        <SelectItem value="paid">Pagadas</SelectItem>
                                                        <SelectItem value="pending">Pendientes</SelectItem>
                                                        <SelectItem value="overdue">Vencidas</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button className="w-full">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Generar Reporte
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Truck className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Envíos Activos</p>
                                                        <p className="text-2xl font-bold text-foreground">24</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Building2 className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Comercios Activos</p>
                                                        <p className="text-2xl font-bold text-foreground">156</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Comercios Morosos</p>
                                                        <p className="text-2xl font-bold text-foreground">8</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                                        <Calendar className="h-6 w-6 text-yellow-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
                                                        <p className="text-2xl font-bold text-foreground">89</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}
