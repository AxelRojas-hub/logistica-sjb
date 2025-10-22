import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabaseServer"
import { getRutaConTramo } from "@/lib/models/Ruta"
import type { RutaConTramos, Tramo } from "@/lib/types"
import { CheckinContent } from "./checkinContent"
import { getEnvioAsignadoByLegajo } from "@/lib/models/Envio"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

export default async function ChoferCheckinPage() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const legajo = user.data!.user!.user_metadata.legajo;
    const envioAsignado = await getEnvioAsignadoByLegajo(legajo, supabase);
    const idSucursalActual = envioAsignado.id_sucursal_actual;
    const idRuta = envioAsignado.id_ruta;
    const rutaData = await getRutaConTramo(supabase, idRuta)
    const tramoActual = rutaData!.tramos.findIndex((tramo) => { return tramo.idSucursalOrigen === idSucursalActual })
    let currentRoute: RutaConEstado | null = null

    if (rutaData && rutaData.tramos.length > 0) {
        // Mapear los tramos a TramoConEstado con estados
        const tramosConEstado: TramoConEstado[] = rutaData.tramos.map((tramo, index) => ({
            ...tramo,
            estado: index === tramoActual ? "actual" : "pendiente" as const
        }))

        currentRoute = {
            ...rutaData,
            tramos: tramosConEstado,
            tramoActual
        }
    }

    return (
        <TooltipProvider>
            <div className="min-h-[80dvh] bg-background flex flex-col">
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/chofer">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al menú principal
                                </Button>
                            </Link>
                        </div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Check-in en Sucursal</h1>
                            <p className="mt-2 text-muted-foreground">Marca la llegada a cada sucursal de tu ruta</p>
                        </div>

                        <CheckinContent initialRoute={currentRoute} />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}