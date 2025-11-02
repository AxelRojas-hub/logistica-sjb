import { Ruta, Tramo } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"
import { RutaConTramos } from "@/lib/types"

/**
 * Obtiene las rutas con sus tramos asociados desde la base de datos
 * @param supabase Cliente de Supabase
 * @returns Lista de TODAS las rutas con sus tramos
 */
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
        const tramoData = tramosData?.find((t: Record<string, unknown>) => t.nro_tramo === rt.nro_tramo)
        if (tramoData) {
            const tramo: Tramo = {
                nroTramo: tramoData.nro_tramo as number,
                idSucursalOrigen: tramoData.id_sucursal_origen as number,
                idSucursalDestino: tramoData.id_sucursal_destino as number,
                duracionEstimadaMin: tramoData.duracion_estimada_min as number,
                distanciaKm: tramoData.distancia_km as number,
                nombreSucursalOrigen: tramoData.sucursal_origen?.ciudad_sucursal as string | undefined,
                nombreSucursalDestino: typeof tramoData.sucursal_destino?.ciudad_sucursal === "string"
                    ? tramoData.sucursal_destino.ciudad_sucursal
                    : undefined,
            }
            tramoPorRuta.get(idRuta)?.push(tramo)
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

/**
 * Obtiene una ruta específica con sus tramos detallados
 * @param supabase Cliente de Supabase
 * @param idRuta ID de la ruta a obtener
 * @returns Objeto RutaConTramos o null si no existe
 */
export async function getRutaConTramo(supabase: SupabaseClient, idRuta: number): Promise<RutaConTramos | null> {
    // Obtener la ruta específica
    const { data: rutaData, error: rutaError } = await supabase
        .from("ruta")
        .select("*")
        .eq("id_ruta", idRuta)
        .single()

    if (rutaError || !rutaData) {
        console.error("Error al obtener ruta:", rutaError)
        return null
    }

    const ruta: Ruta = {
        idRuta: rutaData.id_ruta as number,
        nombreRuta: rutaData.nombre_ruta as string,
    }

    // Obtener tramos con sus sucursales asociadas
    const { data: tramosData, error: tramosError } = await supabase
        .from("tramo")
        .select("*, sucursal_origen:id_sucursal_origen(id_sucursal, ciudad_sucursal), sucursal_destino:id_sucursal_destino(id_sucursal, ciudad_sucursal)")

    if (tramosError) {
        console.error("Error al obtener tramos:", tramosError)
        return {
            idRuta: ruta.idRuta,
            nombreRuta: ruta.nombreRuta,
            tramos: [],
        }
    }

    // Obtener relación ruta_tramo específica
    const { data: rutaTramosData, error: rutaTramosError } = await supabase
        .from("ruta_tramo")
        .select("*")
        .eq("id_ruta", idRuta)

    if (rutaTramosError) {
        console.error("Error al obtener relación ruta_tramo:", rutaTramosError)
        return {
            idRuta: ruta.idRuta,
            nombreRuta: ruta.nombreRuta,
            tramos: [],
        }
    }

    // Mapear los tramos de esta ruta específica
    const tramos: Tramo[] = (rutaTramosData || [])
        .map((rt: Record<string, unknown>) => {
            const tramoData = tramosData?.find((t: Record<string, unknown>) => t.nro_tramo === rt.nro_tramo)
            if (tramoData) {
                return {
                    nroTramo: tramoData.nro_tramo as number,
                    idSucursalOrigen: tramoData.id_sucursal_origen as number,
                    idSucursalDestino: tramoData.id_sucursal_destino as number,
                    duracionEstimadaMin: tramoData.duracion_estimada_min as number,
                    distanciaKm: tramoData.distancia_km as number,
                    nombreSucursalOrigen: tramoData.sucursal_origen?.ciudad_sucursal as string | undefined,
                    nombreSucursalDestino: tramoData.sucursal_destino?.ciudad_sucursal as string | undefined,
                } as Tramo
            }
            return null
        })
        .filter((tramo): tramo is Tramo => tramo !== null)

    // Construir el camino ordenado de tramos
    const tramosOrdenados = construirCaminoRuta(tramos)
    return {
        idRuta: ruta.idRuta,
        nombreRuta: ruta.nombreRuta,
        tramos: tramosOrdenados,
    }
}
