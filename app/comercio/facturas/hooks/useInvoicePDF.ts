"use client"

import { useState } from 'react';
import { downloadInvoicePDF } from '@/lib/pdfGenerator';
import type { Factura } from '@/lib/types';
import { supabaseClient } from '@/lib/supabaseClient';

interface ComercioInfo {
    nombreComercio: string;
    direccion: string;
    telefono?: string;
    email?: string;
    sucursalOrigen?: {
        direccionSucursal: string;
        ciudadSucursal: string;
    };
}

export function useInvoicePDF() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async (factura: Factura, comercio: ComercioInfo) => {
        try {
            setIsGenerating(true);

            // Traer los pedidos asociados a esta factura
            const { data: pedidos } = await supabaseClient
                .from('pedido')
                .select(`
                    id_pedido,
                    precio,
                    estado_pedido,
                    fecha_entrega,
                    fecha_limite_entrega,
                    sucursal:id_sucursal_destino (
                        ciudad_sucursal
                    ),
                    pedido_servicio (
                        servicio (
                            nombre_servicio,
                            costo_servicio
                        )
                    )
                `)
                .eq('id_factura', factura.idFactura)
                .order('id_pedido', { ascending: true });

            // Traer el costo del servicio de transporte por defecto
            const { data: servicioTransporte } = await supabaseClient
                .from('servicio')
                .select('costo_servicio')
                .eq('nombre_servicio', 'Transporte')
                .single();

            const costoTransporte = servicioTransporte?.costo_servicio || 0;

            // Traer el tarifario
            const { data: tarifario } = await supabaseClient
                .from('tarifario')
                .select('peso_hasta, precio_por_km')
                .order('peso_hasta', { ascending: true });

            // Ampliar comercio con pedidos, costo de transporte y tarifario
            const comercioConPedidos = {
                ...comercio,
                pedidos: pedidos as unknown as Array<Record<string, unknown>> || [],
                costoTransporte,
                tarifario: tarifario || []
            };

            downloadInvoicePDF(factura, comercioConPedidos as ComercioInfo);
        } catch (error) {
            console.error('Error generando PDF:', error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generatePDF,
        isGenerating
    };
}