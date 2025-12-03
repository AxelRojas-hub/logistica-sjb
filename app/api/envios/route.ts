import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { BrevoService } from "@/lib/services/brevoService"
import { Pedido } from "@/lib/types"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Obtener datos del request
        const { legajoChofer, pedidosIncluidos, idRuta, idSucursalOrigen } = await request.json()

        // Validar datos requeridos
        if (!legajoChofer || !pedidosIncluidos || !Array.isArray(pedidosIncluidos) || pedidosIncluidos.length === 0 || !idRuta || !idSucursalOrigen) {
            return NextResponse.json(
                { error: "Faltan datos requeridos: legajoChofer, pedidosIncluidos, idRuta, idSucursalOrigen" },
                { status: 400 }
            )
        }

        // 0. Validar que los pedidos no estén ya en un envío activo
        const idsPedidos = pedidosIncluidos.map((pedido: Pedido) => pedido.idPedido)

        const { data: pedidosExistentes, error: errorValidacion } = await supabase
            .from("pedido")
            .select("id_pedido, estado_pedido")
            .in("id_pedido", idsPedidos)

        if (errorValidacion) {
            console.error("Error validando pedidos:", errorValidacion)
            return NextResponse.json({ error: "Error al validar estado de los pedidos" }, { status: 500 })
        }

        const pedidosYaEnviados = pedidosExistentes?.filter(p => p.estado_pedido === 'en_camino' || p.estado_pedido === 'entregado') || []

        if (pedidosYaEnviados.length > 0) {
            return NextResponse.json(
                { error: `Algunos pedidos ya han sido enviados o entregados. Por favor actualice la página.` },
                { status: 409 }
            )
        }

        // 1. Crear el envío nuevo
        const { data: envioCreado, error: errorEnvio } = await supabase
            .from("envio")
            .insert({
                legajo_empleado: parseInt(legajoChofer),
                id_ruta: idRuta,
                id_sucursal_actual: idSucursalOrigen,
                estado_envio: "en_camino"
            })
            .select("id_envio")
            .single()

        if (errorEnvio) {
            console.error("Error al crear envío:", errorEnvio)
            return NextResponse.json(
                { error: "Error al crear el envío", details: errorEnvio.message },
                { status: 500 }
            )
        }

        const idEnvioCreado = envioCreado.id_envio

        // 3. Actualizar los pedidos: asignar id_envio y cambiar estado a 'en_camino'
        const { error: errorPedidos } = await supabase
            .from("pedido")
            .update({
                id_envio: idEnvioCreado,
                estado_pedido: "en_camino"
            })
            .in("id_pedido", idsPedidos)

        if (errorPedidos) {
            console.error("Error al actualizar pedidos:", errorPedidos)
            return NextResponse.json(
                { error: "Error al actualizar los pedidos", details: errorPedidos.message },
                { status: 500 }
            )
        }

        // 3.1 Enviar notificaciones por email para pedidos despachados
        for (const idPedido of idsPedidos) {
            try {
                await BrevoService.notifyOrderDispatched(idPedido)
            } catch (emailError) {
                console.error(`Error sending dispatch email for order ${idPedido}:`, emailError)
                // No interrumpir el flujo principal por errores de email
            }
        }

        // 4. Actualizar el estado del chofer a 'ocupado'
        const { error: errorChofer } = await supabase
            .from("chofer")
            .update({
                estado_chofer: "ocupado"
            })
            .eq("legajo_empleado", parseInt(legajoChofer))

        if (errorChofer) {
            console.error("Error al actualizar estado del chofer:", errorChofer)
            return NextResponse.json(
                { error: "Error al actualizar el estado del chofer", details: errorChofer.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            idEnvio: idEnvioCreado,
            pedidosActualizados: idsPedidos.length,
            message: `Envío creado exitosamente con ${idsPedidos.length} pedidos asignados y chofer marcado como ocupado`
        })

    } catch (error) {
        console.error("Error en el endpoint de envíos:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}