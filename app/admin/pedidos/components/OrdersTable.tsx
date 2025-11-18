import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PackageX } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import type { PedidoConDetalles } from "@/lib/models/Pedido"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActionsCell from "./OrderActionsCell"

interface OrdersTableProps {
    orders: Pedido[]
    onUpdateStatus: (orderId: number, newStatus: EstadoPedido) => void
    onSelectOrder: (order: Pedido) => void
    idSucursalAdmin: number | null
}

export default function OrdersTable({ orders, onUpdateStatus, onSelectOrder, idSucursalAdmin }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="rounded-full bg-muted p-6">
                            <PackageX className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-foreground">
                                No se encontraron pedidos
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Intenta ajustar los filtros de búsqueda.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Comercio</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Cliente DNI</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-center">Período Facturación</TableHead>
                            <TableHead className="text-center">Estado Pago</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            const pedidoConDetalles = order as PedidoConDetalles
                            return (
                                <TableRow key={order.idPedido} className="hover:bg-accent/50">
                                    <TableCell className="font-medium">
                                        #{order.idPedido}
                                    </TableCell>
                                    <TableCell>
                                        {pedidoConDetalles.nombreComercio || `ID: ${order.idComercio}`}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <OrderStatusBadge status={order.estadoPedido} />
                                    </TableCell>
                                    <TableCell className="text-center">{order.dniCliente}</TableCell>
                                    <TableCell className="text-right">${order.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-center">
                                        {pedidoConDetalles.periodoFacturacion ? (
                                            <span className="text-sm text-muted-foreground">
                                                {pedidoConDetalles.periodoFacturacion}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {pedidoConDetalles.estadoPago ? (
                                            <span className={`text-sm font-medium px-2 py-1 rounded-md ${pedidoConDetalles.estadoPago === 'pagado' ? 'bg-green-100 text-green-800' :
                                                    pedidoConDetalles.estadoPago === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        pedidoConDetalles.estadoPago === 'vencido' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {pedidoConDetalles.estadoPago.charAt(0).toUpperCase() + pedidoConDetalles.estadoPago.slice(1)}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <OrderActionsCell
                                            order={order}
                                            onUpdateStatus={onUpdateStatus}
                                            onSelectOrder={onSelectOrder}
                                            idSucursalAdmin={idSucursalAdmin}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}