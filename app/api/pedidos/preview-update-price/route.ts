import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { calcularPrecioPedido } from '@/lib/models/Pedido'
import { calcularDistanciaEntreSucursales } from '@/lib/models/Ruta'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { idPedido, idSucursalDestino } = await request.json()

        if (!idPedido || !idSucursalDestino) {
            return NextResponse.json(
                { success: false, message: "Datos incompletos" },
                { status: 400 }
            )
        }

        // Obtener datos del pedido
        const { data: pedidoExistente, error: pedidoError } = await supabase
            .from('pedido')
            .select('id_pedido, id_comercio, id_sucursal_destino')
            .eq('id_pedido', idPedido)
            .single()

        if (pedidoError || !pedidoExistente) {
            return NextResponse.json(
                { success: false, message: "Pedido no encontrado" },
                { status: 404 }
            )
        }

        // Si la sucursal es la misma, no hay cambio de precio (o no deberíamos recalcular con peso aleatorio)
        if (pedidoExistente.id_sucursal_destino === idSucursalDestino) {
            return NextResponse.json({
                success: true,
                precio: null, // Indica que no hay cambio
                peso: null
            })
        }

        // Obtener sucursal origen del comercio
        const { data: comercioData } = await supabase
            .from('comercio')
            .select('id_sucursal_origen')
            .eq('id_comercio', pedidoExistente.id_comercio)
            .single()

        if (!comercioData) {
            return NextResponse.json(
                { success: false, message: "Error al obtener datos del comercio" },
                { status: 500 }
            )
        }

        // Obtener servicios del pedido
        const { data: servicios } = await supabase
            .from('pedido_servicio')
            .select('id_servicio, servicio(costo_servicio)')
            .eq('id_pedido', idPedido)

        const costoBaseTransporte = (servicios?.[0] as unknown as { servicio: { costo_servicio: number } })?.servicio?.costo_servicio || 0
        const costosAdicionales = servicios?.slice(1).map((s) => (s as unknown as { servicio: { costo_servicio: number } }).servicio?.costo_servicio || 0) || []

        // Calcular distancia
        const distanciaKm = await calcularDistanciaEntreSucursales(
            supabase,
            comercioData.id_sucursal_origen,
            idSucursalDestino
        )

        // Calcular nuevo precio usando promedio de tarifario (peso = null)
        const calculoPrecio = await calcularPrecioPedido(supabase, {
            idComercio: pedidoExistente.id_comercio,
            costoBaseTransporte,
            costosServiciosAdicionales: costosAdicionales,
            distanciaKm,
            peso: null
        })

        return NextResponse.json({
            success: true,
            precio: calculoPrecio.precioFinal,
            peso: null
        })

    } catch (error) {
        console.error('Error interno del servidor:', error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
