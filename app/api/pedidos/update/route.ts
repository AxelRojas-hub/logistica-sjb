import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { calcularPrecioPedido } from '@/lib/models/Pedido'
import { calcularDistanciaEntreSucursales } from '@/lib/models/Ruta'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { idPedido, idSucursalDestino, fechaLimiteEntrega, peso } = await request.json()

        if (!idPedido || !idSucursalDestino || !fechaLimiteEntrega) {
            return NextResponse.json(
                { success: false, message: "Datos incompletos" },
                { status: 400 }
            )
        }

        const { data: pedidoExistente, error: pedidoError } = await supabase
            .from('pedido')
            .select('id_pedido, estado_pedido, id_comercio, id_sucursal_destino, id_factura, precio')
            .eq('id_pedido', idPedido)
            .single()

        if (pedidoError || !pedidoExistente) {
            return NextResponse.json(
                { success: false, message: "Pedido no encontrado" },
                { status: 404 }
            )
        }

        if (pedidoExistente.estado_pedido !== 'en_preparacion') {
            return NextResponse.json(
                { success: false, message: "Solo se pueden modificar pedidos en preparación" },
                { status: 400 }
            )
        }

        // Recalcular precio si cambió la sucursal destino
        let nuevoPrecio = null
        if (pedidoExistente.id_sucursal_destino !== idSucursalDestino) {
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

            nuevoPrecio = calculoPrecio.precioFinal
        }

        // Actualizar pedido
        const updateData: { id_sucursal_destino: number; fecha_limite_entrega: string; precio?: number } = {
            id_sucursal_destino: idSucursalDestino,
            fecha_limite_entrega: fechaLimiteEntrega
        }

        if (nuevoPrecio !== null) {
            updateData.precio = nuevoPrecio

            // Actualizar factura si el precio cambió
            if (pedidoExistente.id_factura && pedidoExistente.precio !== nuevoPrecio) {
                const { data: currentFactura } = await supabase
                    .from('factura')
                    .select('importe_total')
                    .eq('id_factura', pedidoExistente.id_factura)
                    .single()

                if (currentFactura) {
                    const precioAnterior = Number(pedidoExistente.precio || 0)
                    const precioNuevo = Number(nuevoPrecio)
                    const nuevoTotalFactura = Number(currentFactura.importe_total || 0) - precioAnterior + precioNuevo

                    await supabase
                        .from('factura')
                        .update({ importe_total: nuevoTotalFactura })
                        .eq('id_factura', pedidoExistente.id_factura)
                }
            }
        }

        const { error: updateError } = await supabase
            .from('pedido')
            .update(updateData)
            .eq('id_pedido', idPedido)

        if (updateError) {
            console.error('Error al actualizar pedido:', updateError)
            return NextResponse.json(
                { success: false, message: "Error al actualizar el pedido" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Pedido actualizado correctamente",
            data: {
                precioActualizado: nuevoPrecio !== null,
                nuevoPrecio
            }
        })

    } catch (error) {
        console.error('Error interno del servidor:', error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}