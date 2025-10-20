import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {
            email,
            password,
            nombreResponsable,
            nombreComercio,
            domicilioFiscal,
            idSucursal,
        } = await req.json();

        // Validaciones
        if (
            !email ||
            !password ||
            !nombreResponsable ||
            !nombreComercio ||
            !domicilioFiscal ||
            !idSucursal
        ) {
            return NextResponse.json(
                { ok: false, error: "Todos los campos son requeridos" },
                { status: 400 }
            );
        }

        // 1. Crear registro en cuenta_comercio primero
        const { data: cuentaComercioData, error: cuentaComercioError } = await supabaseAdmin
            .from("cuenta_comercio")
            .insert({
                email_comercio: email,
                nombre_responsable: nombreResponsable,
                contrasena_comercio: password, // Almacenamos la contraseña temporalmente, 
                //TODO: Si se va a almacenar, hashearla o eliminar la columna directamente
            })
            .select("id_cuenta_comercio")
            .single();

        if (cuentaComercioError || !cuentaComercioData) {
            console.error("Cuenta comercio error:", cuentaComercioError);
            return NextResponse.json(
                { ok: false, error: cuentaComercioError?.message || "Error al crear la cuenta de comercio" },
                { status: 400 }
            );
        }

        // 2. Crear usuario en Supabase Auth con todos los metadatos (incluyendo id_cuenta_comercio)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                rol: "comercio",
                nombreComercio,
                idCuentaComercio: cuentaComercioData.id_cuenta_comercio,
                idSucursalOrigen: idSucursal,
            },
        });

        if (authError || !authData.user) {
            console.error("Auth error:", authError);
            // Limpiar cuenta_comercio
            await supabaseAdmin.from("cuenta_comercio").delete().eq("id_cuenta_comercio", cuentaComercioData.id_cuenta_comercio);
            return NextResponse.json(
                { ok: false, error: authError?.message || "Error al crear el usuario de autenticación" },
                { status: 400 }
            );
        }

        // 3. Crear contrato (estado suspendido por defecto)
        const { data: contratoData, error: contratoError } = await supabaseAdmin
            .from("contrato")
            .insert({
                tipo_cobro: "credito",
                descuento: 0,
                estado_contrato: "suspendido",
                duracion_contrato_meses: 3,
            })
            .select("id_contrato")
            .single();

        if (contratoError || !contratoData) {
            console.error("Contrato error:", contratoError);
            // Limpiar
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            await supabaseAdmin.from("cuenta_comercio").delete().eq("id_cuenta_comercio", cuentaComercioData.id_cuenta_comercio);
            return NextResponse.json(
                { ok: false, error: contratoError?.message || "Error al crear el contrato" },
                { status: 400 }
            );
        }

        // 4. Crear registro en comercio (estado deshabilitado por defecto)
        const { data: comercioData, error: comercioError } = await supabaseAdmin
            .from("comercio")
            .insert({
                id_cuenta_comercio: cuentaComercioData.id_cuenta_comercio,
                id_contrato: contratoData.id_contrato,
                id_sucursal_origen: idSucursal,
                nombre_comercio: nombreComercio,
                domicilio_fiscal: domicilioFiscal,
                estado_comercio: "deshabilitado",
            })
            .select("id_comercio")
            .single();

        if (comercioError) {
            console.error("Comercio error:", comercioError);
            // Limpiar
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            await supabaseAdmin.from("cuenta_comercio").delete().eq("id_cuenta_comercio", cuentaComercioData.id_cuenta_comercio);
            await supabaseAdmin.from("contrato").delete().eq("id_contrato", contratoData.id_contrato);
            return NextResponse.json(
                { ok: false, error: comercioError.message || "Error al crear el comercio" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            ok: true,
            message: "Cuenta registrada exitosamente. Contrato en estado suspendido y comercio deshabilitado.",
            idComercio: comercioData?.id_comercio,
        });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { ok: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
