"use client"

import { useState } from 'react';
import { downloadDebtReportPDF } from '@/lib/pdfGenerator';
import { supabaseClient } from '@/lib/supabaseClient';

interface ComercioMoroso {
    idComercio: number;
    nombreComercio: string;
    domicilioFiscal: string;
    facturas: {
        nroFactura: string;
        fechaEmision: string;
        fechaInicio: string;
        fechaFin: string;
        importeTotal: number;
        estadoPago: 'pendiente' | 'vencido';
        diasVencimiento?: number;
    }[];
    totalDeuda: number;
}

interface ReporteMorososData {
    comerciosMorosos: ComercioMoroso[];
    totalDeudaGeneral: number;
    fechaInicio: string;
    fechaFin: string;
    sucursalAdministrador: {
        ciudadSucursal: string;
        direccionSucursal: string;
    };
}

export function useDebtReport() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDebtData = async (fechaInicio: string, fechaFin: string): Promise<ReporteMorososData | null> => {
        try {
            setIsLoading(true);

            // Obtener información del usuario autenticado
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) throw new Error('Usuario no autenticado');

            // Obtener el legajo del usuario desde metadata
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

            // Obtener información de la sucursal por separado
            const { data: sucursalData, error: sucursalError } = await supabaseClient
                .from('sucursal')
                .select('ciudad_sucursal, direccion_sucursal')
                .eq('id_sucursal', adminData.id_sucursal)
                .single();

            if (sucursalError || !sucursalData) {
                throw new Error('No se pudo obtener información de la sucursal');
            }

            // Buscar comercios con la misma sucursal de origen que el administrador
            const { data: comerciosData, error: comerciosError } = await supabaseClient
                .from('comercio')
                .select(`
                    id_comercio,
                    nombre_comercio,
                    domicilio_fiscal,
                    factura (
                        nro_factura,
                        fecha_emision,
                        fecha_inicio,
                        fecha_fin,
                        importe_total,
                        estado_pago,
                        fecha_emision
                    )
                `)
                .eq('id_sucursal_origen', adminData.id_sucursal)
                .eq('estado_comercio', 'habilitado');

            if (comerciosError) {
                throw new Error('Error al obtener datos de comercios');
            }

            // Filtrar y procesar comercios morosos
            const comerciosMorosos: ComercioMoroso[] = [];
            let totalDeudaGeneral = 0;

            comerciosData?.forEach(comercio => {
                // Filtrar facturas en el período seleccionado con estado pendiente o vencido
                const facturasMorosas = comercio.factura?.filter(factura => {
                    const fechaFactura = new Date(factura.fecha_inicio);
                    const fechaInicioFilter = new Date(fechaInicio);
                    const fechaFinFilter = new Date(fechaFin);

                    return (
                        (factura.estado_pago === 'pendiente' || factura.estado_pago === 'vencido') &&
                        fechaFactura >= fechaInicioFilter &&
                        fechaFactura <= fechaFinFilter
                    );
                }) || [];

                if (facturasMorosas.length > 0) {
                    const facturasProcesadas = facturasMorosas.map(factura => {
                        let diasVencimiento = 0;
                        if (factura.estado_pago === 'vencido') {
                            const fechaEmision = new Date(factura.fecha_emision);
                            const hoy = new Date();
                            // Asumimos que las facturas vencen a los 30 días
                            const fechaVencimiento = new Date(fechaEmision);
                            fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
                            diasVencimiento = Math.floor((hoy.getTime() - fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));
                        }

                        return {
                            nroFactura: factura.nro_factura,
                            fechaEmision: factura.fecha_emision,
                            fechaInicio: factura.fecha_inicio,
                            fechaFin: factura.fecha_fin,
                            importeTotal: factura.importe_total,
                            estadoPago: factura.estado_pago as 'pendiente' | 'vencido',
                            diasVencimiento: diasVencimiento > 0 ? diasVencimiento : undefined
                        };
                    });

                    const totalDeuda = facturasProcesadas.reduce((sum, f) => sum + f.importeTotal, 0);
                    totalDeudaGeneral += totalDeuda;

                    comerciosMorosos.push({
                        idComercio: comercio.id_comercio,
                        nombreComercio: comercio.nombre_comercio,
                        domicilioFiscal: comercio.domicilio_fiscal,
                        facturas: facturasProcesadas,
                        totalDeuda
                    });
                }
            });

            // Ordenar comercios por monto de deuda (mayor a menor)
            comerciosMorosos.sort((a, b) => b.totalDeuda - a.totalDeuda);

            return {
                comerciosMorosos,
                totalDeudaGeneral,
                fechaInicio,
                fechaFin,
                sucursalAdministrador: {
                    ciudadSucursal: sucursalData.ciudad_sucursal || 'Sin datos',
                    direccionSucursal: sucursalData.direccion_sucursal || 'Sin datos'
                }
            };

        } catch (error) {
            console.error('Error obteniendo datos de morosos:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const generateReport = async (fechaInicio: string, fechaFin: string) => {
        try {
            setIsGenerating(true);

            const data = await fetchDebtData(fechaInicio, fechaFin);
            if (!data) {
                throw new Error('No se pudieron obtener los datos para el reporte');
            }

            if (data.comerciosMorosos.length === 0) {
                throw new Error('No se encontraron comercios morosos en el período seleccionado');
            }

            downloadDebtReportPDF(data);

            return {
                success: true,
                message: `Reporte generado exitosamente. Se encontraron ${data.comerciosMorosos.length} comercios morosos con una deuda total de $${data.totalDeudaGeneral.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            };

        } catch (error) {
            console.error('Error generando reporte:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Error desconocido al generar el reporte'
            };
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generateReport,
        fetchDebtData,
        isGenerating,
        isLoading
    };
}