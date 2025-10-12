import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RutaActual } from "@/lib/types"
import { BranchItem } from "./BranchItem"
import { RouteCompletedView } from "./RouteCompletedView"

interface RouteStatusCardProps {
    currentRoute: RutaActual
    onCheckIn: (branchName: string) => void
    onFinishRoute: () => void
    getNextBranch: () => { nombre: string; hora: string; estado: "completado" | "actual" | "pendiente" } | null
    isLastBranch: () => boolean
}

export function RouteStatusCard({
    currentRoute,
    onCheckIn,
    onFinishRoute,
    getNextBranch,
    isLastBranch
}: RouteStatusCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de la Ruta Actual</CardTitle>
                <CardDescription>Progreso y próximas sucursales en tu ruta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {currentRoute.sucursales.length === 0 ? (
                        <RouteCompletedView />
                    ) : (
                        currentRoute.sucursales.map((branch, index) => {
                            const nextBranch = getNextBranch()
                            const showCheckInButton = nextBranch?.nombre === branch.nombre
                            const showFinishButton = branch.estado === "actual" && isLastBranch()

                            return (
                                <BranchItem
                                    key={branch.nombre}
                                    branch={branch}
                                    index={index}
                                    showCheckInButton={showCheckInButton}
                                    showFinishButton={showFinishButton}
                                    onCheckIn={onCheckIn}
                                    onFinishRoute={onFinishRoute}
                                />
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}