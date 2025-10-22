# Admin

## app/admin/comercios

- [x] Obtener comercios desde la BD
- [x] Detalle del comercio
  - Revisar que informacion mostrar
- [ ] Historial de pedidos del comercio

## app/admin/envios

- [ ] Obtener envíos actuales desde la BD
- [ ] Corregir CrearEnvio

## app/admin/envios/crear

- [ ] Obtener pedidos desde la BD
- [x] Obtener choferes desde la BD

## app/admin/pedidos

- [ ] handleSelectOrder
- [ ] updateOrderStatus

# Chofer

## app/chofer/checkin/components

- [x] Obtener ruta actual desde la BD
- [x] Checkear como persistir los estados de checkin

## app/chofer/ruta

- [x] Obtener datos de ruta desde la BD
- [x] Asignar con datos de la session

# Comercio

## app/comercio/pedidos

- [ ] Obtener pedidos desde la BD
- [ ] Asignar con datos de la session
- [ ] Registrar/Cancelar pedido -> Checkear estado de contrato

## app/comercio/contrato

- [ ] Obtener contrato y servicios disponibles desde la BD

## app/comercio/facturas

- [ ] Obtener facturas desde la BD

# Fix

- [ ] Hay funcion duplicada para obtener la ruta con tramos, en /admin se usa getRutaConTramos y en /chofer se usa getRutaConTramo. Unificar.
