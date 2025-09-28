import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BusinessOrder } from "@/lib/types"
import { OrderStatusBadge } from "./OrderStatusBadge"

interface OrderDetailsDialogProps {
    order: BusinessOrder | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) {
    if (!order) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                </div>
            </DialogContent>
        </Dialog>
    )
}