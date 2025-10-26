# Base de Datos – Logística SJB

- Todos los identificadores en `snake_case`.
- Las claves primarias comienzan con `id_` o `legajo_`.
- Claves foráneas prefijadas con `fk_`.
- Tipos `ENUM` para controlar estados fijos.
- Identidad generada automáticamente con `GENERATED ALWAYS AS IDENTITY`.

---

## Tipos ENUM

```sql
create type estado_pedido as enum (
  'en_preparacion',
  'cancelado',
  'en_camino',
  'en_sucursal',
  'entregado'
);

create type estado_envio as enum (
  'en_camino',
  'finalizado',
  'planificado'
);

create type cobro_contrato as enum (
  'mensual',
  'quincenal'
);

create type estado_contrato as enum (
  'vigente',
  'suspendido',
  'vencido'
);

create type estado_comercio as enum (
  'habilitado',
  'deshabilitado'
);

create type estado_pago as enum (
  'pagado',
  'pendiente',
  'vencido'
);
```

---

## Tabla `sucursal`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_sucursal | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| direccion_sucursal | text | not null |
| ciudad_sucursal | text | not null |

---

## Tabla `empleado`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| legajo_empleado | bigint | PK |
| nombre_empleado | text | not null |
| contrasena | text | not null |
| rol | text | not null |

---

## Tabla `chofer`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| legajo_empleado | bigint | PK, FK → empleado.legajo_empleado |

---

## Tabla `administrador`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| legajo_empleado | bigint | PK, FK → empleado.legajo_empleado |
| id_sucursal | bigint | not null, FK → sucursal.id_sucursal |

---

## Tabla `ruta`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_ruta | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| nombre_ruta | text | not null |

---

## Tabla `tramo`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| nro_tramo | bigint | PK |
| id_sucursal_origen | bigint | not null, FK → sucursal.id_sucursal |
| id_sucursal_destino | bigint | not null, FK → sucursal.id_sucursal |
| duracion_estimada_min | integer | not null, > 0 |
| distancia_km | numeric | not null, > 0 |

---

## Tabla `ruta_tramo`

Relación N:N entre `ruta` y `tramo`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_ruta | bigint | not null, FK → ruta.id_ruta |
| nro_tramo | bigint | not null, FK → tramo.nro_tramo |
| Primary Key | (id_ruta, nro_tramo) |

---

## Tabla `servicio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_servicio | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| nombre_servicio | text | not null |
| costo_servicio | numeric | not null, >= 0 |

---

## Tabla `cuenta_comercio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_cuenta_comercio | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| email_comercio | text | unique, not null |
| nombre_responsable | text | not null |
| contrasena_comercio | text | not null |

---

## Tabla `contrato`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_contrato | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| tipo_cobro | cobro_contrato | not null |
| descuento | numeric | not null, default 0, 0–100 |
| estado_contrato | estado_contrato | not null |
| fecha_fin_contrato | date | nullable |
| duracion_contrato_meses | integer | not null, CHECK (3, 6, 12) |

---

## Tabla `contrato_servicio`

Relación N:N entre `contrato` y `servicio`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_contrato | bigint | not null, FK → contrato.id_contrato |
| id_servicio | bigint | not null, FK → servicio.id_servicio |
| Primary Key | (id_contrato, id_servicio) |

---

## Tabla `comercio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_comercio | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| id_contrato | bigint | nullable, FK → contrato.id_contrato |
| id_cuenta_comercio | bigint | not null, FK → cuenta_comercio.id_cuenta_comercio |
| id_sucursal_origen | bigint | not null, FK → sucursal.id_sucursal |
| nombre_comercio | text | not null |
| domicilio_fiscal | text | not null |
| estado_comercio | estado_comercio | not null |

---

## Tabla `cliente_destinatario`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| dni_cliente | bigint | PK |
| telefono_cliente | text | nullable |
| nombre_cliente | text | not null |
| direccion_cliente | text | not null |
| email_cliente | text | unique, nullable |

---

## Tabla `factura`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_factura | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| id_comercio | bigint | not null, FK → comercio.id_comercio |
| nro_factura | text | not null |
| fecha_inicio | date | not null |
| importe_total | numeric | not null, >= 0 |
| fecha_fin | date | not null |
| fecha_emision | date | not null |
| nro_pago | text | nullable |
| estado_pago | estado_pago | not null |
| fecha_pago | date | nullable |

---

## Tabla `envio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_envio | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| legajo_empleado | bigint | not null, FK → chofer.legajo_empleado |
| id_ruta | bigint | not null, FK → ruta.id_ruta |
| id_sucursal_actual | bigint | not null, FK → sucursal.id_sucursal |
| estado_envio | estado_envio | not null |

---

## Tabla `pedido`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_pedido | bigint | PK, GENERATED ALWAYS AS IDENTITY |
| id_envio | bigint | nullable, FK → envio.id_envio |
| id_comercio | bigint | not null, FK → comercio.id_comercio |
| id_factura | bigint | nullable, FK → factura.id_factura |
| id_sucursal_destino | bigint | not null, FK → sucursal.id_sucursal |
| dni_cliente | bigint | not null, FK → cliente_destinatario.dni_cliente |
| estado_pedido | estado_pedido | not null |
| precio | numeric | not null, >= 0 |
| fecha_entrega | timestamptz | nullable |
| fecha_limite_entrega | timestamptz | nullable |

---

## Tabla `pedido_servicio`

Relación N:N entre `pedido` y `servicio`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_pedido | bigint | not null, FK → pedido.id_pedido |
| id_servicio | bigint | not null, FK → servicio.id_servicio |
| Primary Key | (id_pedido, id_servicio) |
