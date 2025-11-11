import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

type SupabaseResponse = {
    id_comercio: number;
    nombre_comercio: string;
    cuenta_comercio: {
        nombre_responsable: string;
        email_comercio: string;
    }[];
    factura: {
        id_factura: number;
        importe_total: number;
        fecha_fin: string;
        estado_pago: string;
    }[];
}

interface ComercioMorosoFormateado {
    id_comercio: number;
    nombre_comercio: string;
    nombre_responsable: string;
    email_comercio: string;
    cantidad_facturas_vencidas: number;
    total_adeudado: number;
    fecha_vencimiento_mas_antigua: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dias = parseInt(searchParams.get("dias") || "30")
        console.log('Días solicitados:', dias)

        const supabase = await createClient()
        
        // Verificar autenticación
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            console.log('Error de autenticación:', authError)
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            )
        }

        console.log('Usuario autenticado:', user.email)
        console.log('Metadata del usuario:', user.user_metadata)

        // Verificar que el usuario sea administrador
        if (user.user_metadata.rol !== 'admin') {
            console.log('Rol del usuario:', user.user_metadata.rol)
            return NextResponse.json(
                { error: "Acceso denegado. Se requieren privilegios de administrador" },
                { status: 403 }
            )
        }

        // Calcular la fecha límite para el filtro
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - dias);
        const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];

        console.log('Fecha límite para el filtro:', fechaLimiteStr);
        
        // Construir la consulta principal
        const { data: comerciosMorosos, error: queryError } = await supabase
            .from('comercio')
            .select(`
                id_comercio,
                nombre_comercio,
                cuenta_comercio!inner (
                    nombre_responsable,
                    email_comercio
                ),
                factura!inner (
                    id_factura,
                    importe_total,
                    fecha_fin,
                    estado_pago
                )
            `)
            .eq('estado_comercio', 'habilitado')
            .eq('factura.estado_pago', 'vencido')
            .lte('factura.fecha_fin', fechaLimiteStr)

        if (queryError) {
            console.error('Error al obtener comercios morosos:', queryError);
            return NextResponse.json(
                { error: `Error en la consulta: ${queryError.message}` },
                { status: 500 }
            );
        }

        if (!comerciosMorosos || comerciosMorosos.length === 0) {
            return NextResponse.json([])
        }

        console.log('Datos obtenidos:', comerciosMorosos);

        // Transformar los datos al formato requerido
        const comerciosMorososFormateados: ComercioMorosoFormateado[] = (comerciosMorosos as SupabaseResponse[]).map(comercio => ({
            id_comercio: comercio.id_comercio,
            nombre_comercio: comercio.nombre_comercio,
            nombre_responsable: comercio.cuenta_comercio[0].nombre_responsable,
            email_comercio: comercio.cuenta_comercio[0].email_comercio,
            cantidad_facturas_vencidas: comercio.factura.length,
            total_adeudado: comercio.factura.reduce((sum: number, f: { importe_total: number }) => 
                sum + f.importe_total, 0),
            fecha_vencimiento_mas_antigua: comercio.factura.reduce(
                (oldest: string, f: { fecha_fin: string }) => 
                    f.fecha_fin < oldest ? f.fecha_fin : oldest,
                comercio.factura[0]?.fecha_fin
            )
        })).sort((a, b) => b.total_adeudado - a.total_adeudado);

        return NextResponse.json(comerciosMorososFormateados)
    } catch (error) {
        console.error('Error en GET /api/reportes/comercios-morosos:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}