import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { calcularPrecioPedido } from "@/lib/models/Pedido"
import { calcularDistanciaEntreSucursales } from "@/lib/models/Ruta"

interface CreatePedidoRequest {
    // Datos del destinatario
    dniCliente: number
    nombreCliente: string
    telefonoCliente: string
    emailCliente: string
    direccionCliente: string
    
    // Datos del pedido
    idComercio: number
    idSucursalDestino: number
    peso: number
    fechaLimiteEntrega: string
    
    // Servicios
    tipoTransporte: number | null
    serviciosOpcionales: number[]
}

export async function POST(request: NextRequest) {
    try {
        const orderData: CreatePedidoRequest = await request.json()
    const supabase = await createClient()

        if (!orderData.dniCliente || !orderData.nombreCliente || !orderData.idSucursalDestino) {
            return NextResponse.json(
                { success: false, message: "Todos los campos obligatorios son requeridos" },
                { status: 400 }
            )
        }

        const clienteData = {
            dni_cliente: orderData.dniCliente,
            telefono_cliente: orderData.telefonoCliente,
            nombre_cliente: orderData.nombreCliente,
            direccion_cliente: orderData.direccionCliente,
            email_cliente: orderData.emailCliente
        }

        const { error: clienteError } = await supabase
            .from('cliente_destinatario')
            .upsert(clienteData, { 
                onConflict: 'dni_cliente',
                ignoreDuplicates: false 
            })

        if (clienteError) {
            return NextResponse.json(
                { success: false, message: "Error al guardar datos del cliente" },
                { status: 500 }
            )
        }


        const { data: comercioData, error: comercioError } = await supabase
            .from('comercio')
            .select('id_sucursal_origen')
            .eq('id_comercio', orderData.idComercio)
            .single()

        if (comercioError || !comercioData) {
            return NextResponse.json(
                { success: false, message: "Error al obtener datos del comercio" },
                { status: 500 }
            )
        }

        const serviciosIds = [orderData.tipoTransporte, ...orderData.serviciosOpcionales].filter(Boolean) as number[]
        const { data: servicios, error: serviciosError } = await supabase
            .from('servicio')
            .select('id_servicio, costo_servicio')
            .in('id_servicio', serviciosIds)

        if (serviciosError || !servicios) {
            return NextResponse.json(
                { success: false, message: "Error al obtener servicios" },
                { status: 500 }
            )
        }

        const servicioTransporte = servicios.find(s => s.id_servicio === orderData.tipoTransporte)
        const serviciosAdicionales = servicios.filter(s => s.id_servicio !== orderData.tipoTransporte)

        if (!servicioTransporte) {
            return NextResponse.json(
                { success: false, message: "Servicio de transporte no encontrado" },
                { status: 400 }
            )
        }


        const distanciaKm = await calcularDistanciaEntreSucursales(
            supabase,
            comercioData.id_sucursal_origen,
            orderData.idSucursalDestino
        )

        // Calcular precio total
        const calculoPrecio = await calcularPrecioPedido(supabase, {
            idComercio: orderData.idComercio,
            costoBaseTransporte: servicioTransporte.costo_servicio,
            costosServiciosAdicionales: serviciosAdicionales.map(s => s.costo_servicio),
            distanciaKm,
            peso: orderData.peso
        })

        const pedidoData = {
            id_comercio: orderData.idComercio,
            id_sucursal_destino: orderData.idSucursalDestino,
            dni_cliente: orderData.dniCliente,
            estado_pedido: 'en_preparacion',
            precio: calculoPrecio.precioFinal,
            fecha_limite_entrega: orderData.fechaLimiteEntrega
        }

        const { data: pedidoResult, error: pedidoError } = await supabase
            .from('pedido')
            .insert(pedidoData)
            .select('id_pedido')
            .single()

        if (pedidoError || !pedidoResult) {
            return NextResponse.json(
                { success: false, message: "Error al guardar el pedido" },
                { status: 500 }
            )
        }

        const idPedidoCreado = pedidoResult.id_pedido

        const serviciosData = []
        if (orderData.tipoTransporte) {
            serviciosData.push({
                id_pedido: idPedidoCreado,
                id_servicio: orderData.tipoTransporte
            })
        }


        if (orderData.serviciosOpcionales && orderData.serviciosOpcionales.length > 0) {
            orderData.serviciosOpcionales.forEach((servicioId: number) => {
                serviciosData.push({
                    id_pedido: idPedidoCreado,
                    id_servicio: servicioId
                })
            })
        }

        if (serviciosData.length > 0) {
            const { error: serviciosError } = await supabase
                .from('pedido_servicio')
                .insert(serviciosData)

            if (serviciosError) {
                return NextResponse.json(
                    { success: false, message: "Error al guardar servicios del pedido" },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json({
            success: true,
            message: "Pedido creado exitosamente",
            data: {
                pedidoId: idPedidoCreado,
                precio: calculoPrecio.precioFinal,
                cliente: clienteData,
                pedido: pedidoData,
                servicios: serviciosData
            }
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : "Error desconocido"
        }, { status: 500 })
    }
}