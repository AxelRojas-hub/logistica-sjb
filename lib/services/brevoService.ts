import { SendSmtpEmail } from '@getbrevo/brevo'
import { transactionalEmailsApi, BREVO_CONFIG } from '../brevoConfig'
import { EmailTemplates } from '../brevoTemplates'
import { createClient } from '../supabaseServer'

interface EmailRecipient {
    email: string
    name: string
}

interface OrderData {
    idPedido: number
    nombreCliente: string
    emailCliente: string | null
    direccionCliente: string
    fechaEntrega?: string | null
    fechaLimiteEntrega?: string | null
}

interface InvoiceData {
    nroFactura: string
    nombreComercio: string
    emailComercio: string
    importeTotal: number
    fechaEmision: string
}

async function sendEmail(recipient: EmailRecipient, subject: string, htmlContent: string) {
    try {
        const message = new SendSmtpEmail()
        message.subject = subject
        message.htmlContent = htmlContent
        message.sender = {
            email: BREVO_CONFIG.senderEmail,
            name: BREVO_CONFIG.senderName
        }
        message.to = [
            {
                email: recipient.email,
                name: recipient.name
            }
        ]

        const response = await transactionalEmailsApi.sendTransacEmail(message)

        console.log(`Email sent successfully to ${recipient.email}:`, response.body)
        return { success: true, messageId: response.body.messageId }
    } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error)
        return { success: false, error }
    }
}

