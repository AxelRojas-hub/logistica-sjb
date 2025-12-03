"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadBillingReportPDF } from '@/lib/pdfGenerator';
import { supabaseClient } from '@/lib/supabaseClient';

interface BillingReportData {
    fechaInicio: string;
    fechaFin: string;
    estadoFiltro: string;
    facturasPagadas: number;
    facturasPendientes: number;
    facturasVencidas: number;
    montoTotal: number;
    montoPagado: number;
    montoPendiente: number;
    montoVencido: number;
    sucursalAdministrador: {
        ciudadSucursal: string;
        direccionSucursal: string;
    };
    comerciosDetalle: Array<{
        nombreComercio: string;
        servicios: Array<{
            nombreServicio: string;
            cantidadPedidos: number;
            montoFacturado: number;
        }>;
        pedidos: Array<{
            idPedido: number;
            fechaEntrega: string | null;
            estado: string;
            monto: number;
            destino: string;
            servicio: string;
        }>;
    }>;
}

interface PedidoServicioRow {
    servicio?: {
        nombre_servicio: string;
    } | {
        nombre_servicio: string;
    }[];
}

interface PedidoRow {
    id_pedido: number;
    precio: number;
    estado_pedido: string;
    fecha_entrega: string | null;
    sucursal: { ciudad_sucursal: string } | null;
    pedido_servicio: PedidoServicioRow[] | { servicio: { nombre_servicio: string }[] }[];
}

