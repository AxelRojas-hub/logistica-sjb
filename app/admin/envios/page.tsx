import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    Truck,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabaseServer"
import { getSucursales } from "@/lib/models/Sucursal"
import { getRutasConTramos, construirCaminoRuta } from "@/lib/models/Ruta"
import { getEnviosActivos } from "@/lib/models/Envio"
import { EnviosTable } from "./components/EnviosTable"

export default async function AdminEnviosPage() {
    const supabase = await createClient()

    // Obtener datos usando las funciones de modelos
    const sucursales = await getSucursales(supabase)
    const rutasConTramos = await getRutasConTramos(supabase)
    const envios = await getEnviosActivos(supabase)

    const sucursalMap = new Map(sucursales.map(s => [s.idSucursal, s]))
    const rutaMap = new Map(rutasConTramos.map(r => [r.idRuta, r]))
    const { data: empleados } = await supabase.from("empleado").select("legajo_empleado, nombre_empleado")
    const empleadoMap = new Map(empleados?.map((e) => [e.legajo_empleado, e.nombre_empleado]) || [])

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Envíos</h1>
                        <p className="mt-2 text-muted-foreground">Monitorea y gestiona todos los envíos del sistema</p>
                    </div>

                    {/* Botón para volver al menú principal */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al menú principal
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-foreground">Envíos Activos</h2>
                            <div className="flex gap-2">
                                <Link href="/admin/envios/crear">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Truck className="h-4 w-4 mr-2" />
                                        + Crear envío
                                    </Button>
                                </Link>

                            </div>
                        </div>

                        <EnviosTable
                            envios={envios}
                            empleadoMap={empleadoMap}
                            rutaMap={rutaMap}
                            sucursalMap={sucursalMap}
                        />

                        {/* Routes and Branches */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Catálogo de Rutas</CardTitle>
                                    <CardDescription>Rutas predefinidas disponibles</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="max-h-80 overflow-y-auto space-y-4">
                                        {rutasConTramos.length > 0 ? (
                                            rutasConTramos.map((route) => {
                                                const caminoOrdenado = construirCaminoRuta(route.tramos)

                                                return (
                                                    <div key={route.idRuta} className="border rounded-lg p-3">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium">{route.nombreRuta}</h4>
                                                        </div>
                                                        {caminoOrdenado.length > 0 ? (
                                                            <div className="space-y-2">
                                                                <p className="text-xs text-muted-foreground">Recorrido:</p>
                                                                <div className="text-sm space-y-1">
                                                                    {caminoOrdenado.map((tramo, index) => (
                                                                        <div key={`${tramo.nroTramo}-${index}`} className="flex items-center gap-1 text-xs">
                                                                            <span className="font-medium text-foreground">
                                                                                {tramo.nombreSucursalOrigen || `Sucursal ${tramo.idSucursalOrigen}`}
                                                                            </span>
                                                                            <span className="text-muted-foreground">→</span>
                                                                            <span className="font-medium text-foreground">
                                                                                {tramo.nombreSucursalDestino || `Sucursal ${tramo.idSucursalDestino}`}
                                                                            </span>
                                                                            <span className="text-muted-foreground">
                                                                                ({tramo.distanciaKm || 0} km)
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground pt-1">
                                                                    {caminoOrdenado.length} tramo(s)
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-muted-foreground">Sin tramos asignados</p>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No hay rutas disponibles</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Catálogo de Sucursales</CardTitle>
                                    <CardDescription>Sucursales disponibles</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="max-h-80 overflow-y-auto space-y-4">
                                        {sucursales.length > 0 ? (
                                            sucursales.map((branch) => (
                                                <div key={branch.idSucursal} className="border rounded-lg p-3">
                                                    <h4 className="font-medium mb-1">{branch.ciudadSucursal}</h4>
                                                    <p className="text-sm text-muted-foreground mb-1">{branch.direccionSucursal}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No hay sucursales disponibles</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}