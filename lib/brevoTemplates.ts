import { BREVO_CONFIG } from './brevoConfig'

const LOGO_SVG = `<svg height="80" width="80" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 506.88 506.88">
  <g transform="translate(1 1)">
    <path style="fill:#0ac2ff;" d="M492.227,284.013l-37.547-14.507l-22.187-89.6c-1.707-7.68-8.533-12.8-16.213-12.8h-57.173 c-16.213,45.227-44.373,93.867-91.307,93.867h-34.133h-25.6H39.96L18.627,371.907h51.2c0-23.893,18.773-42.667,42.667-42.667 s42.667,18.773,42.667,42.667h171.52h34.133c0-23.893,18.773-42.667,42.667-42.667c23.893,0,42.667,18.773,42.667,42.667h42.667 c5.12,0,8.533-3.413,8.533-8.533v-70.827C497.347,289.133,495.64,285.72,492.227,284.013"/>
    <path style="fill:#0ac2ff;" d="M155.16,371.907c0-23.893-18.773-42.667-42.667-42.667s-42.667,18.773-42.667,42.667 c0,23.893,18.773,42.667,42.667,42.667S155.16,395.8,155.16,371.907"/>
    <path style="fill:#0ac2ff;" d="M446.147,371.907c0-23.893-18.773-42.667-42.667-42.667c-23.893,0-42.667,18.773-42.667,42.667 c0,23.893,18.773,42.667,42.667,42.667C427.373,414.573,446.147,395.8,446.147,371.907"/>
  </g>
</svg>`

function createBaseTemplate(title: string, content: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0ac2ff; }
        .logo { margin-bottom: 15px; }
        h1 { color: #0ac2ff; margin: 0; font-size: 24px; }
        .content { margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: #0ac2ff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ac2ff; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${LOGO_SVG}</div>
          <h1>Logística SJB</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Este es un mensaje automático del sistema de Logística SJB</p>
          <p>No responda a este correo</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const EmailTemplates = {
    orderDispatched: (orderData: { idPedido: number; nombreCliente: string; direccionCliente: string }) => {
        const content = `
      <h2>Su pedido está en camino</h2>
      <div class="highlight">
        <p><strong>Pedido #${orderData.idPedido}</strong></p>
        <p><strong>Destinatario:</strong> ${orderData.nombreCliente}</p>
        <p><strong>Dirección:</strong> ${orderData.direccionCliente}</p>
      </div>
      <p>Su pedido ha sido despachado y está en camino hacia su destino.</p>
      <p>Recibirá otra notificación cuando llegue a la sucursal de destino.</p>
    `
        return createBaseTemplate('Pedido en Camino - Logística SJB', content)
    },

    orderDelivered: (orderData: { idPedido: number; nombreCliente: string; fechaEntrega: string }) => {
        const content = `
      <h2>¡Pedido entregado con éxito!</h2>
      <div class="highlight">
        <p><strong>Pedido #${orderData.idPedido}</strong></p>
        <p><strong>Destinatario:</strong> ${orderData.nombreCliente}</p>
        <p><strong>Fecha de entrega:</strong> ${new Date(orderData.fechaEntrega).toLocaleDateString('es-AR')}</p>
      </div>
      <p>Su pedido ha sido entregado exitosamente.</p>
      <p>Gracias por confiar en Logística SJB.</p>
    `
        return createBaseTemplate('Pedido Entregado - Logística SJB', content)
    },

    deliveryDelay: (orderData: { idPedido: number; nombreCliente: string; fechaLimite: string; diasRetraso: number }) => {
        const content = `
      <h2>Retraso en la entrega</h2>
      <div class="highlight">
        <p><strong>Pedido #${orderData.idPedido}</strong></p>
        <p><strong>Destinatario:</strong> ${orderData.nombreCliente}</p>
        <p><strong>Fecha límite original:</strong> ${new Date(orderData.fechaLimite).toLocaleDateString('es-AR')}</p>
      </div>
      <p>Lamentamos informarle que su pedido presenta un retraso en la entrega.</p>
      <p>Estamos trabajando para resolver esta situación lo antes posible.</p>
    `
        return createBaseTemplate('Retraso en Entrega - Logística SJB', content)
    },

    invoiceGenerated: (invoiceData: { nroFactura: string; nombreComercio: string; importeTotal: number; fechaVencimiento: string }) => {
        const content = `
      <h2>Nueva factura generada</h2>
      <div class="highlight">
        <p><strong>Factura:</strong> ${invoiceData.nroFactura}</p>
        <p><strong>Comercio:</strong> ${invoiceData.nombreComercio}</p>
        <p><strong>Vencimiento:</strong> ${new Date(invoiceData.fechaVencimiento).toLocaleDateString('es-AR')}</p>
      </div>
      <p>Se ha generado una nueva factura para su comercio.</p>
      <a href="${BREVO_CONFIG.baseUrl}/comercio/facturas" class="btn">Ver Facturas</a>
    `
        return createBaseTemplate('Nueva Factura - Logística SJB', content)
    },

    paymentReminder: (invoiceData: { nroFactura: string; nombreComercio: string; importeTotal: number; diasVencido: number }) => {
        const content = `
      <h2>Recordatorio de pago vencido</h2>
      <div class="highlight">
        <p><strong>Factura:</strong> ${invoiceData.nroFactura}</p>
        <p><strong>Comercio:</strong> ${invoiceData.nombreComercio}</p>
      </div>
      <p>Su factura se encuentra vencida. Recordamos que tras 2 meses de incumplimiento se procederá a la suspensión del servicio, realice el pago lo antes posible.</p>
      <a href="${BREVO_CONFIG.baseUrl}/comercio/facturas" class="btn">Pagar Ahora</a>
    `
        return createBaseTemplate('Pago Vencido - Logística SJB', content)
    }
}
