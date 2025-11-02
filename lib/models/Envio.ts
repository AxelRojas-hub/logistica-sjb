import { SupabaseClient } from "@supabase/supabase-js";

export async function getEnvioAsignadoByLegajo(legajoEmpleado: string, supabase: SupabaseClient) {
    const { data: envioAsignado, error } = await supabase.from("envio").select("*").eq("legajo_empleado", legajoEmpleado).neq("estado_envio", "finalizado").single();

    if (error) {
        return null;
    }

    return envioAsignado;
}

export async function getEnviosActivos(supabase: SupabaseClient) {
    const { data: envios, error } = await supabase
        .from("envio")
        .select("*")
        .neq("estado_envio", "finalizado")
        .order("id_envio", { ascending: false });

    if (error) {
        console.error("Error al obtener envíos activos:", error);
        return [];
    }

    return envios || [];
}