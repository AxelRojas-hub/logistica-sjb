import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MapPin } from "lucide-react"
import type { Pedido, Ruta } from "@/lib/types"

interface IncludedOrdersCardProps {
    ordersForDestination: Pedido[]
    suggestedRoute: Ruta | null | undefined
    routeSegments: string[]
    getOrderSegment: (order: Pedido) => {
        segment: string
        index: number
        isIntermediate: boolean
        isFinal: boolean
    } | null
}

export function IncludedOrdersCard({
    ordersForDestination,
    getOrderSegment
}: IncludedOrdersCardProps) {
    return (
        <Card className="h-[580px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Pedidos Incluidos en el Envío
                </CardTitle>
            </CardHeader>
            <CardContent>
                {ordersForDestination.length > 0 ? (
                    <div className="rounded-md border">
                        <div className="max-h-[490px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-background border-b">
                                    <tr className="bg-muted/50">
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm w-2/5">
                                            Pedido
                                        </th>
                                        <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground text-sm w-3/5">
                                            Destino
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersForDestination.map((order) => (
                                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle w-2/5">
                                                <div className="font-medium text-sm">{order.id}</div>
                                                <div className="text-xs text-muted-foreground">{order.descripcion}</div>
                                            </td>
                                            <td className="p-4 align-middle text-sm w-3/5 text-center">
                                                <div className="flex items-center gap-1 justify-center">
                                                    <MapPin className="h-3 w-3 text-gray-500" />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs">{order.localidad}</span>
                                                        {(() => {
                                                            const segment = getOrderSegment(order);
                                                            if (segment) {
                                                                return (
                                                                    <div className={`text-xs px-1 py-0.5 rounded mt-1 text-center ${segment.isFinal
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : segment.isIntermediate
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'bg-gray-100 text-gray-700'
                                                                        }`}>
                                                                        {segment.isFinal ? 'Tramo final' :
                                                                            segment.isIntermediate ? `Tramo ${segment.index + 1}` :
                                                                                'Origen'}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No hay pedidos para incluir en este envío</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}