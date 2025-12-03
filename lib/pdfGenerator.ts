import jsPDF from 'jspdf';
import autoTable, { jsPDFConstructor } from 'jspdf-autotable';
import type { Factura } from './types';

interface ComercioInfo {
    nombreComercio: string;
    direccion: string;
    telefono?: string;
    email?: string;
    costoTransporte?: number;
    tarifario?: Array<{
        peso_hasta: number;
        precio_por_km: number;
    }>;
    sucursalOrigen?: {
        direccionSucursal: string;
        ciudadSucursal: string;
    };
    pedidos?: Array<{
        id_pedido: number;
        precio: number;
        estado_pedido: string;
        fecha_entrega?: string;
        fecha_limite_entrega?: string;
        sucursal?: {
            ciudad_sucursal: string;
        };
        pedido_servicio?: Array<{
            servicio?: {
                nombre_servicio: string;
                costo_servicio?: number;
            };
        }>;
    }>;
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
    comerciosDetalle?: Array<{
        nombreComercio: string;
        servicios: Array<{
            nombreServicio: string;
            cantidadPedidos: number;
            montoFacturado: number;
        }>;
    }>;
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
    doc.text('Período Facturado:', 20, 92);
    doc.text('Estado de Pago:', 20, 99);

    doc.setFont('helvetica', 'normal');
    doc.text(factura.nroFactura, 70, 85);
    doc.text(`${new Date(factura.fechaInicio).toLocaleDateString('es-AR')} - ${new Date(factura.fechaFin).toLocaleDateString('es-AR')}`, 70, 92);

    // Estado de pago con color
    const estadoColor = factura.estadoPago === 'pagado' ? '#10b981' :
        factura.estadoPago === 'pendiente' ? '#f59e0b' : '#ef4444';
    doc.setTextColor(estadoColor);
    doc.text(factura.estadoPago.toUpperCase(), 70, 99);

    // Información del comercio (lado derecho)
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL COMERCIO', 120, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${comercio.nombreComercio}`, 120, 92);
    doc.text(`Dirección: ${comercio.direccion}`, 120, 99);

    // Obtener datos de pedidos
    const pedidosData = (comercio as unknown as Record<string, unknown>)?.pedidos || [];
    const pedidosArray = Array.isArray(pedidosData) ? pedidosData : [];

    // Función para formatear estado
    const formatearEstado = (estado: string): string => {
        const estadoMap: Record<string, string> = {
            'en_camino': 'En camino',
            'cancelado': 'Cancelado',
            'en_sucursal': 'En sucursal',
            'entregado': 'Entregado',
            'en_preparacion': 'En preparación'
        };
        return estadoMap[estado.toLowerCase()] || estado;
    };

    let tableStartY = 115;

