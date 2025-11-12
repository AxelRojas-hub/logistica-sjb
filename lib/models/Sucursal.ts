import { Sucursal } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"

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

export async function getSucursalesAlcanzables(supabase: SupabaseClient, idSucursalOrigen: number): Promise<Sucursal[]> {
    const { data, error } = await supabase.rpc('obtener_sucursales_alcanzables', {
        p_id_sucursal_origen: idSucursalOrigen
    })

    if (error) {
        console.error("Error al obtener sucursales alcanzables:", error)
        return []
    }

    return (data || []).map(mapRowToSucursal)
}