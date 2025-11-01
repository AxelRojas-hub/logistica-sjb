import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const comercioId = searchParams.get('comercioId')

        if (!comercioId) {
            return NextResponse.json(
                { error: "comercioId es requerido" },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            )
        }

        const idCuentaComercio = user.user_metadata.idCuentaComercio
        

        const { data: comercioData, error: comercioError } = await supabase
            .from('comercio')
            .select('id_comercio')
            .eq('id_cuenta_comercio', idCuentaComercio)
            .eq('id_comercio', parseInt(comercioId))
            .single()
        
        if (comercioError || !comercioData) {
            return NextResponse.json(
                { error: "Acceso denegado al comercio" },
                { status: 403 }
            )
        }
        
        const pedidos = await getPedidosByComercio(supabase, parseInt(comercioId))
        
        return NextResponse.json(pedidos)
        
    } catch (error) {
        console.error("Error en GET /api/pedidos:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}