export const BrevoService = {
    // Notificar cuando un pedido es despachado (en_camino)
    async notifyOrderDispatched(orderId: number) {
        try {
            const supabase = await createClient()
            const { data: orderData, error } = await supabase
                .from('pedido')
                .select(`
          id_pedido,
          cliente_destinatario!inner(
            nombre_cliente,
            email_cliente,
            direccion_cliente
          )
        `)
                .eq('id_pedido', orderId)
                .single()

            if (error || !orderData) {
                console.error('Order not found:', orderId)
                return { success: false, error: 'Order not found' }
            }

            const clientData = (Array.isArray(orderData.cliente_destinatario)
                ? orderData.cliente_destinatario[0]
                : orderData.cliente_destinatario) as {
                    nombre_cliente: string
                    email_cliente: string | null
                    direccion_cliente: string
                }
            if (!clientData.email_cliente) {
                console.log('No email found for client in order:', orderId)
                return { success: false, error: 'No client email' }
            }

            const recipient: EmailRecipient = {
                email: clientData.email_cliente,
                name: clientData.nombre_cliente
            }

            const htmlContent = EmailTemplates.orderDispatched({
                idPedido: orderData.id_pedido,
                nombreCliente: clientData.nombre_cliente,
                direccionCliente: clientData.direccion_cliente
            })

            return await sendEmail(recipient, 'Su pedido está en camino - Logística SJB', htmlContent)
        } catch (error) {
            console.error('Error notifying order dispatched:', error)
            return { success: false, error }
        }
    },

    // Notificar cuando un pedido es entregado
    async notifyOrderDelivered(orderId: number) {
        try {
            const supabase = await createClient()
            const { data: orderData, error } = await supabase
                .from('pedido')
                .select(`
          id_pedido,
          fecha_entrega,
          cliente_destinatario!inner(
            nombre_cliente,
            email_cliente
          )
        `)
                .eq('id_pedido', orderId)
                .single()

            if (error || !orderData) {
                console.error('Order not found:', orderId)
                return { success: false, error: 'Order not found' }
            }

            const clientData = (Array.isArray(orderData.cliente_destinatario)
                ? orderData.cliente_destinatario[0]
                : orderData.cliente_destinatario) as {
                    nombre_cliente: string
                    email_cliente: string | null
                }
            if (!clientData.email_cliente) {
                console.log('No email found for client in order:', orderId)
                return { success: false, error: 'No client email' }
            }

            const recipient: EmailRecipient = {
                email: clientData.email_cliente,
                name: clientData.nombre_cliente
            }

            const htmlContent = EmailTemplates.orderDelivered({
                idPedido: orderData.id_pedido,
                nombreCliente: clientData.nombre_cliente,
                fechaEntrega: orderData.fecha_entrega || new Date().toISOString()
            })

            return await sendEmail(recipient, '¡Pedido entregado! - Logística SJB', htmlContent)
        } catch (error) {
            console.error('Error notifying order delivered:', error)
            return { success: false, error }
        }
    },

    // Notificar retraso en la entrega
    async notifyDeliveryDelay(orderId: number, daysLate: number) {
        try {
            const supabase = await createClient()
            const { data: orderData, error } = await supabase
                .from('pedido')
                .select(`
          id_pedido,
          fecha_limite_entrega,
          cliente_destinatario!inner(
            nombre_cliente,
            email_cliente
          )
        `)
                .eq('id_pedido', orderId)
                .single()

            if (error || !orderData) {
                console.error('Order not found:', orderId)
                return { success: false, error: 'Order not found' }
            }

            const clientData = (Array.isArray(orderData.cliente_destinatario)
                ? orderData.cliente_destinatario[0]
                : orderData.cliente_destinatario) as {
                    nombre_cliente: string
                    email_cliente: string | null
                }
            if (!clientData.email_cliente) {
                console.log('No email found for client in order:', orderId)
                return { success: false, error: 'No client email' }
            }

            const recipient: EmailRecipient = {
                email: clientData.email_cliente,
                name: clientData.nombre_cliente
            }

            const htmlContent = EmailTemplates.deliveryDelay({
                idPedido: orderData.id_pedido,
                nombreCliente: clientData.nombre_cliente,
                fechaLimite: orderData.fecha_limite_entrega || '',
                diasRetraso: daysLate
            })

            return await sendEmail(recipient, 'Retraso en su pedido - Logística SJB', htmlContent)
        } catch (error) {
            console.error('Error notifying delivery delay:', error)
            return { success: false, error }
        }
    },

    // Notificar nueva factura generada  
    async notifyInvoiceGenerated(invoiceId: number) {
        try {
            const supabase = await createClient()
            const { data: invoiceData, error } = await supabase
                .from('factura')
                .select(`
          nro_factura,
          importe_total,
          fecha_emision,
          comercio!inner(
            nombre_comercio,
            cuenta_comercio!inner(
              email_comercio,
              nombre_responsable
            )
          )
        `)
                .eq('id_factura', invoiceId)
                .single()

            if (error || !invoiceData) {
                console.error('Invoice not found:', invoiceId)
                return { success: false, error: 'Invoice not found' }
            }

            const comercioData = (Array.isArray(invoiceData.comercio)
                ? invoiceData.comercio[0]
                : invoiceData.comercio) as {
                    nombre_comercio: string
                    cuenta_comercio: {
                        email_comercio: string
                        nombre_responsable: string
                    }[]
                }
            const cuentaData = Array.isArray(comercioData.cuenta_comercio)
                ? comercioData.cuenta_comercio[0]
                : comercioData.cuenta_comercio

            const recipient: EmailRecipient = {
                email: cuentaData.email_comercio,
                name: cuentaData.nombre_responsable
            }

            // Calcular fecha de vencimiento (30 días desde emisión)
            const fechaVencimiento = new Date(invoiceData.fecha_emision)
            fechaVencimiento.setDate(fechaVencimiento.getDate() + 30)

            const htmlContent = EmailTemplates.invoiceGenerated({
                nroFactura: invoiceData.nro_factura,
                nombreComercio: comercioData.nombre_comercio,
                importeTotal: invoiceData.importe_total,
                fechaVencimiento: fechaVencimiento.toISOString()
            })

            return await sendEmail(recipient, `Nueva factura ${invoiceData.nro_factura} - Logística SJB`, htmlContent)
        } catch (error) {
            console.error('Error notifying invoice generated:', error)
            return { success: false, error }
        }
    },

    // Recordatorio de pago vencido
    async notifyPaymentOverdue(invoiceId: number, daysOverdue: number) {
        try {
            const supabase = await createClient()
            const { data: invoiceData, error } = await supabase
                .from('factura')
                .select(`
          nro_factura,
          importe_total,
          comercio!inner(
            nombre_comercio,
            cuenta_comercio!inner(
              email_comercio,
              nombre_responsable
            )
          )
        `)
                .eq('id_factura', invoiceId)
                .single()

            if (error || !invoiceData) {
                console.error('Invoice not found:', invoiceId)
                return { success: false, error: 'Invoice not found' }
            }

            const comercioData = (Array.isArray(invoiceData.comercio)
                ? invoiceData.comercio[0]
                : invoiceData.comercio) as {
                    nombre_comercio: string
                    cuenta_comercio: {
                        email_comercio: string
                        nombre_responsable: string
                    }[]
                }
            const cuentaData = Array.isArray(comercioData.cuenta_comercio)
                ? comercioData.cuenta_comercio[0]
                : comercioData.cuenta_comercio

            const recipient: EmailRecipient = {
                email: cuentaData.email_comercio,
                name: cuentaData.nombre_responsable
            }

            const htmlContent = EmailTemplates.paymentReminder({
                nroFactura: invoiceData.nro_factura,
                nombreComercio: comercioData.nombre_comercio,
                importeTotal: invoiceData.importe_total,
                diasVencido: daysOverdue
            })

            return await sendEmail(recipient, `Pago vencido - Factura ${invoiceData.nro_factura} - Logística SJB`, htmlContent)
        } catch (error) {
            console.error('Error notifying payment overdue:', error)
            return { success: false, error }
        }
    }
}