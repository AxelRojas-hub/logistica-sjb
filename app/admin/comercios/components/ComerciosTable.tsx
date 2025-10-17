"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, FileText, AlertTriangle } from "lucide-react"
import { Comercio, Contrato, Factura } from "@/lib/types"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
}

interface ComerciosTableProps {
    comercios: ComercioWithDetails[]
}

export function ComerciosTable({ comercios }: ComerciosTableProps) {
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
                                <TableHead>Contrato</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
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
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    className={getStatusColor(comercio.estadoComercio)}
                                                    variant="outline"
                                                >
                                                    {comercio.estadoComercio}
                                                </Badge>
                                            </div>
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
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {comercio.contrato?.duracionContratoMeses || "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {comercio.contrato?.estadoContrato || "N/A"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
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
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver detalles del comercio</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Historial de pedidos</p>
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
        </TooltipProvider>
    )
}
