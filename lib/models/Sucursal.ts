import { Sucursal } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"

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
