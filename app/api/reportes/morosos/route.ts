import { createClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

interface FacturaData {
    nro_factura: string;
    fecha_emision: string;
    fecha_inicio: string;
    fecha_fin: string;
    importe_total: number;
    estado_pago: 'pendiente' | 'vencido';
}

interface ComercioData {
    id_comercio: number;
    nombre_comercio: string;
    domicilio_fiscal: string;
    factura: FacturaData | FacturaData[];
}

interface FacturaProcessed {
    nroFactura: string;
    fechaEmision: string;
    fechaInicio: string;
    fechaFin: string;
    importeTotal: number;
    estadoPago: 'pendiente' | 'vencido';
    diasVencimiento?: number;
}

interface ComercioMoroso {
    idComercio: number;
    nombreComercio: string;
    domicilioFiscal: string;
    facturas: FacturaProcessed[];
    totalDeuda: number;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const fechaInicio = searchParams.get('fechaInicio');
        const fechaFin = searchParams.get('fechaFin');

        if (!fechaInicio || !fechaFin) {
            return NextResponse.json(
                { error: 'Parámetros fechaInicio y fechaFin son requeridos' },
                { status: 400 }
            );
        }

        // Obtener información del usuario autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Obtener el legajo del usuario desde metadata
        const legajoEmpleado = user.user_metadata?.legajo;
        if (!legajoEmpleado) {
            return NextResponse.json(
                { error: 'Usuario sin legajo válido' },
                { status: 403 }
            );
        }

        // Verificar que el usuario es administrador
        const { data: adminData, error: adminError } = await supabase
            .from('administrador')
            .select('id_sucursal')
            .eq('legajo_empleado', legajoEmpleado)
            .single();

        if (adminError || !adminData) {
            return NextResponse.json(
                { error: 'Usuario no autorizado como administrador' },
                { status: 403 }
            );
        }

        // Obtener información de la sucursal por separado
        const { data: sucursalData, error: sucursalError } = await supabase
            .from('sucursal')
            .select('ciudad_sucursal, direccion_sucursal')
            .eq('id_sucursal', adminData.id_sucursal)
            .single();

        if (sucursalError || !sucursalData) {
            return NextResponse.json(
                { error: 'No se pudo obtener información de la sucursal' },
                { status: 500 }
            );
        }

        // Consulta para obtener comercios con facturas morosas en la sucursal del administrador
        const { data: comerciosData, error: comerciosError } = await supabase
            .from('comercio')
            .select(`
                id_comercio,
                nombre_comercio,
                domicilio_fiscal,
                factura!inner (
                    nro_factura,
                    fecha_emision,
                    fecha_inicio,
                    fecha_fin,
                    importe_total,
                    estado_pago
                )
            `)
            .eq('id_sucursal_origen', adminData.id_sucursal)
            .eq('estado_comercio', 'habilitado')
            .in('factura.estado_pago', ['pendiente', 'vencido'])
            .gte('factura.fecha_inicio', fechaInicio)
            .lte('factura.fecha_inicio', fechaFin);

        if (comerciosError) {
            console.error('Error en consulta de comercios:', comerciosError);
            return NextResponse.json(
                { error: 'Error al obtener datos de comercios morosos' },
                { status: 500 }
            );
        }

        // Procesar y estructurar los datos
        const comerciosMorososMap = new Map<number, ComercioMoroso>();
        let totalDeudaGeneral = 0;

        comerciosData?.forEach((comercio: ComercioData) => {
            const comercioId = comercio.id_comercio;

            if (!comerciosMorososMap.has(comercioId)) {
                comerciosMorososMap.set(comercioId, {
                    idComercio: comercio.id_comercio,
                    nombreComercio: comercio.nombre_comercio,
                    domicilioFiscal: comercio.domicilio_fiscal,
                    facturas: [],
                    totalDeuda: 0
                });
            }

            const comercioMoroso = comerciosMorososMap.get(comercioId);
            if (!comercioMoroso) return;

            // Procesar cada factura (siempre será un array por la consulta inner join)
            const facturas = Array.isArray(comercio.factura) ? comercio.factura : [comercio.factura];

            facturas.forEach((factura: FacturaData) => {
                if (!factura) return;

                let diasVencimiento = 0;
                if (factura.estado_pago === 'vencido') {
                    const fechaEmision = new Date(factura.fecha_emision);
                    const hoy = new Date();
                    // Asumimos vencimiento a los 30 días de la emisión
                    const fechaVencimiento = new Date(fechaEmision);
                    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
                    diasVencimiento = Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));
                }

                const facturaData: FacturaProcessed = {
                    nroFactura: factura.nro_factura,
                    fechaEmision: factura.fecha_emision,
                    fechaInicio: factura.fecha_inicio,
                    fechaFin: factura.fecha_fin,
                    importeTotal: factura.importe_total,
                    estadoPago: factura.estado_pago,
                    diasVencimiento: diasVencimiento > 0 ? diasVencimiento : undefined
                };

                comercioMoroso.facturas.push(facturaData);
                comercioMoroso.totalDeuda += factura.importe_total;
                totalDeudaGeneral += factura.importe_total;
            });
        });

        // Convertir Map a Array y ordenar por deuda (mayor a menor)
        const comerciosMorosos = Array.from(comerciosMorososMap.values())
            .sort((a, b) => b.totalDeuda - a.totalDeuda);

        const responseData = {
            comerciosMorosos,
            totalDeudaGeneral,
            fechaInicio,
            fechaFin,
            sucursalAdministrador: {
                ciudadSucursal: sucursalData.ciudad_sucursal || 'Sin datos',
                direccionSucursal: sucursalData.direccion_sucursal || 'Sin datos'
            },
            resumen: {
                totalComercios: comerciosMorosos.length,
                facturasVencidas: comerciosMorosos.reduce((acc, comercio) =>
                    acc + comercio.facturas.filter((f: FacturaProcessed) => f.estadoPago === 'vencido').length, 0),
                facturasPendientes: comerciosMorosos.reduce((acc, comercio) =>
                    acc + comercio.facturas.filter((f: FacturaProcessed) => f.estadoPago === 'pendiente').length, 0)
            }
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error API reporte morosos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}