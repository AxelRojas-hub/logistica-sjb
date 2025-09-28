import { Badge } from "@/components/ui/badge"

interface ContractStatusBadgeProps {
    status: string
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "activo":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "vencido":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "activo":
                return "Activo"
            case "vencido":
                return "Vencido"
            case "pendiente":
                return "Pendiente"
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