"use client"

import { useState } from 'react';
import { downloadInvoicePDF } from '@/lib/pdfGenerator';
import type { Factura } from '@/lib/types';

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
            downloadInvoicePDF(factura, comercio);
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