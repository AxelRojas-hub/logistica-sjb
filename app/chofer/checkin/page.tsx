"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RouteStatusCard, useRouteLogic } from "./components"

export default function ChoferCheckinPage() {
    const {
        currentRoute,
        handleCheckIn,
        handleFinishRoute,
        getNextBranch,
        isLastBranch
    } = useRouteLogic()

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

                            <RouteStatusCard
                                currentRoute={currentRoute}
                                onCheckIn={handleCheckIn}
                                onFinishRoute={handleFinishRoute}
                                getNextBranch={getNextBranch}
                                isLastBranch={isLastBranch}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}