import { NextRequest, NextResponse } from "next/server"
import { BrevoService } from "@/lib/services/brevoService"

// Endpoint de prueba para enviar emails manualmente
export async function POST(request: NextRequest) {
    try {
        const { action, idPedido, idFactura, daysOverdue } = await request.json()

        if (!action) {
            return NextResponse.json(
                { error: "action es requerido" },
                { status: 400 }
            )
        }

        let result

        switch (action) {
            case 'order-dispatched':
                if (!idPedido) {
                    return NextResponse.json({ error: "idPedido requerido" }, { status: 400 })
                }
                result = await BrevoService.notifyOrderDispatched(idPedido)
                break

            case 'order-delivered':
                if (!idPedido) {
                    return NextResponse.json({ error: "idPedido requerido" }, { status: 400 })
                }
                result = await BrevoService.notifyOrderDelivered(idPedido)
                break

            case 'delivery-delay':
                if (!idPedido || daysOverdue === undefined) {
                    return NextResponse.json({ error: "idPedido y daysOverdue requeridos" }, { status: 400 })
                }
                result = await BrevoService.notifyDeliveryDelay(idPedido, daysOverdue)
                break

            case 'invoice-generated':
                if (!idFactura) {
                    return NextResponse.json({ error: "idFactura requerido" }, { status: 400 })
                }
                result = await BrevoService.notifyInvoiceGenerated(idFactura)
                break

            case 'payment-overdue':
                if (!idFactura || daysOverdue === undefined) {
                    return NextResponse.json({ error: "idFactura y daysOverdue requeridos" }, { status: 400 })
                }
                result = await BrevoService.notifyPaymentOverdue(idFactura, daysOverdue)
                break

            default:
                return NextResponse.json({ error: "action inválido" }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            action,
            result
        })

    } catch (error) {
        console.error('Error en test email:', error)
        return NextResponse.json(
            { error: "Error interno del servidor", details: error },
            { status: 500 }
        )
    }
}
