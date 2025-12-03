import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { BrevoService } from '@/lib/services/brevoService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0]

        console.log(`[Cron] Checking invoices for date: ${today}`)

        // Buscar facturas cuya fecha_fin coincida con hoy
        const { data: facturas, error } = await supabaseAdmin
            .from('factura')
            .select('*')
            .eq('fecha_fin', today)

        if (error) {
            console.error('[Cron] Error fetching invoices:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!facturas || facturas.length === 0) {
            console.log('[Cron] No invoices found for today')
            return NextResponse.json({ message: 'No invoices to process for today' })
        }

        console.log(`[Cron] Found ${facturas.length} invoices to process`)

        const results = []

        for (const factura of facturas) {
            // Actualizar fecha de emisión a hoy
            const { error: updateError } = await supabaseAdmin
                .from('factura')
                .update({ fecha_emision: today })
                .eq('id_factura', factura.id_factura)

            if (updateError) {
                console.error(`[Cron] Error updating invoice ${factura.id_factura}:`, updateError)
                results.push({ id: factura.id_factura, status: 'error', error: updateError.message })
                continue
            }

            // Notificar al comercio usando supabaseAdmin para evitar problemas de auth
            const notificationResult = await BrevoService.notifyInvoiceGenerated(factura.id_factura, supabaseAdmin)
            
            results.push({ 
                id: factura.id_factura, 
                status: notificationResult.success ? 'success' : 'failed',
                notification: notificationResult 
            })
        }

        return NextResponse.json({ 
            message: `Processed ${facturas.length} invoices`,
            results 
        })

    } catch (error) {
        console.error('[Cron] Internal server error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
