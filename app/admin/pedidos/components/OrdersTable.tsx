import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { BusinessOrder } from "@/lib/types"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActionsCell from "./OrderActionsCell"

interface OrdersTableProps {
    orders: BusinessOrder[]
    onUpdateStatus: (orderId: string, newStatus: "pendiente" | "en_transito" | "entregado" | "cancelado") => void
    onSelectOrder: (order: BusinessOrder) => void
}

export default function OrdersTable({ orders, onUpdateStatus, onSelectOrder }: OrdersTableProps) {
    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Destinatario</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center">Entrega Estimada</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-accent/50">
                            <TableCell className="font-medium">
                                <div>
                                    <p className="font-medium">{order.recipient}</p>
                                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-center">{order.estimatedDelivery}</TableCell>
                            <TableCell className="text-center">
                                <OrderActionsCell
                                    order={order}
                                    onUpdateStatus={onUpdateStatus}
                                    onSelectOrder={onSelectOrder}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}