"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Pedido, Sucursal } from "@/lib/types"
import { OrderStatusBadge } from "./PedidoStatusBadge"
import { useEffect, useState } from "react"

interface OrderDetailsDialogProps {
    order: Pedido | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) {
    const [sucursales, setSucursales] = useState<Sucursal[]>([])

    useEffect(() => {
        if (isOpen) {
            fetch('/api/sucursales')
                .then(res => res.json())
                .then(data => setSucursales(data))
                .catch(error => console.error('Error cargando sucursales:', error))
        }
    }, [isOpen])

    const getSucursalNombre = (idSucursal: number): string => {
        const sucursal = sucursales.find(s => s.idSucursal === idSucursal)
        if (sucursal) {
            return `${sucursal.direccionSucursal}`
        }
        return `ID Sucursal: ${idSucursal}`
    }

    if (!order) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent 
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                aria-describedby="order-details-description"
            >
                <DialogHeader>
                    <DialogTitle>Detalles del Pedido #{order.idPedido}</DialogTitle>
                    <div id="order-details-description" className="sr-only">
                        Información detallada del pedido incluyendo datos del cliente y estado de entrega
                    </div>
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
                        <p className="text-sm">{getSucursalNombre(order.idSucursalDestino)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Fecha de Entrega</h4>
                            <p className="text-sm">
                                {order.fechaEntrega ? new Date(order.fechaEntrega).toLocaleDateString() : "No entregado aún"}
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