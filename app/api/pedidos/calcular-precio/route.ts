import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { calcularPrecioPedido } from "@/lib/models/Pedido"
import { calcularDistanciaEntreSucursales } from "@/lib/models/Ruta"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            )
        }

        const idCuentaComercio = user.user_metadata?.idCuentaComercio
        if (!idCuentaComercio) {
            return NextResponse.json(
                { error: "Usuario no asociado a un comercio" },
                { status: 400 }
            )
        }

        const { data: comercioData, error: comercioError } = await supabase
            .from("comercio")
            .select("id_comercio, id_sucursal_origen")
            .eq("id_cuenta_comercio", idCuentaComercio)
            .single()

        if (comercioError || !comercioData) {
            return NextResponse.json(
                { error: "Comercio no encontrado" },
                { status: 404 }
            )
        }

        const idComercio = comercioData.id_comercio
        const idSucursalOrigen = comercioData.id_sucursal_origen

        const body = await request.json()
        const { 
            idSucursalDestino, 
            peso, 
            idServicioTransporte,
            idsServiciosAdicionales 
        } = body

        
        if (!idSucursalDestino || !peso || !idServicioTransporte) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        const { data: servicios, error: serviciosError } = await supabase
            .from("servicio")
            .select("id_servicio, costo_servicio")
            .in("id_servicio", [idServicioTransporte, ...(idsServiciosAdicionales || [])])

        if (serviciosError || !servicios) {
            return NextResponse.json(
                { error: "Error al obtener servicios" },
                { status: 500 }
            )
        }


        const servicioTransporte = servicios.find(s => s.id_servicio === idServicioTransporte)
        const serviciosAdicionales = servicios.filter(s => s.id_servicio !== idServicioTransporte)

        if (!servicioTransporte) {
            return NextResponse.json(
                { error: "Servicio de transporte no encontrado" },
                { status: 404 }
            )
        }

        const distanciaKm = await calcularDistanciaEntreSucursales(
            supabase,
            idSucursalOrigen,
            idSucursalDestino
        )

        const calculoPrecio = await calcularPrecioPedido(supabase, {
            idComercio,
            costoBaseTransporte: servicioTransporte.costo_servicio,
            costosServiciosAdicionales: serviciosAdicionales.map(s => s.costo_servicio),
            distanciaKm,
            peso: Number(peso)
        })

        return NextResponse.json({
            precio: calculoPrecio.precioFinal,
            precioSinDescuento: calculoPrecio.precioSinDescuento,
            descuentoPorcentaje: calculoPrecio.descuentoPorcentaje,
            desglose: {
                costoBaseTransporte: servicioTransporte.costo_servicio,
                costosServiciosAdicionales: serviciosAdicionales.map(s => s.costo_servicio),
                distanciaKm,
                peso: Number(peso)
            }
        })

    } catch (error) {
        console.error("Error al calcular precio:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
