"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Users, Truck, TrendingUp, MapPin, ArrowRight, AlertCircle } from "lucide-react"
import { SucursalFrecuente } from "../page"
import { RutaConTramos } from "@/lib/types"
import { construirCaminoRuta } from "@/lib/models/Ruta"
import { PedidoConDetalles } from "@/lib/models/Pedido"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ShipmentConfigurationCardProps {
    selectedDriver: string
    onDriverChange: (value: string) => void
    choferes: { id: string; nombre: string }[]
    sucursalDestinoMasFrecuente?: SucursalFrecuente | null
    rutaElegida: RutaConTramos | null
    pedidosPendientes: PedidoConDetalles[]
    idSucursalOrigen: number
}

export function ShipmentConfigurationCard({
    selectedDriver,
    onDriverChange,
    choferes,
    sucursalDestinoMasFrecuente,
    rutaElegida,
    pedidosPendientes,
    idSucursalOrigen
}: ShipmentConfigurationCardProps) {
    const [isCreating, setIsCreating] = useState(false)
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const router = useRouter()
    const tramosOrdenados = rutaElegida ? construirCaminoRuta(rutaElegida.tramos) : []

    // Filtrar pedidos cuyo destino coincida con los tramos de la ruta seleccionada
    const pedidosIncluidos = rutaElegida ? pedidosPendientes.filter(pedido => {
        // Obtener todas las sucursales de destino de los tramos de la ruta
        const sucursalesEnRuta = new Set<number>()
        rutaElegida.tramos.forEach(tramo => {
            sucursalesEnRuta.add(tramo.idSucursalDestino)
        })

        // Verificar si el destino del pedido está en alguno de los tramos
        return sucursalesEnRuta.has(pedido.idSucursalDestino)
    }) : []

    const handleCreateShipment = async () => {
        if (isCreating || !rutaElegida || !selectedDriver || selectedDriver === "none") {
            return
        }

        setIsCreating(true)

        try {
            const response = await fetch("/api/envios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    legajoChofer: selectedDriver,
                    pedidosIncluidos: pedidosIncluidos,
                    idRuta: rutaElegida.idRuta,
                    idSucursalOrigen: idSucursalOrigen
                })
            })

            const result = await response.json()
            if (response.ok) {
                toast.success(`¡Envío creado exitosamente!`)

                const remainingOrders = pedidosPendientes.length - pedidosIncluidos.length

                if (remainingOrders === 0) {
                    toast.info("No quedan pedidos pendientes. Redirigiendo a envíos...")
                    router.push("/admin/envios")
                } else {
                    // Refrescar datos para la próxima creación si decide quedarse
                    router.refresh()
                    setShowConfirmationDialog(true)
                }
            } else {
                toast.error(`Error al crear envío: ${result.error}`)
            }
        } catch (error) {
            toast.error("Error de conexión al crear el envío")
            console.error(error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <>
            <Card className="h-[580px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Configuración de Envío
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Ruta asignada automáticamente:</label>

                            {rutaElegida ? (
                                <div className="space-y-3">
                                    {/* Información de la ruta */}
                                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                                            <MapPin className="h-4 w-4" />
                                            {rutaElegida.nombreRuta}
                                        </div>
                                        <p className="text-xs text-green-700 dark:text-green-300">
                                            Incluye {pedidosIncluidos.length} pedidos en total.
                                        </p>
                                    </div>

                                    {/* Mostrar tramos de la ruta */}
                                    {tramosOrdenados.length > 0 && (
                                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                                <MapPin className="h-4 w-4" />
                                                Recorrido de la ruta
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 flex-wrap">
                                                {tramosOrdenados.map((tramo, index) => (
                                                    <div key={tramo.nroTramo} className="flex items-center gap-1">
                                                        {index === 0 && (
                                                            <>
                                                                <span className="font-medium">
                                                                    {tramo.nombreSucursalOrigen || `Sucursal ${tramo.idSucursalOrigen}`}
                                                                </span>
                                                                <ArrowRight className="h-3 w-3" />
                                                            </>
                                                        )}
                                                        <span className="font-medium">
                                                            {tramo.nombreSucursalDestino || `Sucursal ${tramo.idSucursalDestino}`}
                                                        </span>
                                                        {index < tramosOrdenados.length - 1 && (
                                                            <ArrowRight className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                                        <AlertCircle className="h-4 w-4" />
                                        No hay ruta disponible
                                    </div>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">
                                        No se encontró una ruta que conecte el origen con el destino más frecuente
                                    </p>
                                </div>
                            )}
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

                        {choferes.length === 0 ? (
                            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                                    <AlertCircle className="h-4 w-4" />
                                    No hay choferes disponibles
                                </div>
                                <p className="text-xs text-orange-700 dark:text-orange-300">
                                    Todos los choferes están ocupados en otros envíos
                                </p>
                            </div>
                        ) : (
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
                        )}

                        <div className="pt-4">
                            <Button
                                className="w-full"
                                disabled={!rutaElegida || !selectedDriver || selectedDriver === "none" || isCreating || choferes.length === 0}
                                onClick={handleCreateShipment}
                            >
                                <Truck className="h-4 w-4 mr-2" />
                                {choferes.length === 0
                                    ? "No hay choferes disponibles"
                                    : isCreating
                                        ? "Creando envío..."
                                        : "Crear Envío"
                                }
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Desea seguir creando envíos?</AlertDialogTitle>
                        <AlertDialogDescription>
                            El envío se ha creado correctamente. ¿Quiere continuar creando más envíos con los pedidos restantes?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => router.push("/admin/envios")}>
                            No, ir a Envíos
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setShowConfirmationDialog(false)
                            onDriverChange("none") // Resetear chofer
                        }}>
                            Sí, continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}