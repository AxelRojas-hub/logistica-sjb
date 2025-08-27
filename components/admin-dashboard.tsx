"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Truck,
  Building2,
  FileText,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Navigation,
  CheckCircle,
  Route,
  LucideTriangle as ExclamationTriangle,
  PackageCheck,
} from "lucide-react"

// Tipos
interface Order {
  id: string;
  recipient: string;
  address: string;
  neighborhood: string;
  phone: string;
  estimatedTime: string;
  status: string;
  business: string;
  description: string;
  weight: string;
  specialInstructions: string;
}

// Mock data
const mockShipments = [
  {
    id: "ENV-001",
    orders: 12,
    currentBranch: "Sucursal Centro",
    lastUpdate: "14:30",
    estimatedDuration: "4h 30m",
    totalDistance: "145 km",
    status: "En ruta",
    driver: "Carlos Mendez",
  },
  {
    id: "ENV-002",
    orders: 8,
    currentBranch: "Sucursal Norte",
    lastUpdate: "13:45",
    estimatedDuration: "2h 15m",
    totalDistance: "89 km",
    status: "En sucursal",
    driver: "Ana Rodriguez",
  },
  {
    id: "ENV-003",
    orders: 15,
    currentBranch: "Sucursal Sur",
    lastUpdate: "15:20",
    estimatedDuration: "6h 10m",
    totalDistance: "203 km",
    status: "Demorado",
    driver: "Luis Garcia",
  },
]

const mockBusinesses = [
  {
    id: "COM-001",
    name: "TechStore SA",
    fiscalAddress: "Av. Libertador 1234, CABA",
    email: "contacto@techstore.com",
    status: "Habilitado",
    contractDuration: "12 meses",
    services: ["Retiro a domicilio", "Embalaje", "Transporte"],
    pendingInvoices: 0,
    totalDebt: 0,
  },
  {
    id: "COM-002",
    name: "Fashion Boutique",
    fiscalAddress: "Calle Florida 567, CABA",
    email: "info@fashionboutique.com",
    status: "Deshabilitado",
    contractDuration: "6 meses",
    services: ["Transporte"],
    pendingInvoices: 2,
    totalDebt: 45000,
  },
  {
    id: "COM-003",
    name: "Librería El Saber",
    fiscalAddress: "Av. Corrientes 890, CABA",
    email: "ventas@elsaber.com",
    status: "Habilitado",
    contractDuration: "3 meses",
    services: ["Retiro a domicilio", "Transporte"],
    pendingInvoices: 1,
    totalDebt: 12500,
  },
]

const mockRoutes = [
  {
    id: "RUT-001",
    name: "Ruta Buenos Aires - Córdoba",
    branches: ["Buenos Aires", "Rosario", "Villa María", "Córdoba"],
    estimatedTime: "8h 30m",
    segments: 4,
  },
  {
    id: "RUT-002",
    name: "Ruta Patagónica Norte",
    branches: ["Buenos Aires", "Bahía Blanca", "Viedma", "Trelew"],
    estimatedTime: "12h 45m",
    segments: 4,
  },
  {
    id: "RUT-003",
    name: "Ruta Litoral",
    branches: ["Buenos Aires", "Santa Fe", "Paraná", "Corrientes"],
    estimatedTime: "10h 15m",
    segments: 4,
  },
  {
    id: "RUT-004",
    name: "Ruta Noroeste",
    branches: ["Córdoba", "Santiago del Estero", "Tucumán", "Salta", "Jujuy"],
    estimatedTime: "14h 20m",
    segments: 5,
  },
  {
    id: "RUT-005",
    name: "Ruta Patagónica Sur",
    branches: ["Trelew", "Comodoro Rivadavia", "Río Gallegos", "Ushuaia"],
    estimatedTime: "16h 30m",
    segments: 4,
  },
]

const mockBranches = [
  {
    id: "SUC-001",
    name: "Sucursal Centro",
    location: "Av. 9 de Julio 1500, CABA",
    phone: "+54 11 4567-8901",
    email: "centro@logisticasjb.com",
  },
  {
    id: "SUC-002",
    name: "Sucursal Norte",
    location: "Av. Cabildo 2300, CABA",
    phone: "+54 11 4567-8902",
    email: "norte@logisticasjb.com",
  },
  {
    id: "SUC-003",
    name: "Sucursal Sur",
    location: "Av. Rivadavia 8900, CABA",
    phone: "+54 11 4567-8903",
    email: "sur@logisticasjb.com",
  },
]

