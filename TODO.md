# Admin

## app/admin/comercios

- [x] Obtener comercios desde la BD
- [x] Detalle del comercio
  - Revisar que informacion mostrar
- [x] Historial de pedidos del comercio

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

- [x] Obtener contrato disponibles desde la BD
- [x] Obtener servicios disponibles desde la BD
- [x] Crear formulario de nuevo contrato
- [ ] Implementar pasarela de MercadoPago en formulario de creación de contrato
- [ ] Condicionar creación de contrato a respuesta exitosa de MercadoPago
- [ ] Implementar botón "Renovar Contrato" en ContratoCard
- [ ] Implementar botón "Modificar Plan" en ContratoCard

## app/comercio/facturas

- [ ] Obtener facturas desde la BD

---

# Fix

- [ ] Hay funcion duplicada para obtener la ruta con tramos, en /admin se usa getRutaConTramos y en /chofer se usa getRutaConTramo. Unificar.
