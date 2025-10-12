import { useState } from "react"
import type { RutaActual } from "@/lib/types"

export function useRouteLogic() {
    // TODO: Fetch current route from API
    const [currentRoute, setCurrentRoute] = useState<RutaActual | null>(null)

    const handleCheckIn = (branchName: string) => {
        setCurrentRoute(prev => {
            if (!prev) return null;

            const branchIndex = prev.sucursales.findIndex(b => b.nombre === branchName)

            return {
                ...prev,
                sucursales: prev.sucursales.map((branch, index) => {
                    if (branch.nombre === branchName) {
                        return { ...branch, estado: "actual" as const }
                    }
                    if (index < branchIndex && branch.estado === "actual") {
                        return { ...branch, estado: "completado" as const }
                    }
                    return branch
                }),
                sucursalActual: branchName
            }
        })
    }

    const handleFinishRoute = () => {
        setCurrentRoute(null)
    }

    const getNextBranch = () => {
        if (!currentRoute) return null;
        const currentIndex = currentRoute.sucursales.findIndex(branch => branch.estado === "actual")
        return currentRoute.sucursales[currentIndex + 1] || null
    }

    const isLastBranch = () => {
        if (!currentRoute) return false;
        const currentIndex = currentRoute.sucursales.findIndex(branch => branch.estado === "actual")
        return currentIndex === currentRoute.sucursales.length - 1
    }

    return {
        currentRoute,
        handleCheckIn,
        handleFinishRoute,
        getNextBranch,
        isLastBranch
    }
}