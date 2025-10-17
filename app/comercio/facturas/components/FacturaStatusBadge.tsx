import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { EstadoPago } from "@/lib/types"

interface FacturaStatusBadgeProps {
    status: EstadoPago
}

export function FacturaStatusBadge({ status }: FacturaStatusBadgeProps) {
    const getStatusColor = (status: EstadoPago) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "pagado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "vencido":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: EstadoPago) => {
        switch (status) {
            case "pagado":
                return "Pagado"
            case "vencido":
                return "Vencido"
            case "pendiente":
                return "Pendiente"
            default:
                return status
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>
                {getStatusText(status)}
            </Badge>
            {status === "vencido" && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
        </div>
    )
}