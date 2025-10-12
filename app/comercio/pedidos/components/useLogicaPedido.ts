import { useState } from "react"
import type { PedidoComercio } from "@/lib/types"

interface NewOrderForm {
    recipient: string
    address: string
    neighborhood: string
    phone: string
    description: string
    weight: string
    specialInstructions: string
    totalAmount: number
    services: string[]
    deadline: string
}

export function useOrdersLogic() {
    const [selectedOrder, setSelectedOrder] = useState<PedidoComercio | null>(null)
    // TODO: Obtener pedidos desde la API
    const [orders, setOrders] = useState<PedidoComercio[]>([])
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [newOrder, setNewOrder] = useState<NewOrderForm>({
        recipient: "",
        address: "",
        neighborhood: "",
        phone: "",
        description: "",
        weight: "",
        specialInstructions: "",
        totalAmount: 0,
        services: [],
        deadline: "",
    })

    const handleCreateOrder = () => {
        const order: PedidoComercio = {
            id: `PED-COM-${String(orders.length + 1).padStart(3, '0')}`,
            destinatario: newOrder.recipient,
            direccion: newOrder.address,
            barrio: newOrder.neighborhood,
            telefono: newOrder.phone,
            estado: "pendiente",
            descripcion: newOrder.description,
            peso: newOrder.weight,
            instruccionesEspeciales: newOrder.specialInstructions,
            creadoEn: new Date().toISOString().split('T')[0],
            entregaEstimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            montoTotal: newOrder.totalAmount,
            servicios: newOrder.services,
            plazo: newOrder.deadline,
        }
        setOrders([...orders, order])
        setNewOrder({
            recipient: "",
            address: "",
            neighborhood: "",
            phone: "",
            description: "",
            weight: "",
            specialInstructions: "",
            totalAmount: 0,
            services: [],
            deadline: "",
        })
    }

    const handleCancelOrder = (orderId: string) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: "cancelado" } : order
        ))
    }

    const handleViewOrder = (order: PedidoComercio) => {
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