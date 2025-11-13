import jsPDF from 'jspdf';
import autoTable, { jsPDFConstructor } from 'jspdf-autotable';
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

export async function generateInvoicePDF(factura: Factura, comercio: ComercioInfo) {
    const doc: jsPDFConstructor = new jsPDF();

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
    const finalY = doc.lastAutoTable.finalY || tableStartY + 60;

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

export async function generateDebtReportPDF(data: ReporteMorososData) {
    const doc: jsPDFConstructor = new jsPDF();

    // Configuración de fuentes y colores
    const primaryColor = '#1f2937'; // gray-800
    const secondaryColor = '#6b7280'; // gray-500

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

    // Información de la sucursal
    doc.setFontSize(10);
    doc.text(`Sucursal ${data.sucursalAdministrador.ciudadSucursal}`, 20, 40);
    doc.text('Teléfono: +54 351 123-4567', 20, 45);

    // Línea separadora
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 55, 190, 55);

    // Título del reporte
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('black');
    doc.text('REPORTE DE COMERCIOS MOROSOS', 20, 70);

    // Información del período - Columna Izquierda
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('black');
    doc.text('Período Analizado:', 20, 85);
    doc.text('Fecha del Reporte:', 20, 99);

    doc.setFont('helvetica', 'normal');
    doc.text(`${new Date(data.fechaInicio).toLocaleDateString('es-AR')} - ${new Date(data.fechaFin).toLocaleDateString('es-AR')}`, 20, 92);
    doc.text(new Date().toLocaleDateString('es-AR'), 20, 106);

    // Información del período - Columna Derecha
    doc.setFont('helvetica', 'bold');
    doc.text('Total Comercios Morosos:', 110, 85);
    doc.text('Monto Total Adeudado:', 110, 99);

    doc.setFont('helvetica', 'normal');
    doc.text(data.comerciosMorosos.length.toString(), 110, 92);
    doc.text(`$${data.totalDeudaGeneral.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 110, 106);

    let currentY = 110;

    // Crear tabla única con todos los comercios y sus facturas
    const tableData: string[][] = [];

    data.comerciosMorosos.forEach((comercio) => {
        comercio.facturas.forEach((factura, facturaIndex) => {
            const diasVencimiento = factura.diasVencimiento || 0;
            const estadoTexto = factura.estadoPago === 'vencido' ?
                `VENCIDA (${diasVencimiento} días)` : 'PENDIENTE';

            tableData.push([
                facturaIndex === 0 ? comercio.nombreComercio : '', // Solo mostrar el nombre en la primera factura del comercio
                new Date(factura.fechaEmision).toLocaleDateString('es-AR'),
                `${new Date(factura.fechaInicio).toLocaleDateString('es-AR')} - ${new Date(factura.fechaFin).toLocaleDateString('es-AR')}`,
                estadoTexto,
                `$${factura.importeTotal.toLocaleString('es-AR')}`
            ]);
        });
    });

    autoTable(doc, {
        startY: currentY,
        head: [['Comercio', 'Fecha Emisión', 'Período', 'Estado', 'Importe']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 0, 0], // negro
            textColor: [255, 255, 255], // blanco
            fontSize: 8,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [0, 0, 0] // negro
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240] // gris claro
        },
        columnStyles: {
            0: { cellWidth: 40, halign: 'left' },
            1: { cellWidth: 30, halign: 'left' },
            2: { cellWidth: 45, halign: 'left' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 20, right: 20 },
        didParseCell: function (data) {
            // Solo aplicar color negro a las celdas del cuerpo de la tabla, no al header
            if (data.section === 'body') {
                data.cell.styles.textColor = [0, 0, 0];
                if (data.column.index === 3) { // Columna de estado
                    data.cell.styles.fontStyle = 'bold';
                }
            }
            // Alinear los headers igual que el contenido
            if (data.section === 'head') {
                if (data.column.index === 3) { // Estado - centrado
                    data.cell.styles.halign = 'center';
                } else if (data.column.index === 4) { // Importe - derecha
                    data.cell.styles.halign = 'right';
                }
            }
        }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // Resumen final
    if (currentY > 220) {
        doc.addPage();
        currentY = 30;
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.text('Este reporte ha sido generado automáticamente por el Sistema Logística SJB', 20, pageHeight - 20);

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
        hour12: false
    });
    doc.text(`Generado el: ${buenosAiresDate} a las ${buenosAiresTime}`, 20, pageHeight - 15);

    // Línea en el footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 25, 190, pageHeight - 25);

    return doc;
}

export function downloadDebtReportPDF(data: ReporteMorososData) {
    generateDebtReportPDF(data).then((doc) => {
        const fechaReporte = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
        const fileName = `Reporte_Morosos_${data.sucursalAdministrador.ciudadSucursal}_${fechaReporte}.pdf`;
        doc.save(fileName);
    });
}

async function generateBillingReportPDF(data: BillingReportData): Promise<jsPDFConstructor> {
    const doc: jsPDFConstructor = new jsPDF();

    // Configuración de fuentes y colores
    const primaryColor = '#1f2937'; // gray-800
    const secondaryColor = '#6b7280'; // gray-500

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

    // Información de la sucursal
    doc.setFontSize(10);
    doc.text(`Sucursal ${data.sucursalAdministrador.ciudadSucursal}`, 20, 40);
    doc.text('Teléfono: +54 351 123-4567', 20, 45);

    // Línea separadora
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 55, 190, 55);

    // Título del reporte
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('black');
    doc.text('REPORTE DE FACTURACIÓN POR PERÍODO', 20, 70);

    // Información del período - Columna Izquierda
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('black');
    doc.text('Período Analizado:', 20, 85);
    doc.text('Fecha del Reporte:', 20, 99);

    doc.setFont('helvetica', 'normal');
    const fechaInicio = new Date(data.fechaInicio).toLocaleDateString('es-AR');
    const fechaFin = new Date(data.fechaFin).toLocaleDateString('es-AR');
    doc.text(`${fechaInicio} - ${fechaFin}`, 20, 92);
    doc.text(new Date().toLocaleDateString('es-AR'), 20, 106);

    // Información del período - Columna Derecha
    doc.setFont('helvetica', 'bold');
    doc.text('Sucursal:', 120, 85);
    doc.text('Dirección:', 120, 99);

    doc.setFont('helvetica', 'normal');
    doc.text(data.sucursalAdministrador.ciudadSucursal, 120, 92);
    doc.text(data.sucursalAdministrador.direccionSucursal, 120, 106);

    // Configuración de página
    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 20;
    const marginRight = 20;

    let yPosition = 120;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RESUMEN', marginLeft, yPosition);
    yPosition += 8;

    // Tabla de resumen
    const resumenData = [
        ['Estado', 'Cantidad de Facturas', 'Monto Total'],
        [
            'Pagadas',
            data.facturasPagadas.toLocaleString('es-AR'),
            `$${data.montoPagado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ],
        [
            'Pendientes',
            data.facturasPendientes.toLocaleString('es-AR'),
            `$${data.montoPendiente.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ],
        [
            'Vencidas',
            data.facturasVencidas.toLocaleString('es-AR'),
            `$${data.montoVencido.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
    ];

    autoTable(doc, {
        startY: yPosition,
        head: [resumenData[0]],
        body: resumenData.slice(1),
        theme: 'striped',
        headStyles: {
            fillColor: [0, 0, 0], // negro
            textColor: [255, 255, 255], // blanco
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0] // negro
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240] // gris claro
        },
        columnStyles: {
            0: { halign: 'left', cellWidth: 60 },
            1: { halign: 'center', cellWidth: 60 },
            2: { halign: 'right', cellWidth: 60 }
        },
        margin: { left: marginLeft, right: marginRight }
    });

    // Obtener la posición Y después de la tabla
    yPosition = (doc).lastAutoTable.finalY + 20;

    // Notas adicionales al final de la página, antes del footer
    const notasY = pageHeight - 55; // Posición fija cerca del footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('NOTAS:', marginLeft, notasY);
    doc.text('• Este reporte incluye todas las facturas del período seleccionado', marginLeft + 5, notasY + 8);
    doc.text('• Los montos están expresados en pesos argentinos', marginLeft + 5, notasY + 14);
    doc.text('• Las facturas vencidas requieren seguimiento para su cobro', marginLeft + 5, notasY + 20);

    // Footer
    const buenosAiresDate = new Date().toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const buenosAiresTime = new Date().toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    doc.text(`Generado el: ${buenosAiresDate} a las ${buenosAiresTime}`, marginLeft, pageHeight - 15);

    // Línea en el footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 25, 190, pageHeight - 25);

    return doc;
}

export function downloadBillingReportPDF(data: BillingReportData) {
    generateBillingReportPDF(data).then((doc) => {
        const fechaReporte = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
        const fileName = `Reporte_Facturacion_${data.sucursalAdministrador.ciudadSucursal}_${fechaReporte}.pdf`;
        doc.save(fileName);
    });
}