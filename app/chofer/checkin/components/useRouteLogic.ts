import { useState } from "react"
import type { RutaConTramos, Tramo } from "@/lib/types"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

export function useRouteLogic() {
    // TODO: Obtener ruta actual desde la API
    const [currentRoute, setCurrentRoute] = useState<RutaConEstado | null>(null)

    const handleCheckIn = (tramoIndex: number) => {
        setCurrentRoute(prev => {
            if (!prev) return null

            return {
                ...prev,
                tramos: prev.tramos.map((tramo, index) => {
                    if (index === tramoIndex) {
                        return { ...tramo, estado: "actual" as const }
                    }
                    if (index < tramoIndex && tramo.estado === "actual") {
                        return { ...tramo, estado: "completado" as const }
                    }
                    return tramo
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

    return {
        currentRoute,
        handleCheckIn,
        handleFinishRoute,
        getNextTramo,
        isLastTramo
    }
}