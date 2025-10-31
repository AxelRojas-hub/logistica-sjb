import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, X } from "lucide-react"
import type { Pedido } from "@/lib/types"
import { OrderStatusBadge } from "./PedidoStatusBadge"

interface OrdersTableProps {
    orders: Pedido[]
    onViewOrder: (order: Pedido) => void
    onCancelOrder: (orderId: number) => void
    comercioHabilitado?: boolean
}

export function OrdersTable({ orders, onViewOrder, onCancelOrder, comercioHabilitado = true }: OrdersTableProps) {
    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Nro. Pedido</TableHead>
                        <TableHead className="w-[120px]">DNI Cliente</TableHead>
                        <TableHead className="w-[120px]">Estado</TableHead>
                        <TableHead className="w-[150px]">Entrega Límite</TableHead>
                        <TableHead className="w-[120px]">Precio</TableHead>
                        <TableHead className="w-[120px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.idPedido} className="hover:bg-accent/50">
                            <TableCell className="font-medium">#{order.idPedido}</TableCell>
                            <TableCell>{order.dniCliente}</TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.estadoPedido} />
                            </TableCell>
                            <TableCell>
                                {order.fechaLimiteEntrega ? new Date(order.fechaLimiteEntrega).toLocaleDateString() : "—"}
                            </TableCell>
                            <TableCell className="font-bold">
                                ${order.precio.toLocaleString()}
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
                                    {order.estadoPedido === "en_preparacion" && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={!comercioHabilitado}
                                            onClick={() => onCancelOrder(order.idPedido)}
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