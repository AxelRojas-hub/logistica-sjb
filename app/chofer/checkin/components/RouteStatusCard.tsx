import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrentRoute } from "@/lib/types"
import { BranchItem } from "./BranchItem"
import { RouteCompletedView } from "./RouteCompletedView"

interface RouteStatusCardProps {
    currentRoute: CurrentRoute
    onCheckIn: (branchName: string) => void
    onFinishRoute: () => void
    getNextBranch: () => { name: string; time: string; status: "completed" | "current" | "pending" } | null
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
                    {currentRoute.branches.length === 0 ? (
                        <RouteCompletedView />
                    ) : (
                        currentRoute.branches.map((branch, index) => {
                            const nextBranch = getNextBranch()
                            const showCheckInButton = nextBranch?.name === branch.name
                            const showFinishButton = branch.status === "current" && isLastBranch()

                            return (
                                <BranchItem
                                    key={branch.name}
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