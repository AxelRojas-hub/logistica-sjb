import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, PackageCheck } from "lucide-react"

interface RouteBranch {
    name: string
    time: string
    status: "completed" | "current" | "pending"
}

interface BranchItemProps {
    branch: RouteBranch
    index: number
    showCheckInButton: boolean
    showFinishButton: boolean
    onCheckIn: (branchName: string) => void
    onFinishRoute: () => void
}

export function BranchItem({
    branch,
    index,
    showCheckInButton,
    showFinishButton,
    onCheckIn,
    onFinishRoute
}: BranchItemProps) {
    return (
        <div
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
                        onClick={() => onCheckIn(branch.name)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Check-in
                    </Button>
                )}
                {showFinishButton && (
                    <Button
                        size="sm"
                        onClick={onFinishRoute}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <PackageCheck className="h-4 w-4 mr-2" />
                        Finalizar ruta de envío
                    </Button>
                )}
            </div>
        </div>
    )
}