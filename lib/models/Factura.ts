import { SupabaseClient } from "@supabase/supabase-js"
import { addMonths, addDays, isAfter, isBefore } from "date-fns"
import { Factura } from "@/lib/types"

export async function obtenerFacturaActual(supabase: SupabaseClient, idComercio: number): Promise<Factura> {
    // 1. Obtener contrato y tipo de cobro
    const { data: comercio, error: comercioError } = await supabase
        .from('comercio')
        .select('id_contrato, contrato(tipo_cobro)')
        .eq('id_comercio', idComercio)
        .single()

    if (comercioError || !comercio) throw new Error("Comercio o contrato no encontrado")

    const contratoData = Array.isArray(comercio.contrato) ? comercio.contrato[0] : comercio.contrato
    const tipoCobro = contratoData?.tipo_cobro || 'mensual' // Default a mensual

    // 2. Obtener última factura
    const { data: ultimaFactura } = await supabase
        .from('factura')
        .select('*')
        .eq('id_comercio', idComercio)
        .order('fecha_fin', { ascending: false })
        .limit(1)
        .single()

    const hoy = new Date()

    // Caso A: No hay facturas
    if (!ultimaFactura) {
        const fechaInicio = hoy
        const fechaFin = calcularFechaFin(fechaInicio, tipoCobro)
        return crearFactura(supabase, idComercio, fechaInicio, fechaFin)
    }

    const finUltima = new Date(ultimaFactura.fecha_fin)
    // Ajustar finUltima para incluir todo el día (comparación segura)
    finUltima.setHours(23, 59, 59, 999)

    // Caso B: La última factura cubre hoy
    if (isAfter(finUltima, hoy)) {
        return mapRowToFactura(ultimaFactura)
    }

    // Caso C: La última factura ya venció
    // Calcular nuevo periodo manteniendo alineación
    // El nuevo inicio es el día siguiente al fin de la última
    // Nota: fecha_fin es string YYYY-MM-DD, new Date lo parsea como UTC 00:00.
    // Al sumar 1 día, obtenemos el siguiente día.
    let nuevoInicio = addDays(new Date(ultimaFactura.fecha_fin), 1)
    let nuevoFin = calcularFechaFin(nuevoInicio, tipoCobro)

    // Avanzar periodos si hay huecos grandes hasta cubrir hoy
    let iteraciones = 0
    // Ajustamos hoy al final del día para asegurar cobertura
    const hoyFinDia = new Date()
    hoyFinDia.setHours(23, 59, 59, 999)

    while (isBefore(nuevoFin, hoy) && iteraciones < 100) {
        nuevoInicio = addDays(nuevoFin, 1)
        nuevoFin = calcularFechaFin(nuevoInicio, tipoCobro)
        iteraciones++
    }

    return crearFactura(supabase, idComercio, nuevoInicio, nuevoFin)
}

function calcularFechaFin(inicio: Date, tipoCobro: string): Date {
    if (tipoCobro === 'quincenal') {
        return addDays(inicio, 15)
    }
    // Mensual
    return addMonths(inicio, 1)
}

async function crearFactura(supabase: SupabaseClient, idComercio: number, inicio: Date, fin: Date): Promise<Factura> {
    // Formato YYYY-MM-DD para fechas DATE de postgres
    const fechaInicioStr = inicio.toISOString().split('T')[0]
    const fechaFinStr = fin.toISOString().split('T')[0]
    const fechaEmisionStr = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('factura')
        .insert({
            id_comercio: idComercio,
            fecha_inicio: fechaInicioStr,
            fecha_fin: fechaFinStr,
            estado_pago: 'pendiente',
            importe_total: 0,
            fecha_emision: fechaEmisionStr,
            nro_factura: `F-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        })
        .select()
        .single()

    if (error) {
        console.error("Error creando factura:", error)
        throw error
    }
    return mapRowToFactura(data)
}

function mapRowToFactura(row: {
    id_factura: number;
    id_comercio: number;
    nro_factura: string;
    fecha_inicio: string;
    importe_total: number;
    fecha_fin: string;
    fecha_emision: string;
    nro_pago?: string;
    estado_pago: 'pendiente' | 'pagado' | 'vencido';
    fecha_pago?: string;
}): Factura {
    return {
        idFactura: row.id_factura,
        idComercio: row.id_comercio,
        nroFactura: row.nro_factura,
        fechaInicio: row.fecha_inicio,
        importeTotal: row.importe_total,
        fechaFin: row.fecha_fin,
        fechaEmision: row.fecha_emision,
        nroPago: row.nro_pago || null,
        estadoPago: row.estado_pago,
        fechaPago: row.fecha_pago || null
    }
}
