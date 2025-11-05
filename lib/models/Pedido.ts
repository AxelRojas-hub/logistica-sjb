import { Pedido } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"


function mapRowToPedido(row: Record<string, unknown>): Pedido {
    return {
        idPedido: row.id_pedido as number,
        idEnvio: row.id_envio as number | null,
        idComercio: row.id_comercio as number,
        idFactura: row.id_factura as number | null,
        idSucursalDestino: row.id_sucursal_destino as number,
        dniCliente: row.dni_cliente as number,
        estadoPedido: row.estado_pedido as Pedido['estadoPedido'],
        precio: row.precio as number,
        fechaEntrega: row.fecha_entrega as string | null,
        fechaLimiteEntrega: row.fecha_limite_entrega as string | null,
    }
}

export async function getPedidosByComercio(supabase: SupabaseClient, idComercio: number): Promise<Pedido[]> {
    const { data, error } = await supabase
        .from("pedido")
        .select("*")
        .eq("id_comercio", idComercio)
        .order("id_pedido", { ascending: false })

    if (error) {
        console.error("Error al obtener pedidos por comercio:", error)
        return []
    }

    return (data || []).map(mapRowToPedido)
}

export async function getPedidos(supabase: SupabaseClient): Promise<Pedido[]> {
    const { data, error } = await supabase
        .from("pedido")
        .select("*")
        .order("id_pedido", { ascending: false })

    if (error) {
        console.error("Error al obtener pedidos:", error)
        return []
    }

    return (data || []).map(mapRowToPedido)
}

interface CreatePedidoData {
    idComercio: number
    dniCliente: number
    idSucursalDestino: number
    precio: number
    fechaLimiteEntrega: string
}

export async function createPedido(supabase: SupabaseClient, pedidoData: CreatePedidoData): Promise<Pedido | null> {
    const { data, error } = await supabase
        .from("pedido")
        .insert({
            id_comercio: pedidoData.idComercio,
            dni_cliente: pedidoData.dniCliente,
            id_sucursal_destino: pedidoData.idSucursalDestino,
            precio: pedidoData.precio,
            fecha_limite_entrega: pedidoData.fechaLimiteEntrega,
            estado_pedido: "en_preparacion",
            id_envio: null,
            id_factura: null,
            fecha_entrega: null,
        })
        .select()
        .single()

    if (error) {
        console.error("Error al crear pedido:", error)
        return null
    }

    return data ? mapRowToPedido(data) : null
}
