import { Ruta, Sucursal, ContextoAdmin, Servicio } from "./types";




export const rutas: Ruta[] = [
    {
        id: "RUT-001",
        nombre: "Buenos Aires - Córdoba",
        sucursales: ["Buenos Aires", "Rosario", "Villa María", "Córdoba"],
        tiempoEstimado: "8h 30m",
        segmentos: 4,
    },
    {
        id: "RUT-002",
        nombre: "Ruta Patagónica Norte",
        sucursales: ["Buenos Aires", "Bahía Blanca", "Viedma", "Trelew"],
        tiempoEstimado: "12h 45m",
        segmentos: 4,
    },
    {
        id: "RUT-003",
        nombre: "Ruta Litoral",
        sucursales: ["Buenos Aires", "Rosario", "Santa Fe", "Paraná", "Corrientes"],
        tiempoEstimado: "11h 00m",
        segmentos: 5,
    },
    {
        id: "RUT-004",
        nombre: "Ruta Noroeste",
        sucursales: ["Córdoba", "Santiago del Estero", "Tucumán", "Salta", "Jujuy"],
        tiempoEstimado: "14h 20m",
        segmentos: 5,
    },
    {
        id: "RUT-005",
        nombre: "Ruta Patagónica Sur",
        sucursales: ["Trelew", "Comodoro Rivadavia", "Río Gallegos", "Ushuaia"],
        tiempoEstimado: "16h 30m",
        segmentos: 4,
    },
    {
        id: "RUT-006",
        nombre: "Ruta Cuyo",
        sucursales: ["Buenos Aires", "San Luis", "Mendoza", "San Juan"],
        tiempoEstimado: "13h 20m",
        segmentos: 4,
    },
    {
        id: "RUT-007",
        nombre: "Ruta Atlántica",
        sucursales: ["Buenos Aires", "La Plata", "Dolores", "Mar del Plata"],
        tiempoEstimado: "6h 40m",
        segmentos: 4,
    },
    {
        id: "RUT-008",
        nombre: "Ruta NEA",
        sucursales: ["Santa Fe", "Reconquista", "Resistencia", "Formosa"],
        tiempoEstimado: "10h 50m",
        segmentos: 4,
    },
    {
        id: "RUT-009",
        nombre: "Ruta Andina Sur",
        sucursales: ["Neuquén", "General Roca", "San Carlos de Bariloche", "Esquel"],
        tiempoEstimado: "12h 10m",
        segmentos: 4,
    },
];

