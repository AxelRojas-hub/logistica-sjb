import { useState } from 'react'
import type { Factura } from '@/lib/types'

interface ComercioInfo {
    nombreComercio: string
    direccion: string
    telefono?: string
    email?: string
    sucursalOrigen?: {
        direccionSucursal: string
        ciudadSucursal: string
    }
}

interface MercadoPagoResponse {
    init_point: string
}

export function useMercadoPago() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createPreference = async (factura: Factura, comercioInfo: ComercioInfo): Promise<string | null> => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/mercadopago/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idFactura: factura.idFactura,
                    importeTotal: factura.importeTotal,
                    nroFactura: factura.nroFactura,
                    comercioInfo
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error creando preferencia de pago')
            }

            const data: MercadoPagoResponse = await response.json()

            // Devolver directamente el init_point siguiendo el patrón del repositorio
            return data.init_point
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
            setError(errorMessage)
            console.error('Error creating MercadoPago preference:', err)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const redirectToPayment = async (factura: Factura, comercioInfo: ComercioInfo) => {
        const paymentUrl = await createPreference(factura, comercioInfo)

        if (paymentUrl) {
            // Abrir en nueva ventana/pestaña
            window.open(paymentUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return {
        createPreference,
        redirectToPayment,
        isLoading,
        error
    }
}