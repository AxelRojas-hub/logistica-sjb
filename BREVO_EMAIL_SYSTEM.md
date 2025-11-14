# Sistema de Alertas por Email con Brevo

## Descripción

Sistema de notificaciones automáticas por email integrado con Brevo para el seguimiento de pedidos, retrasos en entregas y recordatorios de pago.

## Características Implementadas

### 1. **Configuración de Brevo**
- **Archivo**: `lib/brevoConfig.ts`
- Configuración centralizada del SDK de Brevo
- Utiliza la clave API desde variables de entorno (`BREVO_API_KEY`)

### 2. **Plantillas de Email**
- **Archivo**: `lib/brevoTemplates.ts`
- Templates HTML con el logo de la empresa embebido
- Diseño responsivo y conciso
- Tipos de emails:
  - Pedido despachado (en_camino)
  - Pedido entregado
  - Retraso en entrega
  - Nueva factura generada
  - Recordatorio de pago vencido

### 3. **Servicio de Emails**
- **Archivo**: `lib/services/brevoService.ts`
- Funciones para envío de cada tipo de notificación
- Consultas automáticas a la base de datos para obtener datos
- Manejo de errores sin interrumpir flujos principales

### 4. **Triggers Automáticos**
- **Pedidos despachados**: Se activan en `app/api/envios/route.ts` cuando se cambia estado a "en_camino"
- **Cambios de estado**: Endpoint dedicado `app/api/pedidos/update-status/route.ts` para actualizaciones manuales

### 5. **Verificaciones Programadas**

#### Retrasos en Entregas
- **Endpoint**: `app/api/brevo/check-delivery-delays/route.ts`
- **Frecuencia**: Diario a las 9:00 AM
- **Función**: Verifica pedidos que superaron su `fecha_limite_entrega`

#### Recordatorios de Pago
- **Endpoint**: `app/api/brevo/check-payment-overdue/route.ts`
- **Frecuencia**: Semanal, los lunes a las 9:00 AM
- **Función**: Identifica facturas vencidas y envía recordatorios

### 6. **Configuración de Cron Jobs**
- **Archivo**: `vercel.json`
- Configurado para ejecutarse en Vercel
- Horarios en UTC (ajustados para Argentina)

## Variables de Entorno

```env
BREVO_API_KEY=tu_clave_api_de_brevo
CRON_SECRET=clave_secreta_para_cron_jobs
```

## Uso

### Envío Manual
```typescript
import { BrevoService } from '@/lib/services/brevoService'

// Notificar pedido despachado
await BrevoService.notifyOrderDispatched(idPedido)

// Notificar pedido entregado  
await BrevoService.notifyOrderDelivered(idPedido)

// Notificar retraso
await BrevoService.notifyDeliveryDelay(idPedido, diasRetraso)

// Notificar nueva factura
await BrevoService.notifyInvoiceGenerated(idFactura)

// Recordatorio de pago
await BrevoService.notifyPaymentOverdue(idFactura, diasVencido)
```

### Endpoints de Verificación

```bash
# Verificar retrasos manualmente
GET /api/brevo/check-delivery-delays
Authorization: Bearer CRON_SECRET

# Verificar pagos vencidos manualmente  
GET /api/brevo/check-payment-overdue
Authorization: Bearer CRON_SECRET
```

## Tipos de Email Enviados

1. **Seguimiento de Pedido**: Notifica cuando el pedido está en camino
2. **Demora en la Entrega**: Alerta automática por retrasos detectados  
3. **Facturación**: Aviso cuando se genera una nueva factura
4. **Vencimientos y Deudas**: Recordatorios de pagos vencidos antes de suspender servicios

## Notas Técnicas

- Los emails solo se envían si existe dirección de email válida
- Los errores de email no interrumpen los procesos principales de negocio
- Las verificaciones programadas manejan múltiples registros de forma eficiente
- Plantillas optimizadas para dispositivos móviles
- Logs detallados para monitoreo y troubleshooting