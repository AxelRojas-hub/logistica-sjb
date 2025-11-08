"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ComerciosMorososDialog } from "./components/ComerciosMorososDialog"
import { useToast } from "@/components/ui/use-toast"
import {
    Download,
    Truck,
    Building2,
    AlertTriangle,
    Calendar,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Comercio, Factura } from "@/lib/types"

export default function AdminReportesPage() {
    const [diasMorosidad, setDiasMorosidad] = useState<string>("30")
    const [isReporteOpen, setIsReporteOpen] = useState(false)
    const [comerciosMorosos, setComeriosMorosos] = useState<any[]>([])
    const { toast } = useToast()

    const obtenerComerciosMorosos = async (dias: number) => {
        try {
            const response = await fetch(`/api/reportes/comercios-morosos?dias=${dias}`)
            if (!response.ok) {
                throw new Error("Error al obtener los datos")
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error:", error)
            toast({
                title: "Error",
                description: "No se pudieron obtener los datos de comercios morosos",
                variant: "destructive",
            })
            return []
        }
    }

    const handleGenerarReporte = async () => {
        const comercios = await obtenerComerciosMorosos(Number(diasMorosidad))
        setComeriosMorosos(comercios)
        setIsReporteOpen(true)
    }

    const handleExportarExcel = () => {
        // Implementar la exportación a Excel
        toast({
            title: "Exportación iniciada",
            description: "El reporte se está generando...",
        })
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
                        <p className="mt-2 text-muted-foreground">Genera reportes detallados del sistema</p>
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
                            <h2 className="text-2xl font-semibold text-foreground">Generador de Reportes</h2>
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
                                        <Select value={diasMorosidad} onValueChange={setDiasMorosidad}>
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
                                    <Button className="w-full" onClick={handleGenerarReporte}>
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

                        <ComerciosMorososDialog
                            isOpen={isReporteOpen}
                            onOpenChange={setIsReporteOpen}
                            comercios={comerciosMorosos}
                            dias={Number(diasMorosidad)}
                            onExportReport={handleExportarExcel}
                        />

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
                </div>
            </div>
        </TooltipProvider>
    )
}