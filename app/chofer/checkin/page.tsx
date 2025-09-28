"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    CheckCircle,
    PackageCheck,
    ArrowLeft
} from "lucide-react"
import { mockCurrentRoute } from "@/lib/mock-data"
import Link from "next/link"

export default function ChoferCheckinPage() {
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

    return (
        <TooltipProvider>
            <div className="h-screen bg-background flex flex-col">
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Check-in en Sucursal</h1>
                            <p className="mt-2 text-muted-foreground">Marca la llegada a cada sucursal de tu ruta</p>
                        </div>


                        <div className="space-y-6">
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                Ruta: {currentRoute.name}
                            </Badge>

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
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}