import { SupabaseClient } from "@supabase/supabase-js";
import { Servicio } from "@/lib/types";

export async function getServicios(supabase: SupabaseClient): Promise<Servicio[]> {
    const { data, error } = await supabase
        .from("servicio")
        .select(`
            idServicio: id_servicio,
            nombreServicio: nombre_servicio,
            costoServicio: costo_servicio
        `);

    if (error) {
        console.error("Error al obtener servicios:", error);
        return [];
    }
    return data || [];
}