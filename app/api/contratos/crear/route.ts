import { createClient } from "@/lib/supabaseServer"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // 1. Verificar autenticación
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        }

        // 2. Obtener datos del request
        const { tipoCobro, duracionMeses, serviciosSeleccionados, descuento, fechaFinContrato } =
            await request.json()

        // 3. Validaciones
        if (!serviciosSeleccionados?.length) {
            return NextResponse.json(
                { error: "Debe seleccionar al menos un servicio" },
                { status: 400 }
            )
        }

        if (![3, 6, 12].includes(duracionMeses)) {
            return NextResponse.json(
                { error: "Duración de contrato inválida" },
                { status: 400 }
            )
        }

        const idCuentaComercio = user.user_metadata.idCuentaComercio
        if (!idCuentaComercio) {
            return NextResponse.json(
                { error: "Usuario sin cuenta comercio asociada" },
                { status: 400 }
            )
        }

        // 4. Obtener comercio
        const { data: comercio, error: comercioError } = await supabase
            .from("comercio")
            .select("id_comercio")
            .eq("id_cuenta_comercio", idCuentaComercio)
            .single()

        if (comercioError || !comercio) {
            return NextResponse.json(
                { error: "No se encontró el comercio asociado a esta cuenta" },
                { status: 404 }
            )
        }

        // 5. Crear el contrato
        const { data: contrato, error: contratoError } = await supabase
            .from("contrato")
            .insert({
                tipo_cobro: tipoCobro,
                descuento: descuento,
                duracion_contrato_meses: duracionMeses,
                estado_contrato: "vigente",
                fecha_fin_contrato: fechaFinContrato,
            })
            .select()
            .single()

        if (contratoError) {
            console.error("Error al crear contrato:", contratoError)
            return NextResponse.json(
                { error: "Error al crear el contrato: " + contratoError.message },
                { status: 500 }
            )
        }

        // 6. Insertar servicios del contrato
        const contratoServicios = serviciosSeleccionados.map((idServicio: number) => ({
            id_contrato: contrato.id_contrato,
            id_servicio: idServicio,
        }))

        const { error: serviciosError } = await supabase
            .from("contrato_servicio")
            .insert(contratoServicios)

        if (serviciosError) {
            console.error("Error al asociar servicios:", serviciosError)
            // Rollback: eliminar el contrato creado
            await supabase
                .from("contrato")
                .delete()
                .eq("id_contrato", contrato.id_contrato)

            return NextResponse.json(
                { error: "Error al asociar servicios: " + serviciosError.message },
                { status: 500 }
            )
        }

        // 7. Actualizar comercio con el id_contrato y habilitar el estado
        const { error: updateComercioError } = await supabase
            .from("comercio")
            .update({
                id_contrato: contrato.id_contrato,
                estado_comercio: "habilitado",
            })
            .eq("id_comercio", comercio.id_comercio)

        if (updateComercioError) {
            console.error("Error al actualizar comercio:", updateComercioError)
            // Rollback: eliminar servicios asociados y el contrato creado
            await supabase
                .from("contrato_servicio")
                .delete()
                .eq("id_contrato", contrato.id_contrato)

            await supabase
                .from("contrato")
                .delete()
                .eq("id_contrato", contrato.id_contrato)

            return NextResponse.json(
                { error: "Error al vincular el contrato al comercio: " + updateComercioError.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                contrato: {
                    id_contrato: contrato.id_contrato,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error inesperado:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
