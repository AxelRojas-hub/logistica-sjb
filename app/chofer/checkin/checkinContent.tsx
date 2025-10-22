"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { RouteStatusCard } from "./components"
import type { RutaConTramos, Tramo } from "@/lib/types"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

interface CheckinContentProps {
    initialRoute: RutaConEstado | null
}

export function CheckinContent({ initialRoute }: CheckinContentProps) {
    const [currentRoute, setCurrentRoute] = useState<RutaConEstado | null>(initialRoute)

    const handleCheckIn = (tramoIndex: number) => {
        setCurrentRoute(prev => {
            if (!prev) return null

            return {
                ...prev,
                tramos: prev.tramos.map((tramo, index) => {
                    if (index === tramoIndex) {
                        // El tramo clickeado ahora es el actual
                        return { ...tramo, estado: "actual" as const }
                    }
                    if (index < tramoIndex) {
                        // Todos los tramos anteriores son completados
                        return { ...tramo, estado: "completado" as const }
                    }
                    // Los tramos posteriores son pendientes
                    return { ...tramo, estado: "pendiente" as const }
                }),
                tramoActual: tramoIndex
            }
        })
    }

    const handleFinishRoute = () => {
        setCurrentRoute(null)
    }

    const getNextTramo = (): Tramo | null => {
        if (!currentRoute) return null
        const currentIndex = currentRoute.tramos.findIndex(tramo => tramo.estado === "actual")
        return currentRoute.tramos[currentIndex + 1] || null
    }

    const isLastTramo = () => {
        if (!currentRoute) return false
        const currentIndex = currentRoute.tramos.findIndex(tramo => tramo.estado === "actual")
        return currentIndex === currentRoute.tramos.length - 1
    }

    return (
        <>
            {!currentRoute ? (
                <div className="text-center py-12 text-muted-foreground">
                    No hay ruta asignada actualmente
                </div>
            ) : (
                <div className="space-y-6">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {currentRoute.nombreRuta}
                    </Badge>

                    <RouteStatusCard
                        currentRoute={currentRoute}
                        onCheckIn={handleCheckIn}
                        onFinishRoute={handleFinishRoute}
                        getNextTramo={getNextTramo}
                        isLastTramo={isLastTramo}
                    />
                </div>
            )}
        </>
    )
}
