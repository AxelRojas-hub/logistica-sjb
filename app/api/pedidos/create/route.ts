import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

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


        const pedidoData = {
            id_comercio: orderData.idComercio,
            id_sucursal_destino: orderData.idSucursalDestino,
            dni_cliente: orderData.dniCliente,
            estado_pedido: 'en_preparacion',
            precio: 0,
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