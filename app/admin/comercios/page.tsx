"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    Eye,
    FileText,
    AlertTriangle,
    ArrowLeft
} from "lucide-react"
import { mockBusinesses } from "@/lib/mock-data"
import Link from "next/link"

export default function AdminComerciosPage() {
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

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Comercios</h1>
                        <p className="mt-2 text-muted-foreground">Administra comercios y contratos del sistema</p>
                    </div>

                    {/* Botón para volver al menú principal */}
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

                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                            <h2 className="text-2xl font-semibold text-foreground">Lista de Comercios</h2>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Input placeholder="Buscar comercio..." className="w-full sm:w-64" />
                            </div>
                        </div>

                        <div className="bg-accent/50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Glosario de Acciones:</h4>
                            <div className="dark:text-gray-300 flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>Ver detalles del comercio</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>Historial de pedidos</span>
                                </div>
                            </div>
                        </div>

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
                                        {mockBusinesses.map((business) => (
                                            <TableRow key={business.id} className="hover:bg-accent/50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm truncate max-w-[180px]" title={business.name}>
                                                            {business.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge className={getStatusColor(business.status)} variant="outline">
                                                                {business.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm truncate max-w-[160px]" title={business.email}>
                                                            {business.email}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[160px]" title={business.fiscalAddress}>
                                                            {business.fiscalAddress}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm font-medium">{business.contractDuration}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {business.services.length} servicios
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            ${business.totalDebt.toLocaleString()}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {business.pendingInvoices > 0 && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                                    {business.pendingInvoices}
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
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}