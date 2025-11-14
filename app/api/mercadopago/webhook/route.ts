import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@/lib/supabaseServer'
import { mercadoPagoConfig } from '@/lib/mercadoPagoConfig'
import { revalidatePath } from 'next/cache'

// Inicializar cliente de MercadoPago
const client = new MercadoPagoConfig({
    accessToken: mercadoPagoConfig.accessToken!
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Verificar que sea una notificación de pago
        if (body.type !== 'payment') {
            return NextResponse.json({ message: 'Notification type not supported' }, { status: 200 })
        }

        const paymentId = body.data?.id
        if (!paymentId) {
            return NextResponse.json({ message: 'Payment ID not found' }, { status: 400 })
        }

        // Obtener información del pago desde MercadoPago
        const payment = new Payment(client)
        const paymentInfo = await payment.get({ id: paymentId })

        if (!paymentInfo) {
            return NextResponse.json({ message: 'Payment not found' }, { status: 404 })
        }

        // Extraer ID de factura del external_reference
        const externalReference = paymentInfo.external_reference
        if (!externalReference || !externalReference.startsWith('factura_')) {
            return NextResponse.json({ message: 'Invalid external reference' }, { status: 400 })
        }

        const facturaId = parseInt(externalReference.replace('factura_', ''))
        if (isNaN(facturaId)) {
            return NextResponse.json({ message: 'Invalid factura ID' }, { status: 400 })
        }

        // Actualizar estado de la factura en la base de datos
        const supabase = await createClient()

        let estadoPago: 'pagado' | 'pendiente' | 'vencido' = 'pendiente'
        let fechaPago: string | null = null
        let nroPago: string | null = null

        switch (paymentInfo.status) {
            case 'approved':
                estadoPago = 'pagado'
                fechaPago = paymentInfo.date_approved || new Date().toISOString()
                nroPago = paymentInfo.id?.toString() || null
                break
            case 'rejected':
            case 'cancelled':
                estadoPago = 'pendiente'
                break
            case 'pending':
            case 'in_process':
            case 'in_mediation':
            case 'charged_back':
                estadoPago = 'pendiente'
                break
            default:
                estadoPago = 'pendiente'
        }

        const { error } = await supabase
            .from('factura')
            .update({
                estado_pago: estadoPago,
                fecha_pago: fechaPago,
                nro_pago: nroPago
            })
            .eq('id_factura', facturaId)

        if (error) {
            console.error('Error updating factura:', error)
            return NextResponse.json({ message: 'Database update failed' }, { status: 500 })
        }

        console.log(`Factura ${facturaId} actualizada - Estado: ${estadoPago}, Pago ID: ${paymentId}`)

        revalidatePath('/comercio/facturas')
        return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 })

    } catch (error) {
        console.error('Error processing MercadoPago webhook:', error)
        return NextResponse.json(
            {
                message: 'Webhook processing failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Permitir solo POST
export async function GET() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}