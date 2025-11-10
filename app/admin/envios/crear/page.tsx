import { TooltipProvider } from "@/components/ui/tooltip"
import { PageHeader } from "./components"
import { CrearEnvioContent } from "./crearEnvioContent"
import { createClient } from "@/lib/supabaseServer"
import { getRutasConTramos } from "@/lib/models/Ruta"
import { getPedidosPendientesPorSucursalAdmin, PedidoConDetalles } from "@/lib/models/Pedido"

export interface SucursalFrecuente {
    idSucursal: number
    ciudadSucursal: string
    cantidadPedidos: number
}

function calcularSucursalDestinoMasFrecuente(pedidos: PedidoConDetalles[]): SucursalFrecuente | null {
    if (pedidos.length === 0) return null

    const frecuencias = new Map<number, { ciudad: string, cantidad: number }>()

    pedidos.forEach(pedido => {
        const idSucursal = pedido.idSucursalDestino
        const ciudad = pedido.ciudadDestino || `Sucursal ${idSucursal}`

        if (frecuencias.has(idSucursal)) {
            frecuencias.get(idSucursal)!.cantidad++
        } else {
            frecuencias.set(idSucursal, { ciudad, cantidad: 1 })
        }
    })

    let maxFrecuencia = 0
    let sucursalMasFrecuente: SucursalFrecuente | null = null

    frecuencias.forEach((datos, idSucursal) => {
        if (datos.cantidad > maxFrecuencia) {
            maxFrecuencia = datos.cantidad
            sucursalMasFrecuente = {
                idSucursal,
                ciudadSucursal: datos.ciudad,
                cantidadPedidos: datos.cantidad
            }
        }
    })

    return sucursalMasFrecuente
}

export default async function AdminCrearEnvioPage() {
    const supabase = await createClient()

    const user = await supabase.auth.getUser()
    const legajoAdmin = user.data?.user?.user_metadata?.legajo

    if (!legajoAdmin) {
        throw new Error("No se pudo obtener el legajo del administrador")
    }

    const rutasConTramos = await getRutasConTramos(supabase)
    const rutas: { id: string; nombre: string }[] = rutasConTramos.map((r) => ({
        id: r.idRuta.toString(),
        nombre: r.nombreRuta,
    }))

    const { data: choferesData, error: choferesError } = await supabase
        .from("empleado")
        .select("*")
        .eq("rol", "chofer")

    if (choferesError) {
        console.error("Error al obtener choferes:", choferesError)
    }

    const choferes: { id: string; nombre: string }[] = (choferesData || []).map(
        (row: Record<string, unknown>) => ({
            id: (row.legajo_empleado as number).toString(),
            nombre: row.nombre_empleado as string,
        })
    )

    // Obtener pedidos pendientes de la sucursal del administrador
    const pedidosPendientes = await getPedidosPendientesPorSucursalAdmin(supabase, legajoAdmin)

    // Calcular la sucursal destino más frecuente
    const sucursalDestinoMasFrecuente = calcularSucursalDestinoMasFrecuente(pedidosPendientes)


    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <PageHeader />

                    <CrearEnvioContent
                        rutas={rutas}
                        choferes={choferes}
                        pedidosPendientes={pedidosPendientes}
                        sucursalDestinoMasFrecuente={sucursalDestinoMasFrecuente}
                    />
                </div>
            </div>
        </TooltipProvider>
    )
}

