import { useState } from "react"
import type { Pedido, EstadoPedido } from "@/lib/types"

interface NewOrderForm {
    dniCliente: number
    idSucursalDestino: number
    precio: number
    fechaLimiteEntrega: string
}

export function useOrdersLogic() {
    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null)
    // TODO: Obtener pedidos desde la API
    const [orders, setOrders] = useState<Pedido[]>([])
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [newOrder, setNewOrder] = useState<NewOrderForm>({
        dniCliente: 0,
        idSucursalDestino: 0,
        precio: 0,
        fechaLimiteEntrega: "",
    })

    const handleCreateOrder = () => {
        const order: Pedido = {
            idPedido: orders.length + 1,
            idEnvio: null,
            idComercio: 0, // TODO: Obtener del contexto del comercio logueado
            idFactura: null,
            idSucursalDestino: newOrder.idSucursalDestino,
            dniCliente: newOrder.dniCliente,
            estadoPedido: "en_preparacion" as EstadoPedido,
            precio: newOrder.precio,
            fechaEntrega: null,
            fechaLimiteEntrega: newOrder.fechaLimiteEntrega,
        }
        setOrders([...orders, order])
        setNewOrder({
            dniCliente: 0,
            idSucursalDestino: 0,
            precio: 0,
            fechaLimiteEntrega: "",
        })
    }

    const handleCancelOrder = (orderId: number) => {
        setOrders(orders.map(order =>
            order.idPedido === orderId ? { ...order, estadoPedido: "cancelado" as EstadoPedido } : order
        ))
    }

    const handleViewOrder = (order: Pedido) => {
        setSelectedOrder(order)
        setShowDetailsDialog(true)
    }

    return {
        selectedOrder,
        orders,
        showDetailsDialog,
        setShowDetailsDialog,
        newOrder,
        setNewOrder,
        handleCreateOrder,
        handleCancelOrder,
        handleViewOrder
    }
}