import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Pedido } from "@/lib/types"
import { OrderStatusBadge } from "./PedidoStatusBadge"

interface OrderDetailsDialogProps {
    order: Pedido | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) {
    if (!order) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles del Pedido #{order.idPedido}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Número de Pedido</h4>
                            <p className="text-sm">#{order.idPedido}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Estado</h4>
                            <OrderStatusBadge status={order.estadoPedido} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">DNI Cliente</h4>
                            <p className="text-sm">{order.dniCliente}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Precio</h4>
                            <p className="text-sm font-bold">${order.precio.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Sucursal Destino</h4>
                        <p className="text-sm">ID Sucursal: {order.idSucursalDestino}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Fecha de Entrega</h4>
                            <p className="text-sm">
                                {order.fechaEntrega ? new Date(order.fechaEntrega).toLocaleDateString() : "No especificada"}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Fecha Límite Entrega</h4>
                            <p className="text-sm">
                                {order.fechaLimiteEntrega ? new Date(order.fechaLimiteEntrega).toLocaleDateString() : "No especificada"}
                            </p>
                        </div>
                    </div>
                    {order.idEnvio && (
                        <div>
                            <h4 className="font-medium mb-1">Envío Asociado</h4>
                            <p className="text-sm">ID Envío: {order.idEnvio}</p>
                        </div>
                    )}
                    {order.idFactura && (
                        <div>
                            <h4 className="font-medium mb-1">Factura Asociada</h4>
                            <p className="text-sm">ID Factura: {order.idFactura}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}