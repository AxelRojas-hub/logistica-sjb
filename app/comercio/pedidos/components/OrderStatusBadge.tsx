import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
    status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "en proceso":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "completado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "pendiente":
                return "Pendiente"
            case "en_transito":
                return "En Tránsito"
            case "entregado":
                return "Entregado"
            case "cancelado":
                return "Cancelado"
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