const mockDriverOrders = [
  {
    id: "PED-001",
    recipient: "Juan Pérez",
    address: "Av. Corrientes 1234",
    neighborhood: "Balvanera",
    phone: "+54 11 1234-5678",
    estimatedTime: "30 min",
    status: "pendiente",
    business: "TechStore SA",
    description: "Notebook Lenovo ThinkPad E14",
    weight: "2.5 kg",
    specialInstructions: "Entregar en portería, timbre 4B",
  },
  {
    id: "PED-004",
    recipient: "Ana Martínez",
    address: "Av. Rivadavia 2345",
    neighborhood: "Balvanera",
    phone: "+54 11 4567-8901",
    estimatedTime: "50 min",
    status: "pendiente",
    business: "TechStore SA",
    description: "Mouse inalámbrico y teclado",
    weight: "1.1 kg",
    specialInstructions: "Dejar con portero si no está",
  },
  {
    id: "PED-002",
    recipient: "María González",
    address: "Calle Florida 567",
    neighborhood: "Microcentro",
    phone: "+54 11 2345-6789",
    estimatedTime: "45 min",
    status: "pendiente",
    business: "Fashion Boutique",
    description: "Vestido de fiesta talla M",
    weight: "0.8 kg",
    specialInstructions: "Llamar antes de llegar",
  },
  {
    id: "PED-005",
    recipient: "Luis Rodríguez",
    address: "Av. Callao 1678",
    neighborhood: "Recoleta",
    phone: "+54 11 5678-9012",
    estimatedTime: "1h 5min",
    status: "pendiente",
    business: "Fashion Boutique",
    description: "Zapatos deportivos talla 42",
    weight: "1.5 kg",
    specialInstructions: "Probar antes de entregar",
  },
  {
    id: "PED-003",
    recipient: "Carlos López",
    address: "Av. Santa Fe 890",
    neighborhood: "Retiro",
    phone: "+54 11 3456-7890",
    estimatedTime: "1h 15min",
    status: "pendiente",
    business: "Librería El Saber",
    description: "Pack de libros universitarios",
    weight: "3.2 kg",
    specialInstructions: "Entregar solo al destinatario",
  },
  {
    id: "PED-006",
    recipient: "Pedro Fernández",
    address: "Av. Cabildo 3456",
    neighborhood: "Belgrano",
    phone: "+54 11 6789-0123",
    estimatedTime: "1h 30min",
    status: "entregado",
    business: "TechStore SA",
    description: "Tablet Samsung Galaxy",
    weight: "0.6 kg",
    specialInstructions: "Entregado a portería",
  },
]

const mockCurrentRoute = {
  id: "RUT-001",
  name: "Ruta Buenos Aires - Córdoba",
  totalBranches: 4,
  currentBranch: "Rosario",
  nextBranch: "Villa María",
  branches: [
    { name: "Buenos Aires", status: "completed", time: "08:00" },
    { name: "Rosario", status: "current", time: "12:30" },
    { name: "Villa María", status: "pending", time: "15:00" },
    { name: "Córdoba", status: "pending", time: "17:30" },
  ],
  estimatedCompletion: "18:00",
}

