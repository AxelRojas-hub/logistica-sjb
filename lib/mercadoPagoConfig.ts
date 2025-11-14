// MercadoPago configuration
export const mercadoPagoConfig = {
    publicKey: process.env.MP_PUBLIC_KEY || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
    accessToken: process.env.MP_ACCESS_TOKEN,
    isDevelopment: process.env.NODE_ENV === 'development',

    // URLs de retorno
    successUrl: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/comercio/facturas?payment=success`
        : 'http://localhost:3000/comercio/facturas?payment=success',

    failureUrl: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/comercio/facturas?payment=failure`
        : 'http://localhost:3000/comercio/facturas?payment=failure',

    pendingUrl: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/comercio/facturas?payment=pending`
        : 'http://localhost:3000/comercio/facturas?payment=pending',

    webhookUrl: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/api/mercadopago/webhook`
        : 'http://localhost:3000/api/mercadopago/webhook',
}

// Validar que las variables de entorno estén configuradas
if (!mercadoPagoConfig.accessToken) {
    console.warn('⚠️ MP_ACCESS_TOKEN no está configurado en las variables de entorno')
}

if (!mercadoPagoConfig.publicKey) {
    console.warn('⚠️ MP_PUBLIC_KEY no está configurado en las variables de entorno')
}