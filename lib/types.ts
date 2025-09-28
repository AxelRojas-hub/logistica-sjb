// Tipos compartidos
export interface Order {
    id: string;
    recipient: string;
    address: string;
    neighborhood: string;
    phone: string;
    estimatedTime: string;
    locality: string;
    status: string;
    business: string;
    description: string;
    weight: string;
    specialInstructions: string;
}

export interface Shipment {
    id: string;
    orders: number;
    currentBranch: string;
    lastUpdate: string;
    estimatedDuration: string;
    totalDistance: string;
    status: string;
    driver: string;
}

export interface Business {
    id: string;
    name: string;
    fiscalAddress: string;
    email: string;
    status: string;
    contractDuration: string;
    services: string[];
    pendingInvoices: number;
    totalDebt: number;
}

export interface Route {
    id: string;
    name: string;
    branches: string[];
    estimatedTime: string;
    segments: number;
}

export interface Branch {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
}

export interface CurrentRoute {
    name: string;
    currentBranch: string;
    nextBranch: string;
    totalBranches: number;
    branches: Array<{
        name: string;
        time: string;
        status: "completed" | "current" | "pending";
    }>;
    estimatedCompletion: string;
}

// Tipos específicos para Comercio
export interface BusinessOrder {
    id: string;
    recipient: string;
    address: string;
    neighborhood: string;
    phone: string;
    status: "pendiente" | "en_transito" | "entregado" | "cancelado";
    description: string;
    weight: string;
    specialInstructions: string;
    createdAt: string;
    estimatedDelivery: string;
    totalAmount: number;
}

export interface Invoice {
    id: string;
    businessId: string;
    amount: number;
    status: "pagada" | "pendiente" | "vencida";
    issuedDate: string;
    dueDate: string;
    description: string;
    orders: string[];
    services: string[];
}

export interface Contract {
    id: string;
    businessId: string;
    status: "activo" | "vencido" | "suspendido";
    startDate: string;
    endDate: string;
    services: string[];
    monthlyFee: number;
    pickupLimit: number;
    deliveryLimit: number;
}

export interface Driver {
    id: string;
    name: string;
    branch: string;
    branchId: string;
    status: "available" | "busy" | "offline";
    phone: string;
    vehicleCapacity: string;
    currentRoute: string | null;
}

export interface AdminContext {
    id: string;
    name: string;
    branch: string;
    branchId: string;
    role: string;
}
