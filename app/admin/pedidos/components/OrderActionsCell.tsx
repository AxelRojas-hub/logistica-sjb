import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, CheckCircle } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import OrderDetailsDialog from "./OrderDetailsDialog"

interface OrderActionsCellProps {
    order: Pedido
    onUpdateStatus: (orderId: number, newStatus: EstadoPedido) => void
    onSelectOrder: (order: Pedido) => void
    idSucursalAdmin: number | null
}

export default function OrderActionsCell({ order, onUpdateStatus, onSelectOrder, idSucursalAdmin }: OrderActionsCellProps) {
    // Verificar si se puede marcar el pedido como entregado
    const puedeMarcarEntregado = 
        order.estadoPedido === "en_sucursal" && 
        idSucursalAdmin !== null &&
        order.idSucursalDestino === idSucursalAdmin

    return (
        <div className="flex gap-1 justify-center">
            <OrderDetailsDialog order={order}>
                <Button variant="outline" size="sm" onClick={() => onSelectOrder(order)}>
                    <Eye className="h-4 w-4" />
                </Button>
            </OrderDetailsDialog>

            {puedeMarcarEntregado && (
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
        </div>
    )
}