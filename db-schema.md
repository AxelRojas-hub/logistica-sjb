# Base de Datos – Logística SJB

- Todos los identificadores en `snake_case`.
- Las claves primarias comienzan con `id_` o `legajo_`.
- Claves foráneas prefijadas con `fk_`.
- Tipos `ENUM` para controlar estados fijos.

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
  'finalizado'
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
| id_sucursal | bigint | PK |
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
| id_sucursal | bigint | FK → sucursal.id_sucursal |

---

## Tabla `ruta`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_ruta | bigint | PK |
| nombre_ruta | text | not null |

---

## Tabla `tramo`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| nro_tramo | bigint | PK |
| id_sucursal_origen | bigint | FK → sucursal.id_sucursal |
| id_sucursal_destino | bigint | FK → sucursal.id_sucursal |
| duracion_estimada_min | integer | > 0 |
| distancia_km | numeric(10,2) | > 0 |

---

## Tabla `ruta_tramo`

Relación N:N entre `ruta` y `tramo`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_ruta | bigint | FK → ruta.id_ruta |
| nro_tramo | bigint | FK → tramo.nro_tramo |
| Primary Key | (id_ruta, nro_tramo) |

---

## Tabla `servicio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_servicio | bigint | PK |
| nombre_servicio | text | not null |
| costo_servicio | numeric(12,2) | >= 0 |

---

## Tabla `cuenta_comercio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_cuenta_comercio | bigint | PK |
| email_comercio | text | unique, not null |
| nombre_responsable | text | not null |
| contrasena_comercio | text | not null |

---

## Tabla `contrato`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_contrato | bigint | PK |
| tipo_cobro | text | not null |
| descuento | numeric(5,2) | 0–100 |
| estado_contrato | estado_contrato | not null |
| duracion_contrato | interval |  |
| fecha_fin_contrato | date |  |

---

## Tabla `contrato_servicio`

Relación N:N entre `contrato` y `servicio`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_contrato | bigint | FK → contrato.id_contrato |
| id_servicio | bigint | FK → servicio.id_servicio |
| Primary Key | (id_contrato, id_servicio) |

---

## Tabla `comercio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_comercio | bigint | PK |
| id_contrato | bigint | FK → contrato.id_contrato |
| id_cuenta_comercio | bigint | FK → cuenta_comercio.id_cuenta_comercio |
| id_sucursal_origen | bigint | FK → sucursal.id_sucursal |
| nombre_comercio | text | not null |
| domicilio_fiscal | text | not null |
| estado_comercio | estado_comercio | not null |

---

## Tabla `cliente_destinatario`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| dni_cliente | bigint | PK |
| telefono_cliente | text |  |
| nombre_cliente | text | not null |
| direccion_cliente | text | not null |
| email_cliente | text | unique |

---

## Tabla `factura`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_factura | bigint | PK |
| id_comercio | bigint | FK → comercio.id_comercio |
| nro_factura | text | unique per comercio |
| fecha_inicio | date | not null |
| importe_total | numeric(14,2) | >= 0 |
| fecha_fin | date | not null |
| fecha_emision | date | not null |
| nro_pago | text |  |
| estado_pago | estado_pago | not null |
| fecha_pago | date |  |

---

## Tabla `envio`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_envio | bigint | PK |
| legajo_empleado | bigint | FK → chofer.legajo_empleado |
| id_ruta | bigint | FK → ruta.id_ruta |
| id_sucursal_actual | bigint | FK → sucursal.id_sucursal |
| estado_envio | estado_envio | not null |

---

## Tabla `pedido`

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_pedido | bigint | PK |
| id_envio | bigint | FK → envio.id_envio |
| id_comercio | bigint | FK → comercio.id_comercio |
| id_factura | bigint | FK → factura.id_factura |
| id_sucursal_destino | bigint | FK → sucursal.id_sucursal |
| dni_cliente | bigint | FK → cliente_destinatario.dni_cliente |
| estado_pedido | estado_pedido | not null |
| precio | numeric(12,2) | >= 0 |
| fecha_entrega | timestamptz |  |
| fecha_limite_entrega | timestamptz |  |

---

## Tabla `pedido_servicio`

Relación N:N entre `pedido` y `servicio`.

| Columna | Tipo | Restricciones |
|----------|------|----------------|
| id_pedido | bigint | FK → pedido.id_pedido |
| id_servicio | bigint | FK → servicio.id_servicio |
| Primary Key | (id_pedido, id_servicio) |

---

### Relaciones clave del dominio

- `sucursal` se vincula con `tramo`, `comercio` y `envio`.
- `empleado` se especializa en `chofer` y `administrador`.
- `contrato` agrupa servicios mediante `contrato_servicio`.
- `pedido` se asocia a `envio`, `factura`, `cliente_destinatario` y `comercio`.
- `pedido_servicio` y `ruta_tramo` son tablas intermedias N:N.

---