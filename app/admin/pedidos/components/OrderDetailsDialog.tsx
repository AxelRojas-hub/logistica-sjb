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
    const nombreComercio = pedidoConDetalles.nombreComercio || 'Sin nombre'
    
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Pedido #{order.idPedido}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Estado y Envío */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Estado del Pedido</p>
                            <OrderStatusBadge status={order.estadoPedido} />
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Envío</p>
                            <p className="font-medium">{order.idEnvio ? `#${order.idEnvio}` : "No asignado"}</p>
                        </div>
                    </div>

                    {/* Alerta de entrega tardía */}
                    {entregaTardia && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950/30 dark:border-orange-800">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                                        Entrega Tardía - {diasRetraso} día(s) de retraso
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <p className="text-orange-600 dark:text-orange-400 mb-0.5">Precio Original</p>
                                            <p className="font-medium line-through">${precioOriginal.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                                        </div>
                                        <div>
                                            <p className="text-orange-600 dark:text-orange-400 mb-0.5">Descuento (15%)</p>
                                            <p className="font-medium">-${descuentoAplicado.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                                        </div>
                                        <div>
                                            <p className="text-green-700 dark:text-green-400 mb-0.5">Precio Final</p>
                                            <p className="font-bold text-green-700 dark:text-green-400">${order.precio.toLocaleString("es-AR", {minimumFractionDigits: 2})}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información del Cliente */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Cliente Destinatario
                        </h3>
                        <div className="grid grid-cols-1 gap-2 pl-7">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">DNI</span>
                                <span className="font-medium">{order.dniCliente}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información del Comercio y Destino */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Comercio y Destino
                        </h3>
                        <div className="grid grid-cols-1 gap-2 pl-7">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Comercio</span>
                                <span className="font-medium">{nombreComercio}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">ID Comercio</span>
                                <span className="font-medium">#{order.idComercio}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Sucursal Destino</span>
                                <span className="font-medium">{direccionSucursal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información de Fechas y Precio */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detalles de Pago y Fechas
                        </h3>
                        <div className="grid grid-cols-1 gap-2 pl-7">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Precio</span>
                                <span className="font-bold text-lg">${order.precio.toLocaleString("es-AR", {minimumFractionDigits: 2})}</span>
                            </div>
                            {order.fechaLimiteEntrega && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Fecha Límite</span>
                                    <span className="font-medium">{new Date(order.fechaLimiteEntrega).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                </div>
                            )}
                            {order.fechaEntrega && (
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Fecha de Entrega</span>
                                    <span className="font-medium">{new Date(order.fechaEntrega).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}