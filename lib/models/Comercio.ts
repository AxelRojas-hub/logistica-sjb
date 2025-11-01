import { createClient } from "@/lib/supabaseServer"
import { Comercio, Contrato, EstadoComercio, Factura } from "@/lib/types"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
}

/**
 * Obtiene un comercio específico por nombre con todos sus detalles
 * @param nombreComercio - Nombre del comercio a obtener
 * @returns Comercio con detalles (cuenta, contrato, facturas)
 */
export async function getComercioByName(nombreComercio: string): Promise<ComercioWithDetails | null> {
    try {
        const supabase = await createClient()

        // Obtener datos del comercio
        const { data: comercio, error: comercioError } = await supabase
            .from("comercio")
            .select("*")
            .eq("nombre_comercio", nombreComercio)
            .single()

        if (comercioError || !comercio) {
            return null
        }

        let email = ""
        let nombreResponsable = ""
        let contrato: Contrato | undefined

        // Obtener información de la cuenta
        const { data: cuentaComercio } = await supabase
            .from("cuenta_comercio")
            .select("*")
            .eq("id_cuenta_comercio", comercio.id_cuenta_comercio)
            .single()

        if (cuentaComercio) {
            email = cuentaComercio.email_comercio
            nombreResponsable = cuentaComercio.nombre_responsable
        }

        // Obtener información del contrato
        const { data: contratoData } = await supabase
            .from("contrato")
            .select("*")
            .eq("id_contrato", comercio.id_contrato)
            .single()

        if (contratoData) {
            contrato = {
                idContrato: contratoData.id_contrato,
                tipoCobro: contratoData.tipo_cobro,
                descuento: contratoData.descuento,
                estadoContrato: contratoData.estado_contrato,
                duracionContratoMeses: contratoData.duracion_contrato_meses,
                fechaFinContrato: contratoData.fecha_fin_contrato,
            }
        }

        // Obtener facturas
        const { data: facturas } = await supabase
            .from("factura")
            .select("*")
            .eq("id_comercio", comercio.id_comercio)

        return {
            idComercio: comercio.id_comercio,
            idContrato: comercio.id_contrato,
            idCuentaComercio: comercio.id_cuenta_comercio,
            idSucursalOrigen: comercio.id_sucursal_origen,
            nombreComercio: comercio.nombre_comercio,
            domicilioFiscal: comercio.domicilio_fiscal,
            estadoComercio: comercio.estado_comercio as EstadoComercio,
            email,
            nombreResponsable,
            contrato,
            facturas: facturas || [],
        }
    } catch (error) {
        console.error(`Error obteniendo comercio "${nombreComercio}":`, error)
        return null
    }
}

export function mapRowToComercio(row: Record<string, unknown>): Comercio {
    return {
        idComercio: row.id_comercio as number,
        idContrato: row.id_contrato as number,
        idCuentaComercio: row.id_cuenta_comercio as number,
        idSucursalOrigen: row.id_sucursal_origen as number,
        nombreComercio: row.nombre_comercio as string,
        domicilioFiscal: row.domicilio_fiscal as string,
        estadoComercio: row.estado_comercio as Comercio['estadoComercio']
    }
}