import { SupabaseClient } from "@supabase/supabase-js";

export async function getEnvioAsignadoByLegajo(legajoEmpleado: string,supabase: SupabaseClient){
    const { data: envioAsignado, error } = await supabase.from("envio").select("*").eq("legajo_empleado", legajoEmpleado).eq("estado_envio", "planificado").single();

    if (error) {
        console.error("Error fetching envio asignado:", error);
        return null;
    }

    return envioAsignado;
}