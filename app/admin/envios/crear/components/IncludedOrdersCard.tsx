import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PedidoConDetalles } from "@/lib/models/Pedido"
import { Package } from "lucide-react"

interface IncludedOrdersCardProps {
    pedidosPendientes?: PedidoConDetalles[]
}

export function IncludedOrdersCard({ pedidosPendientes }: IncludedOrdersCardProps) {
    const orders = pedidosPendientes || []


    return (
        <Card className="h-[580px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Pedidos Pendientes de la Sucursal
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="rounded-md border">
                        <div className="max-h-[490px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-background border-b">
                                    <tr className="bg-muted/50">
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm w-1/4">
                                            ID
                                        </th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm w-1/4">
                                            Comercio
                                        </th>
                                        <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground text-sm w-1/4">
                                            Destino
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.idPedido} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle w-1/4">
                                                <div className="font-medium text-sm">#{order.idPedido}</div>
                                            </td>
                                            <td className="p-4 align-middle w-1/4">
                                                <div className="text-sm font-medium">{order.nombreComercio || `ID: ${order.idComercio}`}</div>
                                            </td>
                                            <td className="p-4 align-middle text-sm w-1/4 text-center">
                                                <div className="text-xs">{order.ciudadDestino || `Sucursal ${order.idSucursalDestino}`}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[490px] text-muted-foreground">
                        <p>No hay pedidos para mostrar</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}