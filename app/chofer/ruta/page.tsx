"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    Navigation,
    ArrowLeft
} from "lucide-react"
import { mockCurrentRoute } from "@/lib/mock-data"
import Link from "next/link"

export default function ChoferRutaPage() {
    return (
        <TooltipProvider>
            <div className="h-screen bg-background flex flex-col">
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Consultar Ruta</h1>
                            <p className="mt-2 text-muted-foreground">Ver información detallada de tu ruta asignada</p>
                        </div>

                        {/* Botón para volver al menú principal */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/chofer">
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
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}