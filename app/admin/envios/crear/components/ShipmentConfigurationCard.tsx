import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Users, Truck } from "lucide-react"

interface ShipmentConfigurationCardProps {
    selectedRoute: string
    onRouteChange: (value: string) => void
    selectedDriver: string
    onDriverChange: (value: string) => void
    rutas: { id: string; nombre: string }[]
    choferes: { id: string; nombre: string }[]
}

export function ShipmentConfigurationCard({
    selectedRoute,
    onRouteChange,
    selectedDriver,
    onDriverChange,
    rutas,
    choferes
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
                                {rutas.map((route) => (
                                    <SelectItem key={route.id} value={route.id}>
                                        {route.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
                            disabled={!selectedRoute || !selectedDriver}
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