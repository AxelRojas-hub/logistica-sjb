import { TooltipProvider } from "@/components/ui/tooltip"
import { PageHeader } from "./components"
import { CrearEnvioContent } from "./crearEnvioContent"
import { createClient } from "@/lib/supabaseServer"
import { getRutasConTramos } from "@/lib/models/Ruta"

export default async function AdminCrearEnvioPage() {
    const supabase = await createClient()

    // Obtener rutas disponibles
    const rutasConTramos = await getRutasConTramos(supabase)
    const rutas: { id: string; nombre: string }[] = rutasConTramos.map((r) => ({
        id: r.idRuta.toString(),
        nombre: r.nombreRuta,
    }))

    // Obtener choferes disponibles (empleados con rol de chofer)
    const { data: choforesData, error: choforesError } = await supabase
        .from("empleado")
        .select("*")
        .eq("rol", "chofer")

    if (choforesError) {
        console.error("Error al obtener choferes:", choforesError)
    }

    const choferes: { id: string; nombre: string }[] = (choforesData || []).map(
        (row: Record<string, unknown>) => ({
            id: (row.legajo_empleado as number).toString(),
            nombre: row.nombre_empleado as string,
        })
    )

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <PageHeader />

                    <CrearEnvioContent rutas={rutas} choferes={choferes} />
                </div>
            </div>
        </TooltipProvider>
    )
}

