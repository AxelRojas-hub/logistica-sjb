import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { 
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
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
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-500 hover:bg-green-50"
                                >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                            </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Marcar como entregado</p>
                        </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Confirmar entrega del pedido #{order.idPedido}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Se marcará el pedido como entregado y se registrará la fecha de entrega.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onUpdateStatus(order.idPedido, "entregado")}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Sí, marcar como entregado
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}