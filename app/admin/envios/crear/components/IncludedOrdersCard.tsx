import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

interface IncludedOrdersCardProps { }

export function IncludedOrdersCard({ }: IncludedOrdersCardProps) {
    // TODO: Obtener pedidos desde Supabase basándose en la ruta y destino seleccionados
    const orders = [
        { id: "PED-001", descripcion: "Paquete A", localidad: "La Plata" },
        { id: "PED-002", descripcion: "Paquete B", localidad: "La Plata" }
    ]


    return (
        <Card className="h-[580px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Pedidos Incluidos en el Envío
                </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
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
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle w-2/5">
                                                <div className="font-medium text-sm">{order.id}</div>
                                                <div className="text-xs text-muted-foreground">{order.descripcion}</div>
                                            </td>
                                            <td className="p-4 align-middle text-sm w-3/5 text-center">
                                                <div className="text-xs">{order.localidad}</div>
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