export function BillingReportGenerator() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const fetchBillingData = async (): Promise<BillingReportData | null> => {
        try {
            // Obtener información del usuario autenticado
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            const legajoEmpleado = user.user_metadata?.legajo;
            if (!legajoEmpleado) throw new Error('Usuario sin legajo válido');

            // Obtener información del administrador
            const { data: adminData, error: adminError } = await supabaseClient
                .from('administrador')
                .select('id_sucursal')
                .eq('legajo_empleado', legajoEmpleado)
                .single();

            if (adminError || !adminData) {
                throw new Error('No se pudo obtener información del administrador');
            }

            // Obtener información de la sucursal
            const { data: sucursalData, error: sucursalError } = await supabaseClient
                .from('sucursal')
                .select('ciudad_sucursal, direccion_sucursal')
                .eq('id_sucursal', adminData.id_sucursal)
                .single();

            if (sucursalError || !sucursalData) {
                throw new Error('No se pudo obtener información de la sucursal');
            }

            // Obtener facturas con detalles de comercio y pedidos
            const { data: facturasData, error: facturasError } = await supabaseClient
                .from('factura')
                .select(`
                    id_factura,
                    estado_pago,
                    importe_total,
                    fecha_inicio,
                    fecha_fin,
                    comercio!inner (
                        id_comercio,
                        id_sucursal_origen,
                        nombre_comercio
                    )
                `)
                .eq('comercio.id_sucursal_origen', adminData.id_sucursal)
                .gte('fecha_inicio', startDate)
                .lte('fecha_inicio', endDate);

            if (facturasError) {
                throw new Error('Error al obtener datos de facturas');
            }

            // Procesar datos de resumen general
            let facturasPagadas = 0;
            let facturasPendientes = 0;
            let facturasVencidas = 0;
            let montoPagado = 0;
            let montoPendiente = 0;
            let montoVencido = 0;

            facturasData?.forEach(factura => {
                switch (factura.estado_pago) {
                    case 'pagado':
                        facturasPagadas++;
                        montoPagado += factura.importe_total;
                        break;
                    case 'pendiente':
                        facturasPendientes++;
                        montoPendiente += factura.importe_total;
                        break;
                    case 'vencido':
                        facturasVencidas++;
                        montoVencido += factura.importe_total;
                        break;
                }
            });

            // Obtener detalles por comercio y servicio
            const comerciosMap = new Map<number, { nombreComercio: string; facturaIds: number[] }>();
            (facturasData as unknown as Array<{ comercio: { id_comercio: number; nombre_comercio: string }; id_factura: number }>)?.forEach(factura => {
                const comercioData = Array.isArray(factura.comercio) ? factura.comercio[0] : factura.comercio;
                if (!comerciosMap.has(comercioData.id_comercio)) {
                    comerciosMap.set(comercioData.id_comercio, {
                        nombreComercio: comercioData.nombre_comercio,
                        facturaIds: []
                    });
                }
                comerciosMap.get(comercioData.id_comercio)!.facturaIds.push(factura.id_factura);
            });

            // Obtener pedidos y servicios por factura
            const comerciosDetalle: Array<{
                nombreComercio: string;
                servicios: Array<{
                    nombreServicio: string;
                    cantidadPedidos: number;
                    montoFacturado: number;
                }>;
                pedidos: Array<{
                    idPedido: number;
                    fechaEntrega: string | null;
                    estado: string;
                    monto: number;
                    destino: string;
                    servicio: string;
                }>;
            }> = [];

            for (const [, comercioInfo] of comerciosMap) {
                const serviciosMap = new Map<string, { cantidad: number; monto: number }>();
                const pedidosList: Array<{
                    idPedido: number;
                    fechaEntrega: string | null;
                    estado: string;
                    monto: number;
                    destino: string;
                    servicio: string;
                }> = [];

                // Obtener pedidos asociados a las facturas
                for (const idFactura of comercioInfo.facturaIds) {
                    const { data: pedidosData } = await supabaseClient
                        .from('pedido')
                        .select(`
                            id_pedido,
                            precio,
                            estado_pedido,
                            fecha_entrega,
                            sucursal (
                                ciudad_sucursal
                            ),
                            pedido_servicio (
                                servicio (
                                    nombre_servicio
                                )
                            )
                        `)
                        .eq('id_factura', idFactura);


                    pedidosData?.forEach((pedido: unknown) => {
                        const pedidoTyped = pedido as PedidoRow;
                        const serviciosDelPedido: string[] = [];                        // Si no tiene servicios adicionales, contar como servicio "Transporte"
                        if (!pedidoTyped.pedido_servicio || pedidoTyped.pedido_servicio.length === 0) {
                            const key = 'Transporte';
                            const current = serviciosMap.get(key) || { cantidad: 0, monto: 0 };
                            serviciosMap.set(key, {
                                cantidad: current.cantidad + 1,
                                monto: current.monto + pedidoTyped.precio
                            });
                            serviciosDelPedido.push('Transporte');
                        } else {
                            // Procesar cada servicio del pedido
                            pedidoTyped.pedido_servicio.forEach((ps) => {
                                const servicio = Array.isArray(ps.servicio) ? ps.servicio[0] : ps.servicio;
                                const nombreServicio = servicio?.nombre_servicio || 'Sin especificar';
                                const current = serviciosMap.get(nombreServicio) || { cantidad: 0, monto: 0 };
                                serviciosMap.set(nombreServicio, {
                                    cantidad: current.cantidad + 1,
                                    monto: current.monto + pedidoTyped.precio
                                });
                                serviciosDelPedido.push(nombreServicio);
                            });
                        }

                        // Agregar a la lista de pedidos detallados
                        pedidosList.push({
                            idPedido: pedidoTyped.id_pedido,
                            fechaEntrega: pedidoTyped.fecha_entrega,
                            estado: pedidoTyped.estado_pedido,
                            monto: pedidoTyped.precio,
                            destino: pedidoTyped.sucursal?.ciudad_sucursal || 'N/A',
                            servicio: serviciosDelPedido.join(', ')
                        });
                    });
                }

                // Convertir serviciosMap a array
                const servicios = Array.from(serviciosMap).map(([nombreServicio, data]) => ({
                    nombreServicio,
                    cantidadPedidos: data.cantidad,
                    montoFacturado: data.monto
                }));

                comerciosDetalle.push({
                    nombreComercio: comercioInfo.nombreComercio,
                    servicios,
                    pedidos: pedidosList
                });
            }

            const montoTotal = montoPagado + montoPendiente + montoVencido;

            return {
                fechaInicio: startDate,
                fechaFin: endDate,
                estadoFiltro: 'all',
                facturasPagadas,
                facturasPendientes,
                facturasVencidas,
                montoTotal,
                montoPagado,
                montoPendiente,
                montoVencido,
                sucursalAdministrador: {
                    ciudadSucursal: sucursalData.ciudad_sucursal,
                    direccionSucursal: sucursalData.direccion_sucursal
                },
                comerciosDetalle
            };

        } catch (error) {
            console.error('Error obteniendo datos de facturación:', error);
            throw error;
        }
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            toast.error('Por favor selecciona las fechas de inicio y fin');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        }

        setIsGenerating(true);

        try {
            const data = await fetchBillingData();
            if (!data) {
                throw new Error('No se pudieron obtener los datos para el reporte');
            }

            downloadBillingReportPDF(data);

            const totalFacturas = data.facturasPagadas + data.facturasPendientes + data.facturasVencidas;
            toast.success(`Reporte generado exitosamente. Se encontraron ${totalFacturas} facturas con un monto total de $${data.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error desconocido al generar el reporte');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha Inicio</label>
                    <Input
                        type="date"
                        value={startDate}
                        max={endDate || today}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha Fin</label>
                    <Input
                        type="date"
                        value={endDate}
                        min={startDate}
                        max={today}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>



            <Button
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4 mr-2" />
                        Generar Reporte
                    </>
                )}
            </Button>
        </div>
    );
}