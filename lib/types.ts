export interface Pedido {
    id: string;
    destinatario: string;
    direccion: string;
    barrio: string;
    telefono: string;
    horaEstimada: string;
    localidad: string;
    estado: string;
    comercio: string;
    descripcion: string;
    peso: string;
    instruccionesEspeciales: string;
}

export interface Envio {
    id: string;
    pedidos: number;
    sucursalActual: string;
    ultimaActualizacion: string;
    duracionEstimada: string;
    distanciaTotal: string;
    estado: string;
    chofer: string;
}

export interface Comercio {
    id: string;
    nombre: string;
    direccionFiscal: string;
    email: string;
    estado: string;
    duracionContrato: string;
    servicios: string[];
    facturasVencidas: number;
    deudaTotal: number;
}

export interface Ruta {
    id: string;
    nombre: string;
    sucursales: string[];
    tiempoEstimado: string;
    segmentos: number;
}

export interface Sucursal {
    id: string;
    nombre: string;
    ubicacion: string;
    telefono: string;
    email: string;
}

export interface RutaActual {
    nombre: string;
    sucursalActual: string;
    sucursalSiguiente: string;
    totalSucursales: number;
    sucursales: Array<{
        nombre: string;
        hora: string;
        estado: "completado" | "actual" | "pendiente";
    }>;
    finalizacionEstimada: string;
}

export interface PedidoComercio {
    id: string;
    destinatario: string;
    direccion: string;
    barrio: string;
    telefono: string;
    estado: "pendiente" | "en_transito" | "entregado" | "cancelado";
    descripcion: string;
    peso: string;
    instruccionesEspeciales: string;
    creadoEn: string;
    entregaEstimada: string;
    montoTotal: number;
    servicios: string[];
    plazo: string;
}

export interface Factura {
    id: string;
    comercioId: string;
    monto: number;
    estado: "pagada" | "pendiente" | "vencida";
    fechaEmision: string;
    fechaVencimiento: string;
    descripcion: string;
    pedidos: string[];
    servicios: string[];
}

export interface Contrato {
    id: string;
    comercioId: string;
    estado: "activo" | "vencido" | "suspendido";
    fechaInicio: string;
    fechaFin: string;
    servicios: string[];
    cuotaMensual: number;
    limiteRetiros: number;
    limiteEntregas: number;
}

export interface Chofer {
    id: string;
    nombre: string;
    sucursal: string;
    sucursalId: string;
    estado: "disponible" | "ocupado" | "desconectado";
    telefono: string;
    capacidadVehiculo: string;
    rutaActual: string | null;
}

export interface ContextoAdmin {
    id: string;
    nombre: string;
    sucursal: string;
    sucursalId: string;
    rol: string;
}
export interface Servicio {
    id: string
    nombre: string
    descripcion: string
    cuotaMensual: number
}