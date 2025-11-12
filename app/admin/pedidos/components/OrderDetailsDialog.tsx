import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, X } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import OrderStatusBadge from "./OrderStatusBadge"

interface OrderDetailsDialogProps {
    order: Pedido
    onUpdateStatus: (orderId: number, newStatus: EstadoPedido) => void
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
                    <DialogTitle>Detalles del Pedido {order.idPedido}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">ID Pedido</h4>
                            <p className="text-sm">{order.idPedido}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Estado</h4>
                            <OrderStatusBadge status={order.estadoPedido} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Cliente</h4>
                        <p className="text-sm">DNI: {order.dniCliente}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Comercio</h4>
                            <p className="text-sm">ID: {order.idComercio}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Sucursal Destino</h4>
                            <p className="text-sm">ID: {order.idSucursalDestino}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Precio</h4>
                            <p className="text-sm">${order.precio.toLocaleString()}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Envío</h4>
                            <p className="text-sm">{order.idEnvio ? `ID: ${order.idEnvio}` : "No asignado"}</p>
                        </div>
                    </div>
                    {order.fechaEntrega && (
                        <div>
                            <h4 className="font-medium mb-1">Fecha de Entrega</h4>
                            <p className="text-sm">{new Date(order.fechaEntrega).toLocaleDateString()}</p>
                        </div>
                    )}
                    {order.fechaLimiteEntrega && (
                        <div>
                            <h4 className="font-medium mb-1">Fecha Límite de Entrega</h4>
                            <p className="text-sm">{new Date(order.fechaLimiteEntrega).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}