export function AdminDashboard() {
  const [activeActor, setActiveActor] = useState("administrador")
  const [activeSection, setActiveSection] = useState("")
  const [activeDriverSection, setActiveDriverSection] = useState("")
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null)
  const [deliveryData, setDeliveryData] = useState({ dni: "", receiverName: "" })
  const [orders, setOrders] = useState(mockDriverOrders)

  const handleDelivery = (orderId: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "entregado" } : order)))
    setDeliveryOrder(null)
    setDeliveryData({ dni: "", receiverName: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ruta":
        return "bg-blue-100 text-blue-800"
      case "En sucursal":
        return "bg-green-100 text-green-800"
      case "Demorado":
        return "bg-red-100 text-red-800"
      case "Habilitado":
        return "bg-green-100 text-green-800"
      case "Deshabilitado":
        return "bg-red-100 text-red-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      case "fallido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFilteredOrders = () => {
    let filtered = orders

    if (neighborhoodFilter) {
      filtered = filtered.filter((order) => order.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase()))
    }

    return filtered.sort((a, b) => {
      if (a.status === "entregado" && b.status !== "entregado") return 1
      if (b.status === "entregado" && a.status !== "entregado") return -1
      return a.neighborhood.localeCompare(b.neighborhood)
    })
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Actor Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveActor("administrador")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeActor === "administrador"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Administrador
              </button>
              <button
                onClick={() => setActiveActor("comercio")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeActor === "comercio"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Comercio
              </button>
              <button
                onClick={() => setActiveActor("chofer")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeActor === "chofer"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Chofer
              </button>
            </div>
          </div>
        </div>

        {/* Admin Content */}
        {activeActor === "administrador" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-2 text-gray-600">Selecciona una opción para continuar</p>
            </div>

            {/* Menu Inicial - Solo mostrar si no hay sección activa */}
            {!activeSection && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
                  onClick={() => setActiveSection("envios")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Truck className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Envíos</h3>
                    <p className="text-gray-600">Gestiona y monitorea todos los envíos</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
                  onClick={() => setActiveSection("comercios")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Building2 className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Comercios</h3>
                    <p className="text-gray-600">Administra comercios y contratos</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
                  onClick={() => setActiveSection("reportes")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <FileText className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reportes</h3>
                    <p className="text-gray-600">Genera y visualiza reportes</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contenido de secciones - Solo mostrar si hay una sección activa */}
            {activeSection && (
              <div className="space-y-6">
                {/* Botón para volver al menú principal */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("")}
                    className="flex items-center gap-2"
                  >
                    ← Volver al menú principal
                  </Button>
                </div>

                {/* Envíos Section */}
                {activeSection === "envios" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Gestión de Envíos</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtrar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Buscar
                        </Button>
                      </div>
                    </div>

                    {/* Shipments Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {mockShipments.map((shipment) => (
                        <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{shipment.id}</CardTitle>
                              <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                            </div>
                            <CardDescription>Chofer: {shipment.driver}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span>{shipment.orders} pedidos</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{shipment.currentBranch}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Actualizado: {shipment.lastUpdate}</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between text-sm">
                                <span>Duración: {shipment.estimatedDuration}</span>
                                <span>Distancia: {shipment.totalDistance}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Routes and Branches */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Catálogo de Rutas</CardTitle>
                          <CardDescription>Rutas predefinidas disponibles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {mockRoutes.map((route) => (
                            <div key={route.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{route.name}</h4>
                                <span className="text-sm text-gray-500">{route.estimatedTime}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{route.branches.join(" → ")}</p>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{route.segments} segmentos</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Catálogo de Sucursales</CardTitle>
                          <CardDescription>Sucursales disponibles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {mockBranches.map((branch) => (
                            <div key={branch.id} className="border rounded-lg p-3">
                              <h4 className="font-medium mb-1">{branch.name}</h4>
                              <p className="text-sm text-gray-600 mb-1">{branch.location}</p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{branch.phone}</span>
                                <span>{branch.email}</span>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Comercios Section */}
                {activeSection === "comercios" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Gestión de Comercios</h2>
                      <div className="flex gap-2">
                        <Input placeholder="Buscar comercio..." className="w-64" />
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {mockBusinesses.map((business) => (
                        <Card key={business.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{business.name}</CardTitle>
                                <CardDescription>{business.email}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(business.status)}>{business.status}</Badge>
                                {business.pendingInvoices > 0 && (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {business.pendingInvoices} facturas pendientes
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Información General</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="text-gray-500">Dirección:</span> {business.fiscalAddress}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Contrato:</span> {business.contractDuration}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Servicios:</span> {business.services.join(", ")}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Estado Financiero</h4>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="text-gray-500">Facturas pendientes:</span> {business.pendingInvoices}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">Deuda total:</span> $
                                    {business.totalDebt.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Historial Pedidos
                              </Button>
                              <Button variant="outline" size="sm">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Historial Facturación
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reportes Section */}
                {activeSection === "reportes" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Reportes y Análisis</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Reporte de Comercios Morosos</CardTitle>
                          <CardDescription>Genera un reporte con comercios que tienen facturas vencidas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Filtros</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar período" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">Últimos 30 días</SelectItem>
                                <SelectItem value="60">Últimos 60 días</SelectItem>
                                <SelectItem value="90">Últimos 90 días</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Generar Reporte
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Reporte de Facturación por Período</CardTitle>
                          <CardDescription>
                            Genera un reporte de facturación en un rango de fechas específico
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Fecha Inicio</label>
                              <Input type="date" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Fecha Fin</label>
                              <Input type="date" />
                            </div>
                          </div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Estado de facturas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="paid">Pagadas</SelectItem>
                              <SelectItem value="pending">Pendientes</SelectItem>
                              <SelectItem value="overdue">Vencidas</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Generar Reporte
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Envíos Activos</p>
                              <p className="text-2xl font-bold text-gray-900">24</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Comercios Activos</p>
                              <p className="text-2xl font-bold text-gray-900">156</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Comercios Morosos</p>
                              <p className="text-2xl font-bold text-gray-900">8</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Calendar className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
                              <p className="text-2xl font-bold text-gray-900">89</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chofer Content */}
        {activeActor === "chofer" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Panel de Chofer</h1>
              <p className="mt-2 text-gray-600">Selecciona una opción para continuar</p>
            </div>

            {/* Menu Inicial - Solo mostrar si no hay sección activa */}
            {!activeDriverSection && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
                  onClick={() => setActiveDriverSection("pedidos")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Package className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pedidos</h3>
                    <p className="text-gray-600">Gestiona tus pedidos asignados</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
                  onClick={() => setActiveDriverSection("checkin")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Check-In</h3>
                    <p className="text-gray-600">Realizar check-in en sucursal</p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
                  onClick={() => setActiveDriverSection("ruta")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Route className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultar Ruta</h3>
                    <p className="text-gray-600">Ver información de tu ruta</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contenido de secciones - Solo mostrar si hay una sección activa */}
            {activeDriverSection && (
              <div className="space-y-6">
                {/* Botón para volver al menú principal */}
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveDriverSection("")}
                    className="flex items-center gap-2"
                  >
                    ← Volver al menú principal
                  </Button>
                </div>

                {/* Pedidos Section */}
                {activeDriverSection === "pedidos" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Pedidos Asignados</h2>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {getFilteredOrders().filter((order) => order.status === "pendiente").length} pedidos pendientes
                      </Badge>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Lista de Pedidos a Domicilio</CardTitle>
                            <CardDescription>
                              Pedidos ordenados alfabéticamente por barrio - Sucursal actual:{" "}
                              {mockCurrentRoute.currentBranch}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Buscar por barrio..."
                              value={neighborhoodFilter}
                              onChange={(e) => setNeighborhoodFilter(e.target.value)}
                              className="w-48"
                            />
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Glosario de Acciones:</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>Ver pedido</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ExclamationTriangle className="h-3 w-3" />
                              <span>Reportar problema</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <PackageCheck className="h-3 w-3" />
                              <span>Entregar pedido</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Pedido</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Barrio</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Destinatario</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getFilteredOrders().map((order, index) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                  <td className="py-4 px-4">
                                    <span className="font-mono text-sm">{order.id}</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status === "pendiente"
                                        ? "Pendiente"
                                        : order.status === "entregado"
                                          ? "Entregado"
                                          : order.status === "fallido"
                                            ? "Fallido"
                                            : order.status}
                                    </Badge>
                                  </td>
                                  <td className="py-4 px-4">
                                    <Badge variant="outline" className="text-sm">
                                      {order.neighborhood}
                                    </Badge>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div>
                                      <p className="font-medium text-sm">{order.recipient}</p>
                                      <p className="text-xs text-gray-500">{order.phone}</p>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <p className="text-sm text-gray-900">{order.address}</p>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex gap-1">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <div>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() => setSelectedOrder(order)}
                                                >
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Ver pedido</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </DialogTrigger>
                                        <DialogContent className="backdrop-blur-sm bg-white/95">
                                          <DialogHeader>
                                            <DialogTitle>Detalles del Pedido {selectedOrder?.id}</DialogTitle>
                                            <DialogDescription>
                                              Información completa del pedido seleccionado
                                            </DialogDescription>
                                          </DialogHeader>
                                          {selectedOrder && (
                                            <div className="space-y-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">Destinatario</h4>
                                                  <p className="text-sm">{selectedOrder.recipient}</p>
                                                  <p className="text-xs text-gray-500">{selectedOrder.phone}</p>
                                                </div>
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">Ubicación</h4>
                                                  <p className="text-sm">{selectedOrder.address}</p>
                                                  <p className="text-xs text-gray-500">{selectedOrder.neighborhood}</p>
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">Comercio</h4>
                                                  <p className="text-sm">{selectedOrder.business}</p>
                                                </div>
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">Tiempo Estimado</h4>
                                                  <p className="text-sm">{selectedOrder.estimatedTime}</p>
                                                </div>
                                              </div>
                                              <div>
                                                <h4 className="font-medium text-sm text-gray-700">Descripción</h4>
                                                <p className="text-sm">{selectedOrder.description}</p>
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">Peso</h4>
                                                  <p className="text-sm">{selectedOrder.weight}</p>
                                                </div>
                                                <div>
                                                  <h4 className="font-medium text-sm text-gray-700">
                                                    Instrucciones Especiales
                                                  </h4>
                                                  <p className="text-sm">{selectedOrder.specialInstructions}</p>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </DialogContent>
                                      </Dialog>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                          >
                                            <ExclamationTriangle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Reportar problema</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      {order.status === "pendiente" && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <div>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => setDeliveryOrder(order)}
                                                  >
                                                    <PackageCheck className="h-4 w-4" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>Entregar pedido</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </DialogTrigger>
                                          <DialogContent className="backdrop-blur-sm bg-white/95">
                                            <DialogHeader>
                                              <DialogTitle>Confirmar Entrega - {deliveryOrder?.id}</DialogTitle>
                                              <DialogDescription>
                                                Ingresa los datos de quien recibió el pedido
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                  DNI del Receptor
                                                </label>
                                                <Input
                                                  placeholder="Ej: 12345678"
                                                  value={deliveryData.dni}
                                                  onChange={(e) =>
                                                    setDeliveryData((prev) => ({ ...prev, dni: e.target.value }))
                                                  }
                                                />
                                              </div>
                                              <div>
                                                <label className="text-sm font-medium text-gray-700">
                                                  Nombre del Receptor
                                                </label>
                                                <Input
                                                  placeholder="Nombre completo"
                                                  value={deliveryData.receiverName}
                                                  onChange={(e) =>
                                                    setDeliveryData((prev) => ({ ...prev, receiverName: e.target.value }))
                                                  }
                                                />
                                              </div>
                                              <div className="flex gap-2 pt-4">
                                                <Button
                                                  onClick={() => deliveryOrder?.id && handleDelivery(deliveryOrder.id)}
                                                  disabled={!deliveryData.dni || !deliveryData.receiverName}
                                                  className="flex-1"
                                                >
                                                  <PackageCheck className="h-4 w-4 mr-2" />
                                                  Confirmar Entrega
                                                </Button>
                                                <Button
                                                  variant="outline"
                                                  onClick={() => {
                                                    setDeliveryOrder(null)
                                                    setDeliveryData({ dni: "", receiverName: "" })
                                                  }}
                                                >
                                                  Cancelar
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Check-in en Sucursal */}
                {activeDriverSection === "checkin" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Check-in en Sucursal</h2>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        Ruta: {mockCurrentRoute.name}
                      </Badge>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Progreso de Ruta Actual</CardTitle>
                        <CardDescription>
                          Sucursal actual: {mockCurrentRoute.currentBranch} → Próxima: {mockCurrentRoute.nextBranch}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          {mockCurrentRoute.branches.map((branch, index) => (
                            <div key={branch.name} className="flex items-center gap-4 p-3 rounded-lg border">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${branch.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : branch.status === "current"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {branch.status === "completed" ? <CheckCircle className="h-4 w-4" /> : index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{branch.name}</h4>
                                  <span className="text-sm text-gray-500">{branch.time}</span>
                                </div>
                                <Badge
                                  className={
                                    branch.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : branch.status === "current"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600"
                                  }
                                >
                                  {branch.status === "completed"
                                    ? "Completado"
                                    : branch.status === "current"
                                      ? "Actual"
                                      : "Pendiente"}
                                </Badge>
                              </div>
                              {branch.status === "current" && (
                                <Button size="sm">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Check-in
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Finalización estimada:</span>
                            <span className="font-medium">{mockCurrentRoute.estimatedCompletion}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Consultar Ruta */}
                {activeDriverSection === "ruta" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-semibold text-gray-900">Ruta Asignada</h2>
                      <Button variant="outline">
                        <Navigation className="h-4 w-4 mr-2" />
                        Confirmar Ruta
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Información de la Ruta</CardTitle>
                        <CardDescription>{mockCurrentRoute.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h3 className="font-medium">Detalles Generales</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total de sucursales:</span>
                                <span className="font-medium">{mockCurrentRoute.totalBranches}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sucursal actual:</span>
                                <span className="font-medium">{mockCurrentRoute.currentBranch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Próxima sucursal:</span>
                                <span className="font-medium">{mockCurrentRoute.nextBranch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Finalización estimada:</span>
                                <span className="font-medium">{mockCurrentRoute.estimatedCompletion}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-medium">Secuencia de Sucursales</h3>
                            <div className="space-y-2">
                              {mockCurrentRoute.branches.map((branch, index) => (
                                <div key={branch.name} className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${branch.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : branch.status === "current"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600"
                                      }`}
                                  >
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 flex justify-between items-center">
                                    <span className={branch.status === "current" ? "font-medium" : ""}>{branch.name}</span>
                                    <span className="text-sm text-gray-500">{branch.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Placeholder for Comercio */}
        {activeActor === "comercio" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Panel de Comercio</h2>
              <p className="text-gray-600">Esta sección será implementada en la siguiente iteración.</p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
