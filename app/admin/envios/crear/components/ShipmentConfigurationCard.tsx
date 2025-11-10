import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Users, Truck, TrendingUp, MapPin } from "lucide-react"
import { SucursalFrecuente } from "../page"

interface ShipmentConfigurationCardProps {
    selectedRoute: string
    onRouteChange: (value: string) => void
    selectedDriver: string
    onDriverChange: (value: string) => void
    rutas: { id: string; nombre: string }[]
    choferes: { id: string; nombre: string }[]
    sucursalDestinoMasFrecuente?: SucursalFrecuente | null
}

export function ShipmentConfigurationCard({
    selectedRoute,
    onRouteChange,
    selectedDriver,
    onDriverChange,
    rutas,
    choferes,
    sucursalDestinoMasFrecuente
}: ShipmentConfigurationCardProps) {
    return (
        <Card className="h-[580px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Configuración de Envío
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Seleccionar ruta:</label>
                        <Select value={selectedRoute} onValueChange={onRouteChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una ruta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    <span className="text-muted-foreground">Selecciona una ruta</span>
                                </SelectItem>
                                {rutas.map((route) => (
                                    <SelectItem key={route.id} value={route.id}>
                                        {route.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {sucursalDestinoMasFrecuente && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                Destino más frecuente
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="font-medium">{sucursalDestinoMasFrecuente.ciudadSucursal}</span>
                                <span className="text-xs">({sucursalDestinoMasFrecuente.cantidadPedidos} pedidos)</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4 border-t pt-6">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Asignación de Chofer
                    </h4>

                    <p className="text-sm text-muted-foreground">
                        {choferes.length} choferes disponibles
                    </p>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Seleccionar chofer:</label>
                        <Select value={selectedDriver} onValueChange={onDriverChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un chofer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    <span className="text-muted-foreground">Selecciona un chofer</span>
                                </SelectItem>
                                {choferes.map((driver) => (
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
                            disabled={!selectedRoute || !selectedDriver || selectedRoute === "none" || selectedDriver === "none"}
                            onClick={() => {
                                alert(`Envío creado con ruta ${selectedRoute} y chofer ${selectedDriver}`)
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