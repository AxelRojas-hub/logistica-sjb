import { Ruta } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"

interface RutaConTramos {
    idRuta: number
    nombreRuta: string
    tramos: any[]
}

/**
 * Obtiene todas las rutas con sus tramos asociados ordenados correctamente
 * @param supabase Cliente de Supabase
 * @returns Array de rutas con sus tramos
 */
export async function useRutasConTramos(supabase: SupabaseClient): Promise<RutaConTramos[]> {
    // Obtener rutas
    const { data: rutasData, error: rutasError } = await supabase
        .from("ruta")
        .select("*")

    if (rutasError) {
        console.error("Error al obtener rutas:", rutasError)
        return []
    }

    const rutas: Ruta[] = (rutasData || []).map((row: any) => ({
        idRuta: row.id_ruta,
        nombreRuta: row.nombre_ruta,
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
    const tramoPorRuta = new Map<number, any[]>()
    rutaTramosData?.forEach((rt: any) => {
        if (!tramoPorRuta.has(rt.id_ruta)) {
            tramoPorRuta.set(rt.id_ruta, [])
        }
        const tramo = tramosData?.find((t: any) => t.nro_tramo === rt.nro_tramo)
        if (tramo) {
            tramoPorRuta.get(rt.id_ruta)?.push(tramo)
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
export function construirCaminoRuta(tramos: any[]): any[] {
    if (tramos.length === 0) return []

    // Encontrar el nodo inicial (sucursal que no es destino de ningún tramo)
    const todosDest = new Set(tramos.map((t: any) => t.id_sucursal_destino))
    const startTramo = tramos.find((t: any) => !todosDest.has(t.id_sucursal_origen))

    if (!startTramo) return tramos // Si hay ciclo, retornar en orden original

    // Construir el camino ordenado encadenando tramos
    const camino: any[] = [startTramo]
    let currentDestino = startTramo.id_sucursal_destino

    while (camino.length < tramos.length) {
        const nextTramo = tramos.find(
            (t: any) => t.id_sucursal_origen === currentDestino && !camino.includes(t)
        )
        if (!nextTramo) break
        camino.push(nextTramo)
        currentDestino = nextTramo.id_sucursal_destino
    }

    return camino
}
