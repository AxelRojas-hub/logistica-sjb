import { createClient } from "@/lib/supabaseServer"

export interface StatsData {
    enviosActivos: number;
    comerciosActivos: number;
    comerciosMorosos: number;
}

/**
 * Obtiene el ID de sucursal del administrador logueado
 */
async function getAdminSucursal(): Promise<number> {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new Error('Usuario no autenticado')
    }

    const legajo = user.user_metadata?.legajo
    if (!legajo) {
        throw new Error('No se encontró el legajo del administrador')
    }

    const { data: admin, error: adminError } = await supabase
        .from('administrador')
        .select('id_sucursal')
        .eq('legajo_empleado', legajo)
        .single()

    if (adminError || !admin) {
        throw new Error('No se encontró la información del administrador')
    }

    return admin.id_sucursal
}

/**
 * Obtiene las estadísticas rápidas para el dashboard de reportes
 */
export async function getQuickStats(): Promise<StatsData> {
    const supabase = await createClient()
    const idSucursal = await getAdminSucursal()

    // Primero obtener comercios de esta sucursal
    const { data: comerciosSucursal } = await supabase
        .from('comercio')
        .select('id_comercio')
        .eq('id_sucursal_origen', idSucursal)

    const comerciosIds = comerciosSucursal?.map(c => c.id_comercio) || []

    // Obtener envíos activos que tienen pedidos de comercios de esta sucursal
    const { data: enviosActivos } = await supabase
        .from('envio')
        .select('id_envio, pedido!inner(id_comercio)')
        .eq('estado_envio', 'en_camino')
        .in('pedido.id_comercio', comerciosIds)

    // Obtener comercios activos de esta sucursal
    const { data: comerciosActivos } = await supabase
        .from('comercio')
        .select('id_comercio')
        .eq('id_sucursal_origen', idSucursal)
        .eq('estado_comercio', 'habilitado')

    // Obtener comercios morosos (con facturas vencidas) de esta sucursal
    const comerciosIdsSucursal = await supabase
        .from('comercio')
        .select('id_comercio')
        .eq('id_sucursal_origen', idSucursal)
        .then(res => res.data?.map(c => c.id_comercio) || [])

    const { data: comerciosMorosos } = await supabase
        .from('factura')
        .select('id_comercio')
        .eq('estado_pago', 'vencido')
        .in('id_comercio', comerciosIdsSucursal)

    // Obtener comercios únicos morosos
    const comerciosMorososUnicos = new Set(comerciosMorosos?.map(f => f.id_comercio) || [])

    return {
        enviosActivos: enviosActivos?.length || 0,
        comerciosActivos: comerciosActivos?.length || 0,
        comerciosMorosos: comerciosMorososUnicos.size
    }
}

/**
 * Obtiene comercios morosos para reportes
 */
export async function getComerciosMorosos(diasVencimiento: number = 30) {
    const supabase = await createClient()
    const idSucursal = await getAdminSucursal()

    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - diasVencimiento)

    const { data: comerciosMorosos, error } = await supabase
        .from('comercio')
        .select(`
            id_comercio,
            nombre_comercio,
            domicilio_fiscal,
            factura!inner(
                id_factura,
                nro_factura,
                importe_total,
                fecha_emision,
                estado_pago
            )
        `)
        .eq('id_sucursal_origen', idSucursal)
        .eq('factura.estado_pago', 'vencido')
        .lt('factura.fecha_emision', fechaLimite.toISOString())

    if (error) {
        throw new Error(`Error obteniendo comercios morosos: ${error.message}`)
    }

    return comerciosMorosos || []
}

/**
 * Obtiene datos de facturación por período
 */
export async function getFacturacionPorPeriodo(fechaInicio: Date, fechaFin: Date, estadoPago?: string) {
    const supabase = await createClient()
    const idSucursal = await getAdminSucursal()

    const comerciosIdsSucursal = await supabase
        .from('comercio')
        .select('id_comercio')
        .eq('id_sucursal_origen', idSucursal)
        .then(res => res.data?.map(c => c.id_comercio) || [])

    let query = supabase
        .from('factura')
        .select(`
            id_factura,
            nro_factura,
            importe_total,
            fecha_emision,
            fecha_inicio,
            fecha_fin,
            estado_pago,
            comercio!inner(
                nombre_comercio,
                domicilio_fiscal
            )
        `)
        .in('id_comercio', comerciosIdsSucursal)
        .gte('fecha_emision', fechaInicio.toISOString())
        .lte('fecha_emision', fechaFin.toISOString())

    if (estadoPago && estadoPago !== 'all') {
        const estadoMap: Record<string, string> = {
            'paid': 'pagado',
            'pending': 'pendiente',
            'overdue': 'vencido'
        }
        query = query.eq('estado_pago', estadoMap[estadoPago])
    }

    const { data: facturas, error } = await query.order('fecha_emision', { ascending: false })

    if (error) {
        throw new Error(`Error obteniendo facturación: ${error.message}`)
    }

    return facturas || []
}