import { Badge } from "@/components/ui/badge"
import type { EstadoPedido } from "@/lib/types"

interface OrderStatusBadgeProps {
    status: EstadoPedido
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const getStatusColor = (status: EstadoPedido) => {
        switch (status) {
            case "en_preparacion":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "en_camino":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "entregado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            case "en_sucursal":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: EstadoPedido) => {
        switch (status) {
            case "en_preparacion":
                return "En Preparación"
            case "en_camino":
                return "En Camino"
            case "entregado":
                return "Entregado"
            case "cancelado":
                return "Cancelado"
            case "en_sucursal":
                return "En Sucursal"
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