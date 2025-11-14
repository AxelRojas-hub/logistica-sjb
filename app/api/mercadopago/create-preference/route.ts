import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Inicializar cliente de MercadoPago siguiendo el patrón del repositorio de referencia
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { idFactura, importeTotal, nroFactura, comercioInfo } = body

        if (!idFactura || !importeTotal || !nroFactura) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            )
        }

        // Crear la preferencia siguiendo exactamente el patrón del repositorio
        const preference = await new Preference(client).create({
            body: {
                items: [
                    {
                        id: `factura_${idFactura}`,
                        unit_price: Number(importeTotal),
                        quantity: 1,
                        title: `Factura ${nroFactura} - ${comercioInfo?.nombreComercio || 'Logística SJB'}`,
                    },
                ],
                external_reference: `factura_${idFactura}`,
                back_urls: {
                    success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/comercio/facturas?payment=success`,
                    failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/comercio/facturas?payment=failure`,
                    pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/comercio/facturas?payment=pending`
                },
                notification_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/mercadopago/webhook`,
                payer: {
                    name: comercioInfo?.nombreComercio || 'Cliente',
                    email: comercioInfo?.email || 'test_user_123456@testuser.com'
                }
            },
        })

        // Devolver el init_point siguiendo el patrón del repositorio
        return NextResponse.json({
            init_point: preference.init_point!
        })

    } catch (error) {
        console.error('Error creando preferencia de MercadoPago:', error)

        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}