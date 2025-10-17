
// Enums

export type EstadoPedido =
    | "en_preparacion"
    | "cancelado"
    | "en_camino"
    | "en_sucursal"
    | "entregado";

export type EstadoEnvio = "en_camino" | "finalizado";

export type EstadoContrato = "vigente" | "suspendido" | "vencido";

export type EstadoComercio = "habilitado" | "deshabilitado";

export type EstadoPago = "pagado" | "pendiente" | "vencido";


// Tablas

export interface Sucursal {
    idSucursal: number;
    direccionSucursal: string;
    ciudadSucursal: string;
}

export interface Empleado {
    legajoEmpleado: number;
    nombreEmpleado: string;
    contrasena: string;
    rol: string;
}

export interface Chofer {
    legajoEmpleado: number;
}

export interface Administrador {
    legajoEmpleado: number;
    idSucursal: number;
}

export interface Ruta {
    idRuta: number;
    nombreRuta: string;
}

export interface Tramo {
    nroTramo: number;
    idSucursalOrigen: number;
    idSucursalDestino: number;
    duracionEstimadaMin: number;
    distanciaKm: number;
}

export interface RutaTramo {
    idRuta: number;
    nroTramo: number;
}

export interface Servicio {
    idServicio: number;
    nombreServicio: string;
    costoServicio: number;
}

export interface CuentaComercio {
    idCuentaComercio: number;
    emailComercio: string;
    nombreResponsable: string;
    contrasenaComercio: string;
}

export interface Contrato {
    idContrato: number;
    tipoCobro: string;
    descuento: number;
    estadoContrato: EstadoContrato;
    duracionContratoMeses: 3 | 6 | 12;
    fechaFinContrato: string | null;
}
export interface ContratoServicio {
    idContrato: number;
    idServicio: number;
}

export interface Comercio {
    idComercio: number;
    idContrato: number;
    idCuentaComercio: number;
    idSucursalOrigen: number;
    nombreComercio: string;
    domicilioFiscal: string;
    estadoComercio: EstadoComercio;
}

export interface ClienteDestinatario {
    dniCliente: number;
    telefonoCliente: string | null;
    nombreCliente: string;
    direccionCliente: string;
    emailCliente: string | null;
}

export interface Factura {
    idFactura: number;
    idComercio: number;
    nroFactura: string;
    fechaInicio: string;
    importeTotal: number;
    fechaFin: string;
    fechaEmision: string;
    nroPago: string | null;
    estadoPago: EstadoPago;
    fechaPago: string | null;
}

export interface Envio {
    idEnvio: number;
    legajoEmpleado: number;
    idRuta: number;
    idSucursalActual: number;
    estadoEnvio: EstadoEnvio;
}

export interface Pedido {
    idPedido: number;
    idEnvio: number | null;
    idComercio: number;
    idFactura: number | null;
    idSucursalDestino: number;
    dniCliente: number;
    estadoPedido: EstadoPedido;
    precio: number;
    fechaEntrega: string | null;
    fechaLimiteEntrega: string | null;
}

export interface PedidoServicio {
    idPedido: number;
    idServicio: number;
}
