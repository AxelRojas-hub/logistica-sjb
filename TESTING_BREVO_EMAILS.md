# 🧪 Guía de Pruebas - Sistema de Alertas Brevo

## Configuración Rápida

El sistema ya está configurado. Solo necesitas saber:

- **Email de prueba**: `axelkevinagustinrojas@gmail.com`
- **CRON_SECRET**: `supersecret123456789abcdefghijk` (está en `.env.local`)

---

## 🚀 Pruebas Disponibles

### 1️⃣ **Prueba Rápida - Envío Directo a tu Email**

Endpoint: `POST /api/test-email-quick`

```bash
curl -X POST http://localhost:3000/api/test-email-quick \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "order-dispatched",
    "testEmail": "axelkevinagustinrojas@gmail.com"
  }'
```

**Tipos de email disponibles:**
- `order-dispatched` - Pedido en camino
- `order-delivered` - Pedido entregado
- `delivery-delay` - Retraso en entrega
- `invoice-generated` - Nueva factura
- `payment-overdue` - Pago vencido

---

### 2️⃣ **Verificación Manual de Retrasos**

Endpoint: `GET /api/brevo/check-delivery-delays`

```bash
curl http://localhost:3000/api/brevo/check-delivery-delays \
  -H "Authorization: Bearer supersecret123456789abcdefghijk"
```

---

### 3️⃣ **Verificación Manual de Pagos Vencidos**

Endpoint: `GET /api/brevo/check-payment-overdue`

```bash
curl http://localhost:3000/api/brevo/check-payment-overdue \
  -H "Authorization: Bearer supersecret123456789abcdefghijk"
```

---

## 📋 Ejemplos con CURL

### Enviar email de pedido despachado:
```bash
curl -X POST http://localhost:3000/api/test-email-quick \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "order-dispatched"
  }'
```

### Enviar email de retraso:
```bash
curl -X POST http://localhost:3000/api/test-email-quick \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "delivery-delay"
  }'
```

### Enviar email de factura:
```bash
curl -X POST http://localhost:3000/api/test-email-quick \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "invoice-generated"
  }'
```

### Enviar email de pago vencido:
```bash
curl -X POST http://localhost:3000/api/test-email-quick \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "payment-overdue"
  }'
```

---

## 📱 Con Postman

1. Crea una nueva solicitud **POST**
2. URL: `http://localhost:3000/api/test-email-quick`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "emailType": "order-dispatched",
  "testEmail": "axelkevinaggustinrojas@gmail.com"
}
```
5. Click "Send"

---

## ✅ Qué Esperar

Cuando ejecutes cualquiera de estas pruebas:

1. **Respuesta JSON exitosa** (200 OK):
```json
{
  "success": true,
  "emailType": "order-dispatched",
  "testEmail": "axelkevinagustinrojas@gmail.com",
  "subject": "Su pedido está en camino - Logística SJB",
  "message": "Email de prueba enviado exitosamente"
}
```

2. **Email en tu bandeja** dentro de 1-2 segundos con:
   - Logo de Logística SJB
   - Información del pedido/factura
   - Botones de acción
   - Branding corporativo

---

## 🔍 Verificación en Brevo

Para ver el histórico de emails enviados:

1. Accede a [Brevo Dashboard](https://app.brevo.com)
2. Ve a **Estadísticas → Emails Transaccionales**
3. Verifica que los emails aparezcan como "Enviados"

---

## 🐛 Troubleshooting

### "Error: API Key inválida"
- Verifica que `BREVO_API_KEY` está correcto en `.env.local`

### "Unauthorized cron request"
- Usa el CRON_SECRET correcto: `supersecret123456789abcdefghijk`

### "Email no llega"
- Revisa spam/promotions en Gmail
- Verifica que el email esté configurado en Brevo

### "Connection refused"
- Asegúrate de que Next.js está corriendo: `pnpm dev`

---

## 🔐 Notas Importantes

- Los endpoints de prueba (`/api/test-email-quick`) usan datos simulados
- Los endpoints de verificación (`/api/brevo/check-*`) consultan datos reales de la BD
- El CRON_SECRET es para autenticar Vercel Cron Jobs (en producción, debe ser más seguro)
- Todos los logs se ven en la consola de Next.js

