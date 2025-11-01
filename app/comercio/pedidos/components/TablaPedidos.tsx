"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, X } from "lucide-react"
import type { Pedido } from "@/lib/types"
import { OrderStatusBadge } from "./PedidoStatusBadge"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"

interface OrdersTableProps {
    orders: Pedido[]
    onViewOrder: (order: Pedido) => void
    onCancelOrder: (orderId: number) => void
    comercioHabilitado?: boolean
}

export function OrdersTable({ orders, onViewOrder, onCancelOrder, comercioHabilitado = true }: OrdersTableProps) {
    const [cancelId, setCancelId] = useState<number | null>(null)
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
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={!comercioHabilitado}
                                                    onClick={() => setCancelId(order.idPedido)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        ¿Seguro que desea cancelar el pedido?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción NO se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setCancelId(null)}>
                                                        No
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            if (cancelId !== null) {
                                                                onCancelOrder(cancelId)
                                                                setCancelId(null)
                                                            }
                                                        }}
                                                    >
                                                        Sí, cancelar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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