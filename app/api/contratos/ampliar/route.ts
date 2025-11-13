import { createClient } from "@/lib/supabaseServer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { idContrato, serviciosNuevos } = await request.json()

        // 1. Validaciones
        if (!idContrato || !serviciosNuevos || serviciosNuevos.length === 0) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            )
        }

        // 2. Verificar que el contrato existe y está vigente
        const { data: contrato, error: contratoError } = await supabase
            .from('contrato')
            .select('*')
            .eq('id_contrato', idContrato)
            .single()

        if (contratoError || !contrato || contrato.estado_contrato !== 'vigente') {
            return NextResponse.json(
                { error: "Contrato no válido o no vigente" },
                { status: 400 }
            )
        }

        // 3. Verificar que los servicios no estén ya agregados
        const { data: serviciosActuales } = await supabase
            .from('contrato_servicio')
            .select('id_servicio')
            .eq('id_contrato', idContrato)

        const idsActuales = serviciosActuales?.map(s => s.id_servicio) || []
        const serviciosDuplicados = serviciosNuevos.filter((id: number) => idsActuales.includes(id))

        if (serviciosDuplicados.length > 0) {
            return NextResponse.json(
                { error: "Algunos servicios ya están incluidos en el contrato" },
                { status: 400 }
            )
        }

        // 4. Insertar los nuevos servicios en contrato_servicio
        const serviciosInsert = serviciosNuevos.map((idServicio: number) => ({
            id_contrato: idContrato,
            id_servicio: idServicio
        }))

        const { error: insertError } = await supabase
            .from('contrato_servicio')
            .insert(serviciosInsert)

        if (insertError) {
            console.error("Error al agregar servicios:", insertError)
            return NextResponse.json(
                { error: "Error al agregar servicios al contrato" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Contrato ampliado exitosamente",
            serviciosAgregados: serviciosNuevos.length
        })

    } catch (error) {
        console.error("Error en ampliar contrato:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
