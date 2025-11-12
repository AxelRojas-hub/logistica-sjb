import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

export async function POST(request: NextRequest) {
    try {
        const { idPedido } = await request.json()
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: "No autenticado" },
                { status: 401 }
            )
        }

        const { data: adminData, error: adminError } = await supabase
            .from("administrador")
            .select("id_sucursal")
            .eq("legajo_empleado", user.user_metadata.legajo)
            .single()

        if (adminError || !adminData) {
            return NextResponse.json(
                { success: false, message: "Administrador no encontrado" },
                { status: 404 }
            )
        }

        const { data: pedido, error: pedidoError } = await supabase
            .from("pedido")
            .select("estado_pedido, id_sucursal_destino")
            .eq("id_pedido", idPedido)
            .single()

        if (pedidoError || !pedido) {
            return NextResponse.json(
                { success: false, message: "Pedido no encontrado" },
                { status: 404 }
            )
        }

        if (pedido.estado_pedido !== "en_sucursal") {
            return NextResponse.json(
                { success: false, message: "El pedido no está en sucursal" },
                { status: 403 }
            )
        }

        if (pedido.id_sucursal_destino !== adminData.id_sucursal) {
            return NextResponse.json(
                { success: false, message: "No tiene permiso para marcar este pedido (sucursal diferente)" },
                { status: 403 }
            )
        }

        const { error: updateError } = await supabase
            .from("pedido")
            .update({ estado_pedido: "entregado", fecha_entrega: new Date().toISOString() })
            .eq("id_pedido", idPedido)

        if (updateError) {
            console.error("Error al actualizar pedido:", updateError)
            return NextResponse.json(
                { success: false, message: "Error al actualizar pedido" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Error interno:", error)
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
