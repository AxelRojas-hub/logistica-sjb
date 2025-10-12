import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Users, Truck, Route } from "lucide-react"
import type { Chofer, Sucursal, Ruta, Pedido } from "@/lib/types"

interface ShipmentConfigurationCardProps {
    adminBranch: Sucursal | undefined
    suggestedRoute: Ruta | null | undefined
    routeSegments: string[]
    ordersForDestination: Pedido[]
    pendingOrders: Pedido[]
    availableDrivers: Chofer[]
    selectedDriver: string
    setSelectedDriver: (value: string) => void
    canCreateShipment: boolean
    selectedRouteInfo: Ruta | undefined
    selectedDriverInfo: Chofer | undefined
}

export function ShipmentConfigurationCard({
    adminBranch,
    suggestedRoute,
    routeSegments,
    ordersForDestination,
    pendingOrders,
    availableDrivers,
    selectedDriver,
    setSelectedDriver,
    canCreateShipment,
    selectedRouteInfo,
    selectedDriverInfo
}: ShipmentConfigurationCardProps) {
    return (
        <Card className="h-[580px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Configuración de Envío
                </CardTitle>
                <CardDescription>
                    {adminBranch?.nombre}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {suggestedRoute && (
                        <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-800">Ruta sugerida:</p>
                            <p className="text-sm text-green-800 mb-1">{suggestedRoute.nombre}</p>
                            <div className="text-xs text-green-600 mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                    <Route className="h-3 w-3" />
                                    <span>Tramos: {routeSegments.join(' → ')}</span>
                                </div>
                                <div>Tiempo estimado: {suggestedRoute.tiempoEstimado}</div>
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium mb-1 text-orange-800">Resumen de pedidos:</p>
                        <div className="text-xs text-orange-700 space-y-1">
                            <div className="flex justify-between">
                                <span>Incluidos en este envío:</span>
                                <span className="font-medium text-green-700">{ordersForDestination.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quedarán pendientes:</span>
                                <span className="font-medium">{pendingOrders.filter(order => !ordersForDestination.some(included => included.id === order.id)).length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Asignación de Chofer
                    </h4>

                    <p className="text-sm text-muted-foreground">
                        {availableDrivers.length} choferes disponibles en {adminBranch?.nombre}
                    </p>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Seleccionar chofer:</label>
                        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un chofer" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDrivers.map((driver) => (
                                    <SelectItem key={driver.id} value={driver.id}>
                                        {driver.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4">
                        <Button
                            className="w-full"
                            disabled={!canCreateShipment}
                            onClick={() => {
                                alert(`Envío creado:\n- Ruta: ${selectedRouteInfo?.nombre}\n- Pedidos: ${ordersForDestination.length}\n- Chofer: ${selectedDriverInfo?.nombre}`)
                            }}
                        >
                            <Truck className="h-4 w-4 mr-2" />
                            Crear Envío
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}