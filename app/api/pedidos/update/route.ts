import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { idPedido, idSucursalDestino, fechaLimiteEntrega } = await request.json()

        if (!idPedido || !idSucursalDestino || !fechaLimiteEntrega) {
            return NextResponse.json(
                { success: false, message: "Datos incompletos" },
                { status: 400 }
            )
        }

        const { data: pedidoExistente, error: pedidoError } = await supabase
            .from('pedido')
            .select('id_pedido, estado_pedido')
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

        const { error: updateError } = await supabase
            .from('pedido')
            .update({
                id_sucursal_destino: idSucursalDestino,
                fecha_limite_entrega: fechaLimiteEntrega
            })
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
            message: "Pedido actualizado correctamente"
        })

    } catch (error) {
        console.error('Error interno del servidor:', error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}