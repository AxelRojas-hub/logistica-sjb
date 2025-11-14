import { NextRequest, NextResponse } from "next/server"
import { SendSmtpEmail } from '@getbrevo/brevo'
import { transactionalEmailsApi, BREVO_CONFIG } from "@/lib/brevoConfig"
import { EmailTemplates } from "@/lib/brevoTemplates"

// Endpoint para pruebas rápidas con email específico
export async function POST(request: NextRequest) {
    try {
        const { emailType, testEmail = "axelkevinagustinrojas@gmail.com" } = await request.json()

        if (!emailType) {
            return NextResponse.json(
                { error: "emailType es requerido (order-dispatched, order-delivered, etc)" },
                { status: 400 }
            )
        }

        let subject = ""
        let htmlContent = ""

        // Datos de prueba
        const testOrderData = {
            idPedido: 12345,
            nombreCliente: "Cliente Test",
            direccionCliente: "Calle Prueba 123, CABA",
            fechaLimite: new Date().toISOString(),
            diasRetraso: 2,
            fechaEntrega: new Date().toISOString()
        }

        const testInvoiceData = {
            nroFactura: "FAC-2025-001",
            nombreComercio: "Comercio Test",
            importeTotal: 15000,
            diasVencido: 5,
            fechaVencimiento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }

        switch (emailType) {
            case 'order-dispatched':
                subject = 'Su pedido está en camino - Logística SJB'
                htmlContent = EmailTemplates.orderDispatched({
                    idPedido: testOrderData.idPedido,
                    nombreCliente: testOrderData.nombreCliente,
                    direccionCliente: testOrderData.direccionCliente
                })
                break

            case 'order-delivered':
                subject = '¡Pedido entregado! - Logística SJB'
                htmlContent = EmailTemplates.orderDelivered({
                    idPedido: testOrderData.idPedido,
                    nombreCliente: testOrderData.nombreCliente,
                    fechaEntrega: testOrderData.fechaEntrega
                })
                break

            case 'delivery-delay':
                subject = 'Retraso en su pedido - Logística SJB'
                htmlContent = EmailTemplates.deliveryDelay({
                    idPedido: testOrderData.idPedido,
                    nombreCliente: testOrderData.nombreCliente,
                    fechaLimite: testOrderData.fechaLimite,
                    diasRetraso: testOrderData.diasRetraso
                })
                break

            case 'invoice-generated':
                subject = `Nueva factura ${testInvoiceData.nroFactura} - Logística SJB`
                htmlContent = EmailTemplates.invoiceGenerated({
                    nroFactura: testInvoiceData.nroFactura,
                    nombreComercio: testInvoiceData.nombreComercio,
                    importeTotal: testInvoiceData.importeTotal,
                    fechaVencimiento: testInvoiceData.fechaVencimiento
                })
                break

            case 'payment-overdue':
                subject = `Pago vencido - Factura ${testInvoiceData.nroFactura} - Logística SJB`
                htmlContent = EmailTemplates.paymentReminder({
                    nroFactura: testInvoiceData.nroFactura,
                    nombreComercio: testInvoiceData.nombreComercio,
                    importeTotal: testInvoiceData.importeTotal,
                    diasVencido: testInvoiceData.diasVencido
                })
                break

            default:
                return NextResponse.json(
                    { error: "emailType inválido" },
                    { status: 400 }
                )
        }

        // Enviar email de prueba
        const message = new SendSmtpEmail()
        message.sender = {
            email: BREVO_CONFIG.senderEmail,
            name: BREVO_CONFIG.senderName
        }
        message.to = [
            {
                email: testEmail,
                name: "Test Recipient"
            }
        ]
        message.subject = subject
        message.htmlContent = htmlContent

        const response = await transactionalEmailsApi.sendTransacEmail(message)

        return NextResponse.json({
            success: true,
            emailType,
            testEmail,
            subject,
            response: response,
            message: "Email de prueba enviado exitosamente"
        })

    } catch (error) {
        console.error('Error sending test email:', error)
        return NextResponse.json(
            { error: "Error al enviar email de prueba", details: error },
            { status: 500 }
        )
    }
}
