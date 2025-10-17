import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RutaConTramos, Tramo } from "@/lib/types"
import { BranchItem } from "./BranchItem"
import { RouteCompletedView } from "./RouteCompletedView"

interface RouteStatusCardProps {
    currentRoute: RutaConTramos
    onCheckIn: (tramoIndex: number) => void
    onFinishRoute: () => void
    getNextTramo: () => Tramo | null
    isLastTramo: () => boolean
}

export function RouteStatusCard({
    currentRoute,
    onCheckIn,
    onFinishRoute,
    getNextTramo,
    isLastTramo
}: RouteStatusCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de la Ruta Actual</CardTitle>
                <CardDescription>Ruta: {currentRoute.nombreRuta}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {currentRoute.tramos.length === 0 ? (
                        <RouteCompletedView />
                    ) : (
                        currentRoute.tramos.map((tramo, index) => {
                            const nextTramo = getNextTramo()
                            const showCheckInButton = nextTramo?.nroTramo === tramo.nroTramo
                            const showFinishButton = index === currentRoute.tramos.length - 1 && isLastTramo()

                            return (
                                <BranchItem
                                    key={`${tramo.nroTramo}-${index}`}
                                    branch={{
                                        nombre: `Sucursal ${tramo.idSucursalDestino}`,
                                        hora: "",
                                        estado: "pendiente" as const
                                    }}
                                    index={index}
                                    showCheckInButton={showCheckInButton}
                                    showFinishButton={showFinishButton}
                                    onCheckIn={() => onCheckIn(index)}
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