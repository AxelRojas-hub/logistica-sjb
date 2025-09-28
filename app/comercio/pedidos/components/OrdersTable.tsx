import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, X } from "lucide-react"
import { BusinessOrder } from "@/lib/types"
import { OrderStatusBadge } from "./OrderStatusBadge"

interface OrdersTableProps {
    orders: BusinessOrder[]
    onViewOrder: (order: BusinessOrder) => void
    onCancelOrder: (orderId: string) => void
}

export function OrdersTable({ orders, onViewOrder, onCancelOrder }: OrdersTableProps) {
    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Destinatario</TableHead>
                        <TableHead className="w-[120px]">Estado</TableHead>
                        <TableHead className="w-[150px]">Entrega Estimada</TableHead>
                        <TableHead className="w-[120px]">Monto</TableHead>
                        <TableHead className="w-[120px]">Acciones</TableHead>
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
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>{order.estimatedDelivery}</TableCell>
                            <TableCell className="font-bold text-lg">
                                ${order.totalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    {order.status === "pendiente" && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onCancelOrder(order.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}