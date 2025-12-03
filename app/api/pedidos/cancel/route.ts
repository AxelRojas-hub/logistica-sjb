import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

interface CancelPedidoRequest {
    idPedido: number
}

export async function POST(request: NextRequest) {
    try {
        const { idPedido }: CancelPedidoRequest = await request.json()
        if (!idPedido) {
            return NextResponse.json(
                { success: false, message: "El ID del pedido es requerido" },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Obtener datos del pedido antes de cancelar
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedido')
            .select('precio, id_factura')
            .eq('id_pedido', idPedido)
            .single()

        if (pedidoError || !pedido) {
            return NextResponse.json(
                { success: false, message: "Pedido no encontrado" },
                { status: 404 }
            )
        }

        // Actualizar factura si existe
        if (pedido.id_factura) {
            const { data: factura, error: facturaError } = await supabase
                .from('factura')
                .select('importe_total')
                .eq('id_factura', pedido.id_factura)
                .single()

            if (!facturaError && factura) {
                const nuevoTotal = Math.max(0, Number(factura.importe_total) - Number(pedido.precio))

                await supabase
                    .from('factura')
                    .update({ importe_total: nuevoTotal })
                    .eq('id_factura', pedido.id_factura)
            }
        }

        const { error: updateError } = await supabase
            .from('pedido')
            .update({ estado_pedido: 'cancelado' })
            .eq('id_pedido', idPedido)

        if (updateError) {
            console.error("Error al cancelar pedido:", updateError)
            return NextResponse.json(
                { success: false, message: "Error al cancelar el pedido" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Pedido cancelado exitosamente",
            data: {
                pedidoId: idPedido,
                nuevoEstado: 'cancelado'
            }
        })

    } catch (error) {
        console.error("Error inesperado al cancelar pedido:", error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}