    // Resumen de servicios en la primera página
    if (pedidosArray.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text('RESUMEN DE SERVICIOS', 20, tableStartY);
        tableStartY += 10;

        // Contar servicios por tipo
        const serviciosMap = new Map<string, { cantidad: number; costoUnitario: number; monto: number }>();
        let montoTotal = 0;

        pedidosArray.forEach((pedido: Record<string, unknown>) => {
            const pedidoServicios = pedido.pedido_servicio as unknown;
            const precio = (pedido.precio as number) || 0;
            montoTotal += precio;

            if (Array.isArray(pedidoServicios) && pedidoServicios.length > 0) {
                const servicios = pedidoServicios as Array<Record<string, unknown>>;

                servicios.forEach((ps) => {
                    const servicio = ps.servicio as Record<string, unknown> | undefined;
                    const nombreServicio = (servicio?.nombre_servicio as string) || 'Transporte';
                    const costoServicio = Number(servicio?.costo_servicio) || 0;

                    const current = serviciosMap.get(nombreServicio) || { cantidad: 0, costoUnitario: costoServicio, monto: 0 };
                    current.cantidad += 1;
                    current.monto = current.cantidad * current.costoUnitario;
                    serviciosMap.set(nombreServicio, current);
                });
            } else {
                // Sin servicios específicos = Transporte
                const current = serviciosMap.get('Transporte') || { cantidad: 0, costoUnitario: 0, monto: 0 };
                current.cantidad += 1;

                // Usar el costo de transporte pasado en comercioInfo, o fallback a 0
                const costoTransporte = Number(comercio.costoTransporte) || 0;
                current.costoUnitario = costoTransporte;

                // El monto total de este servicio es cantidad * costo unitario
                current.monto = current.cantidad * current.costoUnitario;

                serviciosMap.set('Transporte', current);
            }
        });

        const serviciosTableData = Array.from(serviciosMap.entries()).map(([nombre, datos]) => [
            nombre,
            `$${datos.costoUnitario.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            datos.cantidad.toString(),
            `$${datos.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]);

        autoTable(doc, {
            startY: tableStartY,
            head: [['Servicio', 'Costo Unitario', 'Cantidad', 'Costo Total']],
            body: serviciosTableData,
            theme: 'striped',
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center' // Alinear headers al centro por defecto
            },
            bodyStyles: {
                fontSize: 8,
                textColor: [31, 41, 55]
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            columnStyles: {
                0: { cellWidth: 60, halign: 'left' },
                1: { cellWidth: 40, halign: 'right' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 40, halign: 'right' }
            },
            margin: { left: 20, right: 20 },
            didParseCell: function (data) {
                // Alinear headers específicamente
                if (data.section === 'head') {
                    if (data.column.index === 0) { // Servicio
                        data.cell.styles.halign = 'left';
                    } else if (data.column.index === 1) { // Costo Unitario
                        data.cell.styles.halign = 'right';
                    } else if (data.column.index === 2) { // Cantidad
                        data.cell.styles.halign = 'center';
                    } else if (data.column.index === 3) { // Costo Total
                        data.cell.styles.halign = 'right';
                    }
                }
            }
        });

        let finalY = doc.lastAutoTable.finalY || tableStartY + 40;
        finalY += 15;

        // Calcular subtotal de servicios
        let subtotalServicios = 0;
        serviciosMap.forEach(item => subtotalServicios += item.monto);

        const startYTotals = finalY;

        // Totals Section (Left Side)
        doc.setFontSize(10);
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Servicios:', 20, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(`$${subtotalServicios.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 90, finalY, { align: 'right' });

        finalY += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentColor);
        doc.text('TOTAL A PAGAR:', 20, finalY);
        doc.text(`$${montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 90, finalY, { align: 'right' });

        // Información de pago si está pagada (en la primera página)
        if (factura.estadoPago === 'pagado' && factura.fechaPago && factura.nroPago) {
            // Reset Y to start of totals block to align vertically
            let paymentY = startYTotals;

            doc.setTextColor(primaryColor);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text('INFORMACIÓN DE PAGO', 120, paymentY);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(`Fecha de Pago: ${new Date(factura.fechaPago).toLocaleDateString('es-AR')}`, 120, paymentY + 6);
            doc.text(`Número de Pago: ${factura.nroPago}`, 120, paymentY + 12);
        }

        // Tarifario en el pie de la primera página o en nueva página si no cabe
        if (comercio.tarifario && comercio.tarifario.length > 0) {
            const pageHeight = doc.internal.pageSize.height;
            // Calcular posición Y para el tarifario (encima del footer)
            // Footer ocupa ~25 unidades desde abajo
            // Tarifario necesitará espacio según cantidad de filas
            // Estimamos altura: header (10) + filas (5 * N)
            const tarifarioHeight = 15 + (comercio.tarifario.length * 6);

            // Opción 1: Anclar al fondo (estilo footer)
            let tarifarioY = pageHeight - 35 - tarifarioHeight;

            // Verificar si hay espacio suficiente en la primera página para anclar al fondo
            const hayEspacioAlFondo = tarifarioY > finalY + 10;

            if (!hayEspacioAlFondo) {
                // Opción 2: Si no cabe al fondo, probar justo después de los totales
                const tarifarioY_flotante = finalY + 10;
                const cabeFlotante = (tarifarioY_flotante + tarifarioHeight) < (pageHeight - 25);

                if (cabeFlotante) {
                    tarifarioY = tarifarioY_flotante;
                } else {
                    // Opción 3: Nueva página
                    doc.addPage();
                    tarifarioY = 20;
                }
            }

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor);
            doc.text('TARIFARIO VIGENTE', 20, tarifarioY);

            const tarifarioData = comercio.tarifario.map(t => [
                t.peso_hasta >= 99999 ? 'Más de 50 kg' : `${t.peso_hasta.toLocaleString('es-AR')} kg`,
                `$${t.precio_por_km.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
            ]);

            autoTable(doc, {
                startY: tarifarioY + 5,
                head: [['Peso Hasta', 'Precio por KM']],
                body: tarifarioData,
                theme: 'striped',
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: 255,
                    fontSize: 8,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 7,
                    textColor: [31, 41, 55],
                    halign: 'center'
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251]
                },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 40 }
                },
                margin: { left: 20 },
                tableWidth: 80 // Tabla compacta
            });
        }

        // Nueva página para detalle de pedidos
        if (pedidosArray.length > 0) {
            doc.addPage();

            // Título de detalle de pedidos
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(primaryColor);
            doc.text('DETALLE DE PEDIDOS', 20, 20);

            // Tabla de pedidos en la nueva página
            const pedidosTableData = pedidosArray.map((pedido: Record<string, unknown>) => {
                const sucursal = pedido.sucursal as Record<string, unknown> | undefined;
                const destino = (sucursal?.ciudad_sucursal as string) || 'N/A';
                const fechaEntrega = pedido.fecha_entrega as string | null;
                const fechaLimite = pedido.fecha_limite_entrega as string | null;
                const estado = (pedido.estado_pedido as string) || 'N/A';

                return [
                    (pedido.id_pedido as number).toString(),
                    formatearEstado(estado),
                    destino,
                    fechaEntrega ? new Date(fechaEntrega).toLocaleDateString('es-AR') : 'Entrega pendiente',
                    fechaLimite ? new Date(fechaLimite).toLocaleDateString('es-AR') : 'N/A',
                    (pedido.precio as number).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                ];
            });

            autoTable(doc, {
                startY: 30,
                head: [['ID Pedido', 'Estado', 'Destino', 'Fecha Entrega', 'Fecha Límite', '                            Monto']],
                body: pedidosTableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: 255,
                    fontSize: 8,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    fontSize: 7,
                    textColor: [31, 41, 55]
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251]
                },
                columnStyles: {
                    0: { cellWidth: 20, halign: 'center' },
                    1: { cellWidth: 28, halign: 'left' },
                    2: { cellWidth: 36, halign: 'left' },
                    3: { cellWidth: 31, halign: 'left' },
                    4: { cellWidth: 31, halign: 'left' },
                    5: { cellWidth: 34, halign: 'right' }
                },
                margin: { left: 20, right: 20 }
            });
        }
    }

    // Footer
    const pageHeightForFooter = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.text('Este documento ha sido generado automáticamente por el Sistema Logística SJB', 20, pageHeightForFooter - 20);

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
    doc.text(`Generado el: ${buenosAiresDate} a las ${buenosAiresTime}`, 20, pageHeightForFooter - 15);

    // Línea en el footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeightForFooter - 25, 190, pageHeightForFooter - 25);

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

    // Tabla de detalles por comercio y servicio
    if (data.comerciosDetalle && data.comerciosDetalle.length > 0) {
        // Verificar si hay espacio en la página actual, si no crear nueva página
        if (yPosition > pageHeight - 100) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('DETALLE POR COMERCIO Y SERVICIO', marginLeft, yPosition);
        yPosition += 10;

        const comerciosTableData: string[][] = [];

        data.comerciosDetalle?.forEach((comercio: { nombreComercio: string; servicios: Array<{ nombreServicio: string; cantidadPedidos: number; montoFacturado: number }> }) => {
            comercio.servicios.forEach((servicio: { nombreServicio: string; cantidadPedidos: number; montoFacturado: number }, index: number) => {
                comerciosTableData.push([
                    index === 0 ? comercio.nombreComercio : '',
                    servicio.nombreServicio,
                    servicio.cantidadPedidos.toLocaleString('es-AR'),
                    `$${servicio.montoFacturado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ]);
            });
        });

        autoTable(doc, {
            startY: yPosition,
            head: [['Comercio', 'Servicio', 'Cantidad', 'Monto Facturado']],
            body: comerciosTableData,
            theme: 'striped',
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'left'
            },
            bodyStyles: {
                fontSize: 7,
                textColor: [0, 0, 0]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 60 },
                1: { halign: 'left', cellWidth: 60 },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'right', cellWidth: 40 }
            },
            margin: { left: marginLeft, right: marginRight },
            didParseCell: function (data) {
                if (data.section === 'head' && data.column.index === 3) {
                    data.cell.styles.halign = 'right';
                }
            }
        });

        yPosition = (doc).lastAutoTable.finalY + 10;
    }

    // Footer
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

export function downloadBillingReportPDF(data: BillingReportData) {
    generateBillingReportPDF(data).then((doc) => {
        const fechaReporte = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
        const fileName = `Reporte_Facturacion_${data.sucursalAdministrador.ciudadSucursal}_${fechaReporte}.pdf`;
        doc.save(fileName);
    });
}