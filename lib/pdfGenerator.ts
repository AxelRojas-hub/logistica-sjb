import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Factura } from './types';

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

export async function generateInvoicePDF(factura: Factura, comercio: ComercioInfo) {
    const doc = new jsPDF();

    // Configuración de fuentes y colores
    const primaryColor = '#1f2937'; // gray-800
    const secondaryColor = '#6b7280'; // gray-500
    const accentColor = '#3b82f6'; // blue-500

    // Header con logo y título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('LOGÍSTICA SJB', 20, 25);

    // Subtítulo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor);
    doc.text('Sistema de Gestión Logística', 20, 32);

    // Información de la empresa
    doc.setFontSize(10);
    const sucursalText = comercio.sucursalOrigen
        ? `Sucursal ${comercio.sucursalOrigen.ciudadSucursal}`
        : 'Sucursal Comodoro Rivadavia';
    doc.text(sucursalText, 20, 40);
    doc.text('Teléfono: +54 351 123-4567', 20, 45);

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);

    // Título de factura
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('black');
    doc.text('FACTURA', 20, 70);

    // Información de la factura (lado izquierdo)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('Número de Factura:', 20, 85);
    doc.text('Fecha de Emisión:', 20, 92);
    doc.text('Período Facturado:', 20, 99);
    doc.text('Estado de Pago:', 20, 106);

    doc.setFont('helvetica', 'normal');
    doc.text(factura.nroFactura, 70, 85);
    doc.text(new Date(factura.fechaEmision).toLocaleDateString('es-AR'), 70, 92);
    doc.text(`${new Date(factura.fechaInicio).toLocaleDateString('es-AR')} - ${new Date(factura.fechaFin).toLocaleDateString('es-AR')}`, 70, 99);

    // Estado de pago con color
    const estadoColor = factura.estadoPago === 'pagado' ? '#10b981' :
        factura.estadoPago === 'pendiente' ? '#f59e0b' : '#ef4444';
    doc.setTextColor(estadoColor);
    doc.text(factura.estadoPago.toUpperCase(), 70, 106);

    // Información del comercio (lado derecho)
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL COMERCIO', 120, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${comercio.nombreComercio}`, 120, 92);
    doc.text(`Dirección: ${comercio.direccion}`, 120, 99);


    // Tabla de servicios/conceptos
    const tableStartY = 135;

    //TODO: TRAER DATOS DE LA BD ACA
    const tableData = [
        ['Servicios de Logística', 'Mes ' + new Date(factura.fechaInicio).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }), '1', `$${(factura.importeTotal * 0.8).toLocaleString('es-AR')}`, `$${(factura.importeTotal * 0.8).toLocaleString('es-AR')}`],
        ['Otros Servicios', 'Servicios adicionales', '1', `$${(factura.importeTotal * 0.2).toLocaleString('es-AR')}`, `$${(factura.importeTotal * 0.05).toLocaleString('es-AR')}`],
    ];

    autoTable(doc, {
        startY: tableStartY,
        head: [['Concepto', 'Descripción', 'Cantidad', 'Precio Unitario', 'Importe']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 0, 0], // blue-500
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [31, 41, 55] // gray-800
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251] // gray-50
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 60 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    });

    // Obtener la posición Y después de la tabla
    const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 60;

    // Total
    const totalsStartY = finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(accentColor);
    doc.text('TOTAL:', 140, totalsStartY);
    doc.text(`$${factura.importeTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 170, totalsStartY);

    // Información de pago si está pagada
    if (factura.estadoPago === 'pagado' && factura.fechaPago && factura.nroPago) {
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('INFORMACIÓN DE PAGO', 20, totalsStartY + 25);

        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha de Pago: ${new Date(factura.fechaPago).toLocaleDateString('es-AR')}`, 20, totalsStartY + 32);
        doc.text(`Número de Pago: ${factura.nroPago}`, 20, totalsStartY + 39);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.text('Este documento ha sido generado automáticamente por el Sistema Logística SJB', 20, pageHeight - 20);

    // Fecha y hora en zona horaria de Buenos Aires
    const now = new Date();
    const buenosAiresDate = now.toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const buenosAiresTime = now.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Formato 24 horas
    });
    doc.text(`Generado el: ${buenosAiresDate} a las ${buenosAiresTime}`, 20, pageHeight - 15);

    // Línea en el footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 25, 190, pageHeight - 25);

    return doc;
}

export function downloadInvoicePDF(factura: Factura, comercio: ComercioInfo) {
    generateInvoicePDF(factura, comercio).then((doc) => {
        const fileName = `Factura_${factura.nroFactura}_${comercio.nombreComercio.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
    });
}