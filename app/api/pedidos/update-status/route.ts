import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { BrevoService } from "@/lib/services/brevoService"
import type { EstadoPedido } from "@/lib/types"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { idPedido, nuevoEstado }: { idPedido: number; nuevoEstado: EstadoPedido } = await request.json()

        if (!idPedido || !nuevoEstado) {
            return NextResponse.json(
                { success: false, message: "Datos incompletos" },
                { status: 400 }
            )
        }

        // Verificar que el pedido existe
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

        const estadoAnterior = pedidoExistente.estado_pedido

        // Actualizar el estado del pedido
        const updateData: { estado_pedido: EstadoPedido; fecha_entrega?: string } = { estado_pedido: nuevoEstado }

        // Si se marca como entregado, registrar fecha de entrega
        if (nuevoEstado === 'entregado') {
            updateData.fecha_entrega = new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('pedido')
            .update(updateData)
            .eq('id_pedido', idPedido)

        if (updateError) {
            console.error('Error al actualizar estado del pedido:', updateError)
            return NextResponse.json(
                { success: false, message: "Error al actualizar el pedido" },
                { status: 500 }
            )
        }

        // Enviar notificaciones por email según el nuevo estado
        try {
            if (nuevoEstado === 'en_camino' && estadoAnterior === 'en_preparacion') {
                await BrevoService.notifyOrderDispatched(idPedido)
            } else if (nuevoEstado === 'entregado') {
                await BrevoService.notifyOrderDelivered(idPedido)
            }
        } catch (emailError) {
            console.error(`Error sending email notification for order ${idPedido}:`, emailError)
            // No interrumpir el flujo principal por errores de email
        }

        return NextResponse.json({
            success: true,
            message: "Estado del pedido actualizado correctamente",
            estadoAnterior,
            nuevoEstado
        })

    } catch (error) {
        console.error('Error interno del servidor:', error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
