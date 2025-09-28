import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, X } from "lucide-react"
import type { BusinessOrder } from "@/lib/types"
import OrderStatusBadge from "./OrderStatusBadge"

interface OrderDetailsDialogProps {
    order: BusinessOrder
    onUpdateStatus: (orderId: string, newStatus: "pendiente" | "en_transito" | "entregado" | "cancelado") => void
    children: React.ReactNode
}

export default function OrderDetailsDialog({ order, onUpdateStatus, children }: OrderDetailsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles del Pedido {order.id}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Destinatario</h4>
                            <p className="text-sm">{order.recipient}</p>
                            <p className="text-xs text-gray-500">{order.phone}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Estado</h4>
                            <OrderStatusBadge status={order.status} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Dirección</h4>
                        <p className="text-sm">{order.address}</p>
                        <p className="text-xs text-gray-500">{order.neighborhood}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Creado</h4>
                            <p className="text-sm">{order.createdAt}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Entrega estimada</h4>
                            <p className="text-sm">{order.estimatedDelivery}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Descripción</h4>
                        <p className="text-sm">{order.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Peso</h4>
                            <p className="text-sm">{order.weight}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Monto</h4>
                            <p className="text-sm">${order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                    {order.specialInstructions && (
                        <div>
                            <h4 className="font-medium mb-1">Instrucciones especiales</h4>
                            <p className="text-sm">{order.specialInstructions}</p>
                        </div>
                    )}
                    <div className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => onUpdateStatus(order.id, "en_transito")}
                            disabled={order.status === "entregado" || order.status === "cancelado"}
                        >
                            Marcar en Tránsito
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => onUpdateStatus(order.id, "entregado")}
                            disabled={order.status === "entregado" || order.status === "cancelado"}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar Entregado
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onUpdateStatus(order.id, "cancelado")}
                            disabled={order.status === "entregado" || order.status === "cancelado"}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}