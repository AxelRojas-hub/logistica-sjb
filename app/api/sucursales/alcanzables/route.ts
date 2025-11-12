import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { getSucursalesAlcanzables } from "@/lib/models/Sucursal"

export async function GET(request: NextRequest) {
    try {
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
            .select('id_sucursal_origen')
            .eq('id_cuenta_comercio', idCuentaComercio)
            .single()

        if (comercioError || !comercioData) {
            return NextResponse.json(
                { error: "No se pudo obtener el comercio del usuario" },
                { status: 403 }
            )
        }

        const sucursales = await getSucursalesAlcanzables(supabase, comercioData.id_sucursal_origen)

        return NextResponse.json(sucursales)

    } catch (error) {
        console.error("Error en GET /api/sucursales/alcanzables:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
