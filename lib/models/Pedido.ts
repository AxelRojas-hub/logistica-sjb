import { Pedido } from "@/lib/types"
import { SupabaseClient } from "@supabase/supabase-js"

export interface PedidoConDetalles extends Pedido {
    nombreComercio?: string
    ciudadDestino?: string
}


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

function mapRowToPedidoConDetalles(row: Record<string, unknown>): PedidoConDetalles {
    const pedidoBase = mapRowToPedido(row)

    const comercio = row.comercio as Record<string, unknown> | null
    const sucursal = row.sucursal as Record<string, unknown> | null

    return {
        ...pedidoBase,
        nombreComercio: comercio?.nombre_comercio as string | undefined,
        ciudadDestino: sucursal?.ciudad_sucursal as string | undefined,
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

export async function getPedidosPendientesPorSucursalAdmin(supabase: SupabaseClient, legajoAdmin: number): Promise<PedidoConDetalles[]> {
    // sucursal del admin
    const { data: adminData, error: adminError } = await supabase
        .from("administrador")
        .select("id_sucursal")
        .eq("legajo_empleado", legajoAdmin)
        .single()

    if (adminError || !adminData) {
        console.error("Error al obtener datos del administrador:", adminError)
        return []
    }

    const { data, error } = await supabase
        .from("pedido")
        .select(`
            *,
            comercio!inner(
                id_comercio,
                id_sucursal_origen,
                nombre_comercio
            ),
            sucursal(
                id_sucursal,
                ciudad_sucursal
            )
        `)
        .eq("estado_pedido", "en_preparacion")
        .eq("comercio.id_sucursal_origen", adminData.id_sucursal)
        .is("id_envio", null)
        .order("id_pedido", { ascending: false })

    if (error) {
        console.error("Error al obtener pedidos pendientes por sucursal admin:", error)
        return []
    }

    return (data || []).map(mapRowToPedidoConDetalles)
}

export async function getPedidosPendientesConSucursalAdmin(supabase: SupabaseClient, legajoAdmin: number): Promise<{ pedidos: PedidoConDetalles[], idSucursalOrigen: number }> {
    // sucursal del admin
    const { data: adminData, error: adminError } = await supabase
        .from("administrador")
        .select("id_sucursal")
        .eq("legajo_empleado", legajoAdmin)
        .single()

    if (adminError || !adminData) {
        console.error("Error al obtener datos del administrador:", adminError)
        return { pedidos: [], idSucursalOrigen: 0 }
    }

    const idSucursalOrigen = adminData.id_sucursal

    const { data, error } = await supabase
        .from("pedido")
        .select(`
            *,
            comercio!inner(
                id_comercio,
                id_sucursal_origen,
                nombre_comercio
            ),
            sucursal(
                id_sucursal,
                ciudad_sucursal
            )
        `)
        .eq("estado_pedido", "en_preparacion")
        .eq("comercio.id_sucursal_origen", idSucursalOrigen)
        .is("id_envio", null)
        .order("id_pedido", { ascending: false })

    if (error) {
        console.error("Error al obtener pedidos pendientes por sucursal admin:", error)
        return { pedidos: [], idSucursalOrigen }
    }

    const pedidos = (data || []).map(mapRowToPedidoConDetalles)
    return { pedidos, idSucursalOrigen }
}


/**
 * Calcula el costo por kilómetro según el peso del pedido consultando la tabla tarifario
 * @param supabase Cliente de Supabase
 * @param peso Peso en kilogramos
 * @returns Costo por kilómetro en la moneda base
 */
export async function calcularCostoPorKm(supabase: SupabaseClient, peso: number): Promise<number> {
    const { data, error } = await supabase
        .from("tarifario")
        .select("precio_por_km")
        .gte("peso_hasta", peso)
        .order("peso_hasta", { ascending: true })
        .limit(1)
        .single()

    if (error || !data) {
        console.error("Error al obtener tarifa por peso:", error)
        return -1
    }

    return data.precio_por_km as number
}

export interface CalculoPrecio {
    precioFinal: number
    precioSinDescuento: number
    descuentoPorcentaje: number
}

/**
 * Calcula el precio total de un pedido aplicando el descuento del contrato si existe
 * @param supabase Cliente de Supabase
 * @param params Parámetros del pedido
 * @param params.idComercio ID del comercio para obtener el descuento del contrato
 * @param params.costoBaseTransporte Costo base del servicio de transporte
 * @param params.costosServiciosAdicionales Array de costos de servicios adicionales
 * @param params.distanciaKm Distancia en kilómetros entre origen y destino
 * @param params.peso Peso del pedido en kilogramos
 * @returns Objeto con precio final, precio sin descuento y porcentaje de descuento
 */
export async function calcularPrecioPedido(
    supabase: SupabaseClient,
    params: {
        idComercio: number
        costoBaseTransporte: number
        costosServiciosAdicionales: number[]
        distanciaKm: number
        peso: number
    }
): Promise<CalculoPrecio> {
    const { idComercio, costoBaseTransporte, costosServiciosAdicionales, distanciaKm, peso } = params

    const costoPorKm = await calcularCostoPorKm(supabase, peso)
    const costoTransporte = costoBaseTransporte + (costoPorKm * distanciaKm)
    const costoAdicionales = costosServiciosAdicionales.reduce((sum, costo) => sum + costo, 0)

    const precioSinDescuento = costoTransporte + costoAdicionales

    // Obtener descuento del contrato del comercio
    const { data: comercioData } = await supabase
        .from("comercio")
        .select("id_contrato")
        .eq("id_comercio", idComercio)
        .single()

    let descuento = 0
    if (comercioData?.id_contrato) {
        const { data: contratoData } = await supabase
            .from("contrato")
            .select("descuento")
            .eq("id_contrato", comercioData.id_contrato)
            .single()
        
        descuento = contratoData?.descuento || 0
    }

    // Aplicar descuento solo al costo de transporte
    const costoTransporteConDescuento = costoTransporte * (1 - descuento / 100)
    const precioFinal = costoTransporteConDescuento + costoAdicionales
    
    return {
        precioFinal,
        precioSinDescuento,
        descuentoPorcentaje: descuento
    }
}
