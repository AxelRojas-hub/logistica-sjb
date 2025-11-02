import { SupabaseClient } from "@supabase/supabase-js";

export async function getEnvioAsignadoByLegajo(legajoEmpleado: string, supabase: SupabaseClient) {
    const { data: envioAsignado, error } = await supabase.from("envio").select("*").eq("legajo_empleado", legajoEmpleado).neq("estado_envio", "finalizado").single();

    if (error) {
        return null;
    }

    return envioAsignado;
}