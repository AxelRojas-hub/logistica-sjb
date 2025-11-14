import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { Pedido } from "@/lib/types"
import type { PedidoConDetalles } from "@/lib/models/Pedido"
import OrderStatusBadge from "./OrderStatusBadge"

interface OrderDetailsDialogProps {
    order: Pedido
    children: React.ReactNode
}

export default function OrderDetailsDialog({ order, children }: OrderDetailsDialogProps) {
    const pedidoConDetalles = order as PedidoConDetalles
    const direccionSucursal = pedidoConDetalles.direccionSucursalDestino || `ID Sucursal: ${order.idSucursalDestino}`
    
    // Calcular si entrega tardía
    const entregaTardia = order.estadoPedido === 'entregado' && 
        order.fechaEntrega && 
        order.fechaLimiteEntrega &&
        new Date(order.fechaEntrega) > new Date(order.fechaLimiteEntrega)

    // Si entrega tardía, calcular datos
    let diasRetraso = 0
    let precioOriginal = 0
    let descuentoAplicado = 0

    if (entregaTardia) {
        const fechaEntrega = new Date(order.fechaEntrega!)
        const fechaLimite = new Date(order.fechaLimiteEntrega!)
        diasRetraso = Math.floor((fechaEntrega.getTime() - fechaLimite.getTime()) / (1000 * 60 * 60 * 24))
        
        // El precio actual tiene descuento del 15%, así que el original era: precioActual / 0.85
        precioOriginal = order.precio / 0.85
        descuentoAplicado = precioOriginal - order.precio
    }

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
                            <p className="text-sm">{direccionSucursal}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Precio</h4>
                            <p className="text-sm">${order.precio.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Envío</h4>
                            <p className="text-sm">{order.idEnvio ? `ID: ${order.idEnvio}` : "No asignado"}</p>
                        </div>
                    </div>

                    {/* Alerta de entrega tardía */}
                    {entregaTardia && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950/30 dark:border-orange-800">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                                        Entrega Tardía
                                    </h4>
                                    <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                                        <p>El pedido se entregó <strong>{diasRetraso} día(s)</strong> después de la fecha límite.</p>
                                        <div className="border-t border-orange-200 dark:border-orange-800 pt-2 mt-2">
                                            <p>Precio original: <span className="line-through">${precioOriginal.toLocaleString("es-AR", {minimumFractionDigits: 2})}</span></p>
                                            <p className="font-semibold">Descuento aplicado (15%): -${descuentoAplicado.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                                            <p className="text-green-700 dark:text-green-400 font-bold">Precio final: ${order.precio.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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