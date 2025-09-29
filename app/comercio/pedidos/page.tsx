"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreateOrderDialog, OrderDetailsDialog, OrdersTable, useOrdersLogic } from "./components"

export default function ComercioPedidosPage() {
    const {
        selectedOrder,
        orders,
        showDetailsDialog,
        setShowDetailsDialog,
        newOrder,
        setNewOrder,
        handleCreateOrder,
        handleCancelOrder,
        handleViewOrder
    } = useOrdersLogic()

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón para volver al menú principal */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al menú principal
                        </Button>
                    </Link>
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                    <p className="mt-2 text-muted-foreground">Crea y gestiona tus pedidos de entrega</p>
                </div>


                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Mis Pedidos</h2>
                        <CreateOrderDialog
                            newOrder={newOrder}
                            setNewOrder={setNewOrder}
                            onCreateOrder={handleCreateOrder}
                        />
                    </div>

                    <OrdersTable
                        orders={orders}
                        onViewOrder={handleViewOrder}
                        onCancelOrder={handleCancelOrder}
                    />

                    <OrderDetailsDialog
                        order={selectedOrder}
                        isOpen={showDetailsDialog}
                        onOpenChange={setShowDetailsDialog}
                    />
                </div>
            </div>
        </div>
    )
}