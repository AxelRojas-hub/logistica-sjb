"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    Truck,
    Package,
    MapPin,
    Clock,
    Filter,
    Search,
    Eye,
    ArrowLeft
} from "lucide-react"
import { mockShipments, mockRoutes, mockBranches } from "@/lib/mock-data"
import Link from "next/link"

export default function AdminEnviosPage() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "En ruta":
                return "bg-blue-100 text-blue-800"
            case "En sucursal":
                return "bg-green-100 text-green-800"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Envíos</h1>
                        <p className="mt-2 text-muted-foreground">Monitorea y gestiona todos los envíos del sistema</p>
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
                            <h2 className="text-2xl font-semibold text-foreground">Envíos Activos</h2>
                            <div className="flex gap-2">
                                <Link href="/admin/envios/crear">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Truck className="h-4 w-4 mr-2" />
                                        + Crear envío
                                    </Button>
                                </Link>
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
                </div>
            </div>
        </TooltipProvider>
    )
}