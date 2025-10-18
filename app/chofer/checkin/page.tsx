import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabaseServer"
import { getRutaConTramo } from "@/lib/models/Ruta"
import type { RutaConTramos, Tramo } from "@/lib/types"
import { CheckinContent } from "./checkinContent"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

export default async function ChoferCheckinPage() {
    const supabase = await createClient()

    // Obtener la ruta con ID 1 y sus tramos
    const rutaData = await getRutaConTramo(supabase, 1)

    let currentRoute: RutaConEstado | null = null

    if (rutaData && rutaData.tramos.length > 0) {
        // Mapear los tramos a TramoConEstado con estados
        const tramosConEstado: TramoConEstado[] = rutaData.tramos.map((tramo, index) => ({
            ...tramo,
            estado: index === 0 ? "actual" : "pendiente" as const
        }))

        currentRoute = {
            ...rutaData,
            tramos: tramosConEstado,
            tramoActual: 0
        }
    }

    return (
        <TooltipProvider>
            <div className="h-screen bg-background flex flex-col">
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Botón para volver al menú principal */}
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