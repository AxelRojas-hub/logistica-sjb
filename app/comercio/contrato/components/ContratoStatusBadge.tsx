import { Badge } from "@/components/ui/badge"
import type { EstadoContrato } from "@/lib/types"

interface ContratoStatusBadgeProps {
    status: EstadoContrato
}

export function ContratoStatusBadge({ status }: ContratoStatusBadgeProps) {
    const getStatusColor = (status: EstadoContrato) => {
        switch (status) {
            case "vigente":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "vencido":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            case "suspendido":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: EstadoContrato) => {
        switch (status) {
            case "vigente":
                return "Vigente"
            case "vencido":
                return "Vencido"
            case "suspendido":
                return "Suspendido"
            default:
                return status
        }
    }

    return (
        <Badge className={getStatusColor(status)}>
            {getStatusText(status)}
        </Badge>
    )
}