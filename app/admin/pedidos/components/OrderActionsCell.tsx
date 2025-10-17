import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Truck, Eye, CheckCircle, Building } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import OrderDetailsDialog from "./OrderDetailsDialog"

interface OrderActionsCellProps {
    order: Pedido
    onUpdateStatus: (orderId: number, newStatus: EstadoPedido) => void
    onSelectOrder: (order: Pedido) => void
}

export default function OrderActionsCell({ order, onUpdateStatus, onSelectOrder }: OrderActionsCellProps) {
    return (
        <div className="flex gap-1 justify-center">
            <OrderDetailsDialog order={order} onUpdateStatus={onUpdateStatus}>
                <Button variant="outline" size="sm" onClick={() => onSelectOrder(order)}>
                    <Eye className="h-4 w-4" />
                </Button>
            </OrderDetailsDialog>

            {order.estadoPedido === "en_preparacion" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.idPedido, "en_camino")}
                        >
                            <Truck className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Marcar en tránsito</p>
                    </TooltipContent>
                </Tooltip>
            )}

            {order.estadoPedido === "en_camino" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.idPedido, "entregado")}
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

            {order.estadoPedido === "en_preparacion" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateStatus(order.idPedido, "en_sucursal")}
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