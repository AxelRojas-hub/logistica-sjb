import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Pedido, EstadoPedido } from "@/lib/types"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActionsCell from "./OrderActionsCell"

interface OrdersTableProps {
    orders: Pedido[]
    onUpdateStatus: (orderId: number, newStatus: EstadoPedido) => void
    onSelectOrder: (order: Pedido) => void
}

export default function OrdersTable({ orders, onUpdateStatus, onSelectOrder }: OrdersTableProps) {
    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Pedido</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center">Cliente DNI</TableHead>
                        <TableHead className="text-center">Precio</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.idPedido} className="hover:bg-accent/50">
                            <TableCell className="font-medium">
                                {order.idPedido}
                            </TableCell>
                            <TableCell className="text-center">
                                <OrderStatusBadge status={order.estadoPedido} />
                            </TableCell>
                            <TableCell className="text-center">{order.dniCliente}</TableCell>
                            <TableCell className="text-right">${order.precio.toLocaleString()}</TableCell>
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