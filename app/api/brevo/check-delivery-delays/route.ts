import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"
import { BrevoService } from "@/lib/services/brevoService"

// API endpoint que se ejecuta diariamente a las 9:00 AM para verificar retrasos
export async function GET() {
    try {
        const supabase = await createClient()
        const now = new Date()

        // Buscar pedidos que están en camino o en sucursal y han pasado su fecha límite
        const { data: overdueOrders, error } = await supabase
            .from('pedido')
            .select(`
                id_pedido,
                fecha_limite_entrega,
                cliente_destinatario!inner(
                    nombre_cliente,
                    email_cliente
                )
            `)
            .in('estado_pedido', ['en_camino', 'en_sucursal'])
            .not('fecha_limite_entrega', 'is', null)
            .lt('fecha_limite_entrega', now.toISOString())

        if (error) {
            console.error('Error fetching overdue orders:', error)
            return NextResponse.json(
                { error: 'Error fetching overdue orders' },
                { status: 500 }
            )
        }

        const results = []
        const processedOrders = overdueOrders || []

        for (const order of processedOrders) {
            const clientData = (Array.isArray(order.cliente_destinatario)
                ? order.cliente_destinatario[0]
                : order.cliente_destinatario) as {
                    nombre_cliente: string
                    email_cliente: string | null
                }

            // Solo procesar si el cliente tiene email
            if (!clientData.email_cliente) {
                continue
            }

            // Calcular días de retraso
            const fechaLimite = new Date(order.fecha_limite_entrega)
            const daysLate = Math.ceil((now.getTime() - fechaLimite.getTime()) / (1000 * 60 * 60 * 24))

            try {
                const result = await BrevoService.notifyDeliveryDelay(order.id_pedido, daysLate)
                results.push({
                    orderId: order.id_pedido,
                    daysLate,
                    clientEmail: clientData.email_cliente,
                    emailSent: result.success
                })
            } catch (emailError) {
                console.error(`Error sending delay notification for order ${order.id_pedido}:`, emailError)
                results.push({
                    orderId: order.id_pedido,
                    daysLate,
                    clientEmail: clientData.email_cliente,
                    emailSent: false,
                    error: emailError
                })
            }
        }

        console.log(`Delivery delay check completed. Processed ${results.length} overdue orders.`)

        return NextResponse.json({
            success: true,
            timestamp: now.toISOString(),
            totalOverdueOrders: processedOrders.length,
            emailsSent: results.filter(r => r.emailSent).length,
            results
        })

    } catch (error) {
        console.error('Error in delivery delay checker:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