export const sucursales: Sucursal[] = [
    { id: "SUC-BA", nombre: "Sucursal Buenos Aires", ubicacion: "Av. 9 de Julio 1500, CABA", telefono: "+54 11 4567-8900", email: "buenosaires@logisticasjb.com" },
    { id: "SUC-ROS", nombre: "Sucursal Rosario", ubicacion: "Bv. Oroño 800, Rosario, Santa Fe", telefono: "+54 341 456-7890", email: "rosario@logisticasjb.com" },
    { id: "SUC-VM", nombre: "Sucursal Villa María", ubicacion: "Av. Sabattini 1200, Villa María", telefono: "+54 353 461-1111", email: "villamaria@logisticasjb.com" },
    { id: "SUC-CBA", nombre: "Sucursal Córdoba", ubicacion: "Av. Colón 1000, Córdoba", telefono: "+54 351 468-0000", email: "cordoba@logisticasjb.com" },
    { id: "SUC-BB", nombre: "Sucursal Bahía Blanca", ubicacion: "Av. Alem 900, Bahía Blanca", telefono: "+54 291 455-0000", email: "bahiablanca@logisticasjb.com" },
    { id: "SUC-VID", nombre: "Sucursal Viedma", ubicacion: "Av. 25 de Mayo 300, Viedma", telefono: "+54 2920 423-000", email: "viedma@logisticasjb.com" },
    { id: "SUC-TR", nombre: "Sucursal Trelew", ubicacion: "Av. Fontana 400, Trelew", telefono: "+54 280 443-0000", email: "trelew@logisticasjb.com" },
    { id: "SUC-CMD", nombre: "Sucursal Comodoro Rivadavia", ubicacion: "Rivadavia 1200, Comodoro", telefono: "+54 297 447-0000", email: "comodoro@logisticasjb.com" },
    { id: "SUC-RG", nombre: "Sucursal Río Gallegos", ubicacion: "Av. Kirchner 700, Río Gallegos", telefono: "+54 2966 442-000", email: "riogallegos@logisticasjb.com" },
    { id: "SUC-USH", nombre: "Sucursal Ushuaia", ubicacion: "San Martín 500, Ushuaia", telefono: "+54 2901 422-000", email: "ushuaia@logisticasjb.com" },
    { id: "SUC-SF", nombre: "Sucursal Santa Fe", ubicacion: "Bv. Gálvez 1500, Santa Fe", telefono: "+54 342 455-0000", email: "santafe@logisticasjb.com" },
    { id: "SUC-PNA", nombre: "Sucursal Paraná", ubicacion: "Av. Almafuerte 1200, Paraná", telefono: "+54 343 420-0000", email: "parana@logisticasjb.com" },
    { id: "SUC-CRR", nombre: "Sucursal Corrientes", ubicacion: "Av. 3 de Abril 800, Corrientes", telefono: "+54 379 443-0000", email: "corrientes@logisticasjb.com" },
    { id: "SUC-SDE", nombre: "Sucursal Santiago del Estero", ubicacion: "Av. Belgrano 900, Sgo. del Estero", telefono: "+54 385 421-0000", email: "santiago@logisticasjb.com" },
    { id: "SUC-TUC", nombre: "Sucursal Tucumán", ubicacion: "Av. Sarmiento 700, S. M. de Tucumán", telefono: "+54 381 430-0000", email: "tucuman@logisticasjb.com" },
    { id: "SUC-SAL", nombre: "Sucursal Salta", ubicacion: "Av. San Martín 900, Salta", telefono: "+54 387 421-0000", email: "salta@logisticasjb.com" },
    { id: "SUC-JUY", nombre: "Sucursal Jujuy", ubicacion: "Av. Hipólito Yrigoyen 600, S. S. de Jujuy", telefono: "+54 388 423-0000", email: "jujuy@logisticasjb.com" },
    { id: "SUC-SLU", nombre: "Sucursal San Luis", ubicacion: "Av. Illia 500, San Luis", telefono: "+54 266 442-0000", email: "sanluis@logisticasjb.com" },
    { id: "SUC-MZA", nombre: "Sucursal Mendoza", ubicacion: "Av. San Martín 1200, Mendoza", telefono: "+54 261 423-0000", email: "mendoza@logisticasjb.com" },
    { id: "SUC-SJ", nombre: "Sucursal San Juan", ubicacion: "Av. Libertador 900, San Juan", telefono: "+54 264 422-0000", email: "sanjuan@logisticasjb.com" },
    { id: "SUC-LP", nombre: "Sucursal La Plata", ubicacion: "Av. 7 800, La Plata", telefono: "+54 221 422-0000", email: "laplata@logisticasjb.com" },
    { id: "SUC-MDP", nombre: "Sucursal Mar del Plata", ubicacion: "Av. Luro 2300, Mar del Plata", telefono: "+54 223 493-0000", email: "mdp@logisticasjb.com" },
    { id: "SUC-RES", nombre: "Sucursal Resistencia", ubicacion: "Av. 9 de Julio 500, Resistencia", telefono: "+54 362 442-0000", email: "resistencia@logisticasjb.com" },
    { id: "SUC-FOR", nombre: "Sucursal Formosa", ubicacion: "Av. 25 de Mayo 600, Formosa", telefono: "+54 370 442-0000", email: "formosa@logisticasjb.com" },
    { id: "SUC-NQN", nombre: "Sucursal Neuquén", ubicacion: "Av. Argentina 200, Neuquén", telefono: "+54 299 442-0000", email: "neuquen@logisticasjb.com" },
    { id: "SUC-GRO", nombre: "Sucursal General Roca", ubicacion: "Av. Roca 400, General Roca", telefono: "+54 298 443-0000", email: "gralroca@logisticasjb.com" },
    { id: "SUC-BRC", nombre: "Sucursal San Carlos de Bariloche", ubicacion: "Mitre 600, Bariloche", telefono: "+54 294 442-0000", email: "bariloche@logisticasjb.com" },
    { id: "SUC-ESQ", nombre: "Sucursal Esquel", ubicacion: "Av. Ameghino 700, Esquel", telefono: "+54 2945 452-000", email: "esquel@logisticasjb.com" },
    { id: "SUC-REC", nombre: "Sucursal Reconquista", ubicacion: "Bv. Hipólito Yrigoyen 600, Reconquista", telefono: "+54 3482 422-000", email: "reconquista@logisticasjb.com" },
];


// Destinos adicionales para el selector
export const destinos = [
    { id: "buenos-aires", nombre: "Buenos Aires", province: "CABA", orderCount: 5 },
    { id: "rosario", nombre: "Rosario", province: "Santa Fe", orderCount: 4 },
    { id: "cordoba", nombre: "Córdoba", province: "Córdoba", orderCount: 4 },
    { id: "mendoza", nombre: "Mendoza", province: "Mendoza", orderCount: 3 },
    { id: "salta", nombre: "Salta", province: "Salta", orderCount: 1 },
    { id: "tucuman", nombre: "Tucumán", province: "Tucumán", orderCount: 2 },
    { id: "santa-fe", nombre: "Santa Fe", province: "Santa Fe", orderCount: 2 },
    { id: "la-plata", nombre: "La Plata", province: "Buenos Aires", orderCount: 2 },
];

export const serviciosDisponibles: Servicio[] = [
    {
        id: "SRV-001",
        nombre: "Retiro a domicilio",
        descripcion: "Retiro de productos en tu comercio",
        cuotaMensual: 5000,
    },
    {
        id: "SRV-002",
        nombre: "Transporte",
        descripcion: "Servicio de transporte a destino",
        cuotaMensual: 8000,
    },
    {
        id: "SRV-003",
        nombre: "Embalaje",
        descripcion: "Embalaje profesional de productos",
        cuotaMensual: 3000,
    },
    {
        id: "SRV-004",
        nombre: "Seguro",
        descripcion: "Seguro contra daños y pérdidas",
        cuotaMensual: 2000,
    },
    {
        id: "SRV-005",
        nombre: "Tracking SMS",
        descripcion: "Notificaciones SMS de seguimiento",
        cuotaMensual: 1500,
    },
];


// Mock administrator context (logged-in admin)
export const mockAdmin: ContextoAdmin = {
    id: "ADM-001",
    nombre: "Juan Pérez",
    sucursal: "Buenos Aires",
    sucursalId: "SUC-BA",
    rol: "Administrator",
};
