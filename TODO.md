# Admin

## app/admin/comercios

- [x] Obtener comercios desde la BD
- [x] Detalle del comercio
  - Revisar que informacion mostrar
- [ ] Historial de pedidos del comercio [Fiorella]

## app/admin/envios

- [ ] Obtener envíos actuales desde la BD
- [ ] Corregir CrearEnvio

## app/admin/envios/crear

- [ ] Obtener pedidos desde la BD
- [x] Obtener choferes desde la BD

## app/admin/pedidos

- [ ] handleSelectOrder
- [ ] updateOrderStatus

# Comercio

## app/comercio/pedidos

- [x] Obtener pedidos desde la BD
- [x] Asignar con datos de la session
- [ ] Registrar pedido -> Hace falta checkear estado de contrato para hacer esta tarea
- [ ] Cancelar pedido -> Hace falta checkear estado de contrato para hacer esta tarea

## app/comercio/contrato

- [ ] Obtener contrato disponibles desde la BD
- [ ] Obtener servicios disponibles desde la BD

## app/comercio/facturas

- [ ] Obtener facturas desde la BD

# Fix

- [ ] Hay funcion duplicada para obtener la ruta con tramos, en /admin se usa getRutaConTramos y en /chofer se usa getRutaConTramo. Unificar.

---

# Terminado

## Chofer

### app/chofer/checkin/components

- [x] Obtener ruta actual desde la BD
- [x] Checkear como persistir los estados de checkin

### app/chofer/ruta

- [x] Obtener datos de ruta desde la BD
- [x] Asignar con datos de la session
