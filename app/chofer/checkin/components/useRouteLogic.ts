import { useState } from "react"
import { CurrentRoute } from "@/lib/types"
import { mockCurrentRoute } from "@/lib/mock-data"

export function useRouteLogic() {
    const [currentRoute, setCurrentRoute] = useState<CurrentRoute>(mockCurrentRoute)

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

    return {
        currentRoute,
        handleCheckIn,
        handleFinishRoute,
        getNextBranch,
        isLastBranch
    }
}