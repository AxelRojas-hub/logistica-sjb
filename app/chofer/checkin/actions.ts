"use server"

import { createClient } from "@/lib/supabaseServer"

/**
 * Actualiza el estado de los pedidos que han llegado a su sucursal destino
 * @param idEnvio ID del envío
 * @param idSucursalActual ID de la sucursal actual del envío
 */
async function actualizarEstadoPedidos(idEnvio: number, idSucursalActual: number) {
    const supabase = await createClient()

    // Obtener todos los pedidos del envío
    const { data: pedidosData, error: pedidosError } = await supabase
        .from("pedido")
        .select("id_pedido, id_sucursal_destino, estado_pedido")
        .eq("id_envio", idEnvio)

    if (pedidosError) {
        console.error("Error al obtener pedidos:", pedidosError)
        throw new Error(`Error al obtener pedidos: ${pedidosError.message}`)
    }

    if (!pedidosData || pedidosData.length === 0) {
        return // No hay pedidos para actualizar
    }

    // Identificar pedidos que han llegado a su destino
    const pedidosAActualizar = pedidosData.filter(
        pedido => pedido.id_sucursal_destino === idSucursalActual && pedido.estado_pedido !== "en_sucursal"
    )

    if (pedidosAActualizar.length === 0) {
        return // No hay pedidos para actualizar
    }

    // Actualizar el estado de los pedidos a "en_sucursal"
    const idsPedidos = pedidosAActualizar.map(p => p.id_pedido)

    const { error: updateError } = await supabase
        .from("pedido")
        .update({ estado_pedido: "en_sucursal" })
        .in("id_pedido", idsPedidos)

    if (updateError) {
        console.error("Error al actualizar estado de pedidos:", updateError)
        throw new Error(`Error al actualizar estado de pedidos: ${updateError.message}`)
    }
}

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

    // Actualizar el estado de los pedidos que han llegado a su destino
    await actualizarEstadoPedidos(envioData.id_envio, idSucursalDestino)

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

    // Obtener la ruta asignada al envío con sus tramos
    const { data: rutaTramosData, error: rutaTramosError } = await supabase
        .from("ruta_tramo")
        .select("nro_tramo")
        .eq("id_ruta", envioData.id_ruta)
        .order("nro_tramo", { ascending: true })

    if (rutaTramosError || !rutaTramosData || rutaTramosData.length === 0) {
        throw new Error("No se encontraron tramos para la ruta del envío")
    }

    // Obtener el último tramo
    const ultimoTramoNro = rutaTramosData[rutaTramosData.length - 1].nro_tramo

    // Obtener la información del último tramo
    const { data: ultimoTramoData, error: ultimoTramoError } = await supabase
        .from("tramo")
        .select("id_sucursal_destino")
        .eq("nro_tramo", ultimoTramoNro)
        .single()

    if (ultimoTramoError || !ultimoTramoData) {
        throw new Error("No se pudo obtener la información del último tramo")
    }

    const idSucursalDestino = ultimoTramoData.id_sucursal_destino

    // Actualizar el envío: sucursal actual a sucursal destino del último tramo y estado a finalizado
    const { data: envioUpdate, error: envioUpdateError } = await supabase
        .from("envio")
        .update({
            id_sucursal_actual: idSucursalDestino,
            estado_envio: "finalizado"
        })
        .eq("id_envio", envioData.id_envio)
        .select()
        .single()

    if (envioUpdateError) {
        throw new Error(`Error al actualizar envío: ${envioUpdateError.message}`)
    }

    // Actualizar el estado de los pedidos que han llegado a su destino
    await actualizarEstadoPedidos(envioData.id_envio, idSucursalDestino)

    // Actualizar el estado del chofer a libre
    const { error: choferUpdateError } = await supabase
        .from("chofer")
        .update({ estado_chofer: "libre" })
        .eq("legajo_empleado", legajo)

    if (choferUpdateError) {
        throw new Error(`Error al actualizar estado del chofer: ${choferUpdateError.message}`)
    }

    return envioUpdate
}
