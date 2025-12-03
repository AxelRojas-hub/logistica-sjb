"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search } from "lucide-react"
import type { Pedido, EstadoPedido } from "@/lib/types"
import type { PedidoConDetalles } from "@/lib/models/Pedido"
import Link from "next/link"
import { toast } from "sonner"
import { ActionGlossary, OrdersTable } from "."

interface PedidosAdminContentProps {
    pedidos: Pedido[]
    idSucursalAdmin: number | null
}

export function PedidosAdminContent({ pedidos: initialPedidos, idSucursalAdmin }: PedidosAdminContentProps) {
    const [orders, setOrders] = useState<Pedido[]>(initialPedidos)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [invoiceStartMonth, setInvoiceStartMonth] = useState("")
    const [invoiceStartYear, setInvoiceStartYear] = useState("")
    const [invoiceEndMonth, setInvoiceEndMonth] = useState("")
    const [invoiceEndYear, setInvoiceEndYear] = useState("")

    // Generar opciones de años (máximo 2 años antes del año actual, hasta el año actual)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i).map(y => y.toString())
    const months = [
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" },
    ]

    // Filtrar pedidos basado en búsqueda, estado, estado de pago y período de facturación
    const filteredOrders = orders.filter(order => {
        const pedidoConDetalles = order as PedidoConDetalles
        const matchesSearch = searchTerm === "" ||
            order.idPedido.toString().includes(searchTerm) ||
            pedidoConDetalles.nombreComercio?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.estadoPedido === statusFilter

        // Filtro de período de facturación
        let matchesInvoicePeriod = true
        if (invoiceStartMonth || invoiceStartYear || invoiceEndMonth || invoiceEndYear) {
            const periodo = pedidoConDetalles.periodoFacturacion
            if (!periodo) {
                matchesInvoicePeriod = false
            } else {
                // Formato esperado: "YYYY-MM-DD - YYYY-MM-DD"
                const [startDateStr, endDateStr] = periodo.split(" - ")
                const startDate = new Date(startDateStr.trim())
                const endDate = new Date(endDateStr.trim())

                // Construir fecha de inicio y fin del filtro
                let filterStart: Date | null = null
                let filterEnd: Date | null = null

                if (invoiceStartMonth && invoiceStartYear) {
                    filterStart = new Date(`${invoiceStartYear}-${invoiceStartMonth}-01`)
                }

                if (invoiceEndMonth && invoiceEndYear) {
                    // Primer día del mes siguiente para cubrir todo el mes
                    const month = parseInt(invoiceEndMonth)
                    const year = parseInt(invoiceEndYear)
                    filterEnd = new Date(year, month, 1) // Mes siguiente, día 1
                }

                // Validar que el período de facturación esté dentro del rango
                if (filterStart && filterEnd) {
                    matchesInvoicePeriod = startDate >= filterStart && endDate <= filterEnd
                } else if (filterStart) {
                    matchesInvoicePeriod = startDate >= filterStart
                } else if (filterEnd) {
                    matchesInvoicePeriod = endDate <= filterEnd
                }
            }
        }

        return matchesSearch && matchesStatus && matchesInvoicePeriod
    })

    const handleUpdateOrderStatus = async (orderId: number, newStatus: EstadoPedido) => {
        const response = await fetch("/api/pedidos/marcar-entregado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idPedido: orderId })
        })

        const result = await response.json()

        if (result.success) {
            // Actualizar el pedido con el nuevo precio y fecha de entrega
            setOrders(orders.map(order =>
                order.idPedido === orderId
                    ? {
                        ...order,
                        estadoPedido: newStatus,
                        precio: result.precioFinal || order.precio,
                        fechaEntrega: new Date().toISOString()
                    }
                    : order
            ))

            toast.success("Pedido marcado como entregado")
        } else {
            toast.error(result.message || "Error al marcar pedido como entregado")
        }
    }

    const handleSelectOrder = (order: Pedido) => {
        console.log("Selected order:", order)
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al menú principal
                            </Button>
                        </Link>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
                        <p className="mt-2 text-muted-foreground">Administra y controla todos los pedidos de tu sucursal</p>
                    </div>
                    <div className="space-y-6">
                        <ActionGlossary />

                        {/* Controles de búsqueda y filtrado */}
                        <div className="space-y-4">
                            {/* Fila 1: Búsqueda y estado de pedido */}
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por ID o nombre del comercio..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-muted-foreground">Estado Pedido</label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-52">
                                            <SelectValue placeholder="Filtrar por estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            <SelectItem value="en_preparacion">En preparación</SelectItem>
                                            <SelectItem value="en_camino">En camino</SelectItem>
                                            <SelectItem value="en_sucursal">En sucursal</SelectItem>
                                            <SelectItem value="entregado">Entregado</SelectItem>
                                            <SelectItem value="cancelado">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Fila 2: Período de facturación */}
                            <div className="flex gap-4 items-end">
                                {/* Período de facturación - Fecha inicio */}
                                <div className="flex gap-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-muted-foreground">Facturación Inicio</label>
                                        <div className="flex gap-2">
                                            <Select value={invoiceStartMonth} onValueChange={(value) => setInvoiceStartMonth(value === "none" ? "" : value)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Mes inicio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin especificar</SelectItem>
                                                    {months.map(m => (
                                                        <SelectItem key={m.value} value={m.value}>
                                                            {m.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select value={invoiceStartYear} onValueChange={(value) => setInvoiceStartYear(value === "none" ? "" : value)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Año inicio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin especificar</SelectItem>
                                                    {years.map(y => (
                                                        <SelectItem key={y} value={y}>
                                                            {y}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Período de facturación - Fecha fin */}
                                <div className="flex gap-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-muted-foreground">Facturación Fin</label>
                                        <div className="flex gap-2">
                                            <Select value={invoiceEndMonth} onValueChange={(value) => setInvoiceEndMonth(value === "none" ? "" : value)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Mes fin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin especificar</SelectItem>
                                                    {months.map(m => (
                                                        <SelectItem key={m.value} value={m.value}>
                                                            {m.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select value={invoiceEndYear} onValueChange={(value) => setInvoiceEndYear(value === "none" ? "" : value)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Año fin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin especificar</SelectItem>
                                                    {years.map(y => (
                                                        <SelectItem key={y} value={y}>
                                                            {y}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <OrdersTable
                            orders={filteredOrders}
                            onUpdateStatus={handleUpdateOrderStatus}
                            onSelectOrder={handleSelectOrder}
                            idSucursalAdmin={idSucursalAdmin}
                        />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
