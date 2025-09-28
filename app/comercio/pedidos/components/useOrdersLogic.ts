import { useState } from "react"
import { mockBusinessOrders } from "@/lib/mock-data"
import type { BusinessOrder } from "@/lib/types"

interface NewOrderForm {
    recipient: string
    address: string
    neighborhood: string
    phone: string
    description: string
    weight: string
    specialInstructions: string
    totalAmount: number
}

export function useOrdersLogic() {
    const [selectedOrder, setSelectedOrder] = useState<BusinessOrder | null>(null)
    const [orders, setOrders] = useState(mockBusinessOrders)
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
    })

    const handleCreateOrder = () => {
        const order: BusinessOrder = {
            id: `PED-COM-${String(orders.length + 1).padStart(3, '0')}`,
            ...newOrder,
            status: "pendiente",
            createdAt: new Date().toISOString().split('T')[0],
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
        })
    }

    const handleCancelOrder = (orderId: string) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: "cancelado" } : order
        ))
    }

    const handleViewOrder = (order: BusinessOrder) => {
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