import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { BrevoService } from "@/lib/services/brevoService"

// API endpoint que se ejecuta semanalmente los lunes para verificar pagos vencidos
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const now = new Date()

        // Buscar facturas vencidas (estado 'vencido' o 'pendiente' con más de 30 días)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: overdueInvoices, error } = await supabase
            .from('factura')
            .select(`
                id_factura,
                nro_factura,
                importe_total,
                fecha_emision,
                estado_pago,
                comercio!inner(
                    nombre_comercio,
                    cuenta_comercio!inner(
                        email_comercio,
                        nombre_responsable
                    )
                )
            `)
            .or('estado_pago.eq.vencido,and(estado_pago.eq.pendiente,fecha_emision.lt.' + thirtyDaysAgo.toISOString() + ')')

        if (error) {
            console.error('Error fetching overdue invoices:', error)
            return NextResponse.json(
                { error: 'Error fetching overdue invoices' },
                { status: 500 }
            )
        }

        const results = []
        const processedInvoices = overdueInvoices || []

        for (const invoice of processedInvoices) {
            const comercioData = (Array.isArray(invoice.comercio)
                ? invoice.comercio[0]
                : invoice.comercio) as {
                    nombre_comercio: string
                    cuenta_comercio: Array<{
                        email_comercio: string
                        nombre_responsable: string
                    }>
                }
            const cuentaData = (Array.isArray(comercioData.cuenta_comercio)
                ? comercioData.cuenta_comercio[0]
                : comercioData.cuenta_comercio) as {
                    email_comercio: string
                    nombre_responsable: string
                }

            // Calcular días de vencimiento
            const fechaEmision = new Date(invoice.fecha_emision)
            const fechaVencimiento = new Date(fechaEmision)
            fechaVencimiento.setDate(fechaVencimiento.getDate() + 30) // Asumimos 30 días de plazo

            const daysOverdue = Math.ceil((now.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24))

            // Solo procesar facturas que realmente están vencidas
            if (daysOverdue <= 0) {
                continue
            }

            try {
                const result = await BrevoService.notifyPaymentOverdue(invoice.id_factura, daysOverdue)
                results.push({
                    invoiceId: invoice.id_factura,
                    invoiceNumber: invoice.nro_factura,
                    amount: invoice.importe_total,
                    daysOverdue,
                    commerceEmail: cuentaData.email_comercio,
                    emailSent: result.success
                })
            } catch (emailError) {
                console.error(`Error sending payment reminder for invoice ${invoice.id_factura}:`, emailError)
                results.push({
                    invoiceId: invoice.id_factura,
                    invoiceNumber: invoice.nro_factura,
                    amount: invoice.importe_total,
                    daysOverdue,
                    commerceEmail: cuentaData.email_comercio,
                    emailSent: false,
                    error: emailError
                })
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            totalOverdueInvoices: processedInvoices.length,
            emailsSent: results.filter(r => r.emailSent).length,
            results
        })

    } catch (error) {
        console.error('Error in payment overdue checker:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
