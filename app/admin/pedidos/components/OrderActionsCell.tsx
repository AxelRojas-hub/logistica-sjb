import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Truck, Eye, CheckCircle, Building } from "lucide-react"
import type { BusinessOrder } from "@/lib/types"
import OrderDetailsDialog from "./OrderDetailsDialog"

interface OrderActionsCellProps {
    order: BusinessOrder
    onUpdateStatus: (orderId: string, newStatus: "pendiente" | "en_transito" | "entregado" | "cancelado") => void
    onSelectOrder: (order: BusinessOrder) => void
}

export default function OrderActionsCell({ order, onUpdateStatus, onSelectOrder }: OrderActionsCellProps) {
    return (
        <div className="flex gap-1 justify-center">
            <OrderDetailsDialog order={order} onUpdateStatus={onUpdateStatus}>
                <Button variant="outline" size="sm" onClick={() => onSelectOrder(order)}>
                    <Eye className="h-4 w-4" />
                </Button>
            </OrderDetailsDialog>

            {order.status === "pendiente" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, "en_transito")}
                        >
                            <Truck className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Marcar en tránsito</p>
                    </TooltipContent>
                </Tooltip>
            )}

            {order.status === "en_transito" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, "entregado")}
                            className="border-green-500 hover:bg-green-50"
                        >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Marcar como entregado</p>
                    </TooltipContent>
                </Tooltip>
            )}

            {order.status === "pendiente" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, "pendiente")}
                            className="border-blue-500 hover:bg-blue-50"
                        >
                            <Building className="h-4 w-4 text-blue-600" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Marcar en sucursal</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    )
}