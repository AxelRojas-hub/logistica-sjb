import { Sucursal } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"

export async function useSucursales(supabase: SupabaseClient): Promise<Sucursal[]> {
    const { data: sucursalesData, error: sucursalesError } = await supabase
        .from("sucursal")
        .select("*")

    if (sucursalesError) {
        console.error("Error al obtener sucursales:", sucursalesError)
        return []
    }

    return (sucursalesData || []).map((row: any) => ({
        idSucursal: row.id_sucursal,
        direccionSucursal: row.direccion_sucursal,
        ciudadSucursal: row.ciudad_sucursal,
    }))
}
