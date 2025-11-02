"use server"

import { createClient } from "@/lib/supabaseServer"

export async function updateEnvioSucursalActual(idSucursalDestino: number) {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const legajo = user.data?.user?.user_metadata?.legajo;

    if (!legajo) {
        throw new Error("No se pudo obtener el legajo del usuario")
    }

    // Obtener el envío asignado al chofer
    const { data: envioData, error: envioError } = await supabase
        .from("envio")
        .select("*")
        .eq("legajo_empleado", legajo)
        .single()

    if (envioError || !envioData) {
        throw new Error("No se encontró envío asignado")
    }

    // Actualizar la sucursal actual del envío
    const { data, error } = await supabase
        .from("envio")
        .update({ id_sucursal_actual: idSucursalDestino })
        .eq("id_envio", envioData.id_envio)
        .select()
        .single()

    if (error) {
        throw new Error(`Error al actualizar sucursal: ${error.message}`)
    }

    return data
}

export async function finalizarEnvio() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const legajo = user.data?.user?.user_metadata?.legajo;

    if (!legajo) {
        throw new Error("No se pudo obtener el legajo del usuario")
    }

    // Obtener el envío asignado al chofer
    const { data: envioData, error: envioError } = await supabase
        .from("envio")
        .select("*")
        .eq("legajo_empleado", legajo)
        .single()

    if (envioError || !envioData) {
        throw new Error("No se encontró envío asignado")
    }

    // Actualizar el estado del envío a finalizado
    const { data, error } = await supabase
        .from("envio")
        .update({ estado_envio: "finalizado" })
        .eq("id_envio", envioData.id_envio)
        .select()
        .single()

    if (error) {
        throw new Error(`Error al finalizar envío: ${error.message}`)
    }

    return data
}
