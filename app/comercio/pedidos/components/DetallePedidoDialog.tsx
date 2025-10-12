import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PedidoComercio } from "@/lib/types"
import { OrderStatusBadge } from "./PedidoStatusBadge"

interface OrderDetailsDialogProps {
    order: PedidoComercio | null
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
                            <p className="text-sm">{order.destinatario}</p>
                            <p className="text-xs text-gray-500">{order.telefono}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Estado</h4>
                            <OrderStatusBadge status={order.estado} />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Dirección</h4>
                        <p className="text-sm">{order.direccion}</p>
                        <p className="text-xs text-gray-500">{order.barrio}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Creado</h4>
                            <p className="text-sm">{order.creadoEn}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Entrega estimada</h4>
                            <p className="text-sm">{order.entregaEstimada}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Descripción</h4>
                        <p className="text-sm">{order.descripcion}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Peso</h4>
                            <p className="text-sm">{order.peso}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Monto</h4>
                            <p className="text-sm">${order.montoTotal.toLocaleString()}</p>
                        </div>
                    </div>
                    {order.instruccionesEspeciales && (
                        <div>
                            <h4 className="font-medium mb-1">Instrucciones especiales</h4>
                            <p className="text-sm">{order.instruccionesEspeciales}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}