import { Ruta, Tramo } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"
import { RutaConTramos } from "@/lib/types"


export async function getRutasConTramos(supabase: SupabaseClient): Promise<RutaConTramos[]> {
    // Obtener rutas
    const { data: rutasData, error: rutasError } = await supabase
        .from("ruta")
        .select("*")

    if (rutasError) {
        console.error("Error al obtener rutas:", rutasError)
        return []
    }

    const rutas: Ruta[] = (rutasData || []).map((row: Record<string, unknown>) => ({
        idRuta: row.id_ruta as number,
        nombreRuta: row.nombre_ruta as string,
    }))

    // Obtener tramos con sus sucursales asociadas
    const { data: tramosData, error: tramosError } = await supabase
        .from("tramo")
        .select("*, sucursal_origen:id_sucursal_origen(id_sucursal, ciudad_sucursal), sucursal_destino:id_sucursal_destino(id_sucursal, ciudad_sucursal)")

    if (tramosError) {
        console.error("Error al obtener tramos:", tramosError)
        return rutas.map((ruta) => ({
            idRuta: ruta.idRuta,
            nombreRuta: ruta.nombreRuta,
            tramos: [],
        }))
    }

    // Obtener relación ruta_tramo
    const { data: rutaTramosData, error: rutaTramosError } = await supabase
        .from("ruta_tramo")
        .select("*")

    if (rutaTramosError) {
        console.error("Error al obtener relación ruta_tramo:", rutaTramosError)
        return rutas.map((ruta) => ({
            idRuta: ruta.idRuta,
            nombreRuta: ruta.nombreRuta,
            tramos: [],
        }))
    }

    // Crear un mapa de tramos por ruta
    const tramoPorRuta = new Map<number, Tramo[]>()
    rutaTramosData?.forEach((rt: Record<string, unknown>) => {
        const idRuta = rt.id_ruta as number
        if (!tramoPorRuta.has(idRuta)) {
            tramoPorRuta.set(idRuta, [])
        }
        const tramo = tramosData?.find((t: Record<string, unknown>) => t.nro_tramo === rt.nro_tramo)
        if (tramo) {
            tramoPorRuta.get(idRuta)?.push(tramo as Tramo)
        }
    })

    // Mapear rutas con sus tramos ordenados
    return rutas.map((ruta) => ({
        idRuta: ruta.idRuta,
        nombreRuta: ruta.nombreRuta,
        tramos: tramoPorRuta.get(ruta.idRuta) || [],
    }))
}

/**
 * Construye el camino ordenado de sucursales desde los tramos
 * Identifica el punto de inicio y encadena los tramos en orden
 * @param tramos Array de tramos para la ruta
 * @returns Array de tramos ordenados desde inicio hasta fin
 */
export function construirCaminoRuta(tramos: Tramo[]): Tramo[] {
    if (tramos.length === 0) return []

    // Encontrar el nodo inicial (sucursal que no es destino de ningún tramo)
    const todosDest = new Set(tramos.map((t: Tramo) => t.idSucursalDestino))
    const startTramo = tramos.find((t: Tramo) => !todosDest.has(t.idSucursalOrigen))

    if (!startTramo) return tramos // Si hay ciclo, retornar en orden original

    // Construir el camino ordenado encadenando tramos
    const camino: Tramo[] = [startTramo]
    let currentDestino = startTramo.idSucursalDestino

    while (camino.length < tramos.length) {
        const nextTramo = tramos.find(
            (t: Tramo) => t.idSucursalOrigen === currentDestino && !camino.includes(t)
        )
        if (!nextTramo) break
        camino.push(nextTramo)
        currentDestino = nextTramo.idSucursalDestino
    }

    return camino
}
