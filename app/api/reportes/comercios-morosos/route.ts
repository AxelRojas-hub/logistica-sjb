import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dias = parseInt(searchParams.get("dias") || "30")

        const supabase = await createClient()
        
        // Verificar autenticación
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            )
        }

        // Verificar que el usuario sea administrador
        const { data: adminData, error: adminError } = await supabase
            .from('administrador')
            .select('legajo_empleado')
            .eq('legajo_empleado', user.user_metadata.legajoEmpleado)
            .single()

        if (adminError || !adminData) {
            return NextResponse.json(
                { error: "Acceso denegado. Se requieren privilegios de administrador" },
                { status: 403 }
            )
        }

        // Primero verificamos si hay facturas vencidas
        const { data: facturasVencidas, error: checkError } = await supabase
            .from('factura')
            .select('id_factura')
            .eq('estado_pago', 'vencido')
            .limit(1)

        if (checkError) {
            console.error('Error al verificar facturas:', checkError)
            throw checkError
        }

        // Si no hay facturas vencidas, retornamos array vacío
        if (!facturasVencidas || facturasVencidas.length === 0) {
            return NextResponse.json([])
        }

        // Si hay facturas vencidas, obtenemos el reporte completo
        const { data: comerciosMorosos, error: queryError } = await supabase
            .rpc('obtener_comercios_morosos', { dias_atras: dias })

        if (queryError) {
            console.error('Error al obtener comercios morosos:', queryError)
            throw queryError
        }

        return NextResponse.json(comerciosMorosos)
    } catch (error) {
        console.error('Error en GET /api/reportes/comercios-morosos:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}