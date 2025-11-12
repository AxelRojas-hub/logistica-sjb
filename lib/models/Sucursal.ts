import { Sucursal } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"
import { getRutasConTramos, construirCaminoRuta } from "./Ruta"

export function mapRowToSucursal(row: Record<string, unknown>): Sucursal {
    return {
        idSucursal: row.id_sucursal as number,
        direccionSucursal: row.direccion_sucursal as string,
        ciudadSucursal: row.ciudad_sucursal as string,
    }
}

export async function getSucursales(supabase: SupabaseClient): Promise<Sucursal[]> {
    const { data: sucursalesData, error: sucursalesError } = await supabase
        .from("sucursal")
        .select("*")

    if (sucursalesError) {
        console.error("Error al obtener sucursales:", sucursalesError)
        return []
    }

    return (sucursalesData || []).map((row: Record<string, unknown>) => ({
        idSucursal: row.id_sucursal as number,
        direccionSucursal: row.direccion_sucursal as string,
        ciudadSucursal: row.ciudad_sucursal as string,
    }))
}

/**
 * Obtiene las sucursales alcanzables desde una sucursal de origen
 * Incluye la sucursal de origen y las sucursales que están DESPUÉS en las rutas
 */
export async function getSucursalesAlcanzables(supabase: SupabaseClient, idSucursalOrigen: number): Promise<Sucursal[]> {
    const rutasConTramos = await getRutasConTramos(supabase)
    
    const sucursalesAlcanzablesSet = new Set<number>([idSucursalOrigen])
    
    for (const ruta of rutasConTramos) {
        const tramosOrdenados = construirCaminoRuta(ruta.tramos)
        
        let posicionOrigen = -1
        for (let i = 0; i < tramosOrdenados.length; i++) {
            if (tramosOrdenados[i].idSucursalOrigen === idSucursalOrigen) {
                posicionOrigen = i
                break
            }
        }
        
        if (posicionOrigen !== -1) {
            for (let i = posicionOrigen; i < tramosOrdenados.length; i++) {
                sucursalesAlcanzablesSet.add(tramosOrdenados[i].idSucursalDestino)
            }
        }
    }
    
    const { data: sucursalesData, error: sucursalesError } = await supabase
        .from("sucursal")
        .select("*")
        .in("id_sucursal", Array.from(sucursalesAlcanzablesSet))
        .order("ciudad_sucursal")
    
    if (sucursalesError) {
        console.error("Error al obtener detalles de sucursales:", sucursalesError)
        return []
    }
    
    return (sucursalesData || []).map(mapRowToSucursal)
}