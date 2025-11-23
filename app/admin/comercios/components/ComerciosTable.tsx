"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, FileText, AlertTriangle, Receipt } from "lucide-react"
import { Comercio, Contrato, Factura, Pedido } from "@/lib/types"
import { ComercioDetailsDialog } from "./ComercioDetailsDialog"
import { ComercioHistorialPedidosDialog } from "./ComercioHistorialPedidosDialog"
import { ComercioHistorialFacturasDialog } from "./ComercioHistorialFacturasDialog"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
    pedidos: Pedido[]
}

interface ComerciosTableProps {
    comercios: ComercioWithDetails[]
}

export function ComerciosTable({ comercios }: ComerciosTableProps) {
    const [selectedComercio, setSelectedComercio] = useState<ComercioWithDetails | null>(null)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isHistorialPedidosDialogOpen, setIsHistorialPedidosDialogOpen] = useState(false)
    const [isHistorialFacturasDialogOpen, setIsHistorialFacturasDialogOpen] = useState(false)

    const handleViewDetails = (comercio: ComercioWithDetails) => {
        setSelectedComercio(comercio)
        setIsDetailsDialogOpen(true)
    }

    const handleViewHistorialPedidos = (comercio: ComercioWithDetails) => {
        setSelectedComercio(comercio)
        setIsHistorialPedidosDialogOpen(true)
    }

    const handleViewHistorialFacturas = (comercio: ComercioWithDetails) => {
        setSelectedComercio(comercio)
        setIsHistorialFacturasDialogOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "En ruta":
                return "bg-blue-100 text-blue-800"
            case "En sucursal":
                return "bg-green-100 text-green-800"
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "en proceso":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "completado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "en_transito":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            case "entregado":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const calculateDeudaTotal = (facturas: Factura[]) => {
        return facturas
            .filter((f) => f.estadoPago !== "pagado")
            .reduce((sum, f) => sum + f.importeTotal, 0)
    }

    const calculateFacturasVencidas = (facturas: Factura[]) => {
        return facturas.filter((f) => f.estadoPago === "vencido").length
    }

    return (
        <TooltipProvider>
            <Card className="overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead className="text-center">Contrato</TableHead>
                                <TableHead className="text-center">Estado Comercio</TableHead>
                                <TableHead className="text-center">Deuda</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comercios.map((comercio) => (
                                <TableRow key={comercio.idComercio} className="hover:bg-accent/50">
                                    <TableCell>
                                        <div>
                                            <p
                                                className="font-medium text-sm truncate max-w-[180px]"
                                                title={comercio.nombreComercio}
                                            >
                                                {comercio.nombreComercio}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p
                                                className="text-sm truncate max-w-[160px]"
                                                title={comercio.email}
                                            >
                                                {comercio.email}
                                            </p>
                                            <p
                                                className="text-xs text-muted-foreground truncate max-w-[160px]"
                                                title={comercio.domicilioFiscal}
                                            >
                                                {comercio.domicilioFiscal}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium">
                                                {comercio.contrato?.duracionContratoMeses ? `${comercio.contrato.duracionContratoMeses} meses` : "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {comercio.contrato?.estadoContrato || "N/A"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge
                                                className={getStatusColor(comercio.estadoComercio)}
                                                variant="outline"
                                            >
                                                {comercio.estadoComercio}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-medium">
                                                ${calculateDeudaTotal(comercio.facturas).toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {calculateFacturasVencidas(comercio.facturas) > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        {calculateFacturasVencidas(comercio.facturas)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex gap-1 justify-center">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(comercio)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver detalles del comercio</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => handleViewHistorialPedidos(comercio)}>
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Historial de pedidos</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => handleViewHistorialFacturas(comercio)}>
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Historial de facturas</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <ComercioDetailsDialog
                comercio={selectedComercio}
                isOpen={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
            />

            <ComercioHistorialPedidosDialog
                comercio={selectedComercio}
                isOpen={isHistorialPedidosDialogOpen}
                onOpenChange={setIsHistorialPedidosDialogOpen}
            />

            {/* Historial de Facturas */}
            <ComercioHistorialFacturasDialog
                comercio={selectedComercio}
                isOpen={isHistorialFacturasDialogOpen}
                onOpenChange={setIsHistorialFacturasDialogOpen}
            />
        </TooltipProvider>
    )
}
