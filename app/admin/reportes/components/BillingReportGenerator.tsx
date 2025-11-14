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
}

export function BillingReportGenerator() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

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

            // Construir query para facturas - siempre buscar todas
            const { data: facturasData, error: facturasError } = await supabaseClient
                .from('factura')
                .select(`
                    estado_pago,
                    importe_total,
                    fecha_inicio,
                    fecha_fin,
                    comercio!inner (
                        id_sucursal_origen
                    )
                `)
                .eq('comercio.id_sucursal_origen', adminData.id_sucursal)
                .gte('fecha_inicio', startDate)
                .lte('fecha_inicio', endDate);

            if (facturasError) {
                throw new Error('Error al obtener datos de facturas');
            }

            // Procesar datos
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
                }
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
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha Fin</label>
                    <Input
                        type="date"
                        value={endDate}
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