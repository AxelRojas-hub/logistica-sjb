"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Eye,
    Download,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    ArrowLeft
} from "lucide-react"
import { mockInvoices } from "@/lib/mock-data"
import type { Invoice } from "@/lib/types"
import Link from "next/link"

export default function ComercioFacturasPage() {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            case "pagada":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "vencida":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "pagada":
                return "Pagada"
            case "vencida":
                return "Vencida"
            case "pendiente":
                return "Pendiente"
            default:
                return status
        }
    }

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Historial de Facturas</h1>
                    <p className="mt-2 text-muted-foreground">Consulta y gestiona tu historial de facturación</p>
                </div>

                {/* Botón para volver al menú principal */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio">
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Mis Facturas</h2>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha Emisión</TableHead>
                                    <TableHead>Vencimiento</TableHead>
                                    <TableHead>Servicios</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} className="hover:bg-accent/50">
                                        <TableCell>{invoice.issuedDate}</TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell>
                                            <p className="text-sm max-w-[150px] truncate" title={invoice.services.join(", ")}>
                                                {invoice.services.join(", ")}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(invoice.status)}>
                                                    {getStatusText(invoice.status)}
                                                </Badge>
                                                {invoice.status === "vencida" && (
                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-lg">
                                            ${invoice.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Detalle de Factura {selectedInvoice?.id}</DialogTitle>
                                                        </DialogHeader>
                                                        {selectedInvoice && (
                                                            <div className="grid gap-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Estado</h4>
                                                                        <Badge className={getStatusColor(selectedInvoice.status)}>
                                                                            {getStatusText(selectedInvoice.status)}
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Monto Total</h4>
                                                                        <p className="text-xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Fecha de emisión</h4>
                                                                        <p className="text-sm">{selectedInvoice.issuedDate}</p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium mb-1">Fecha de vencimiento</h4>
                                                                        <p className="text-sm">{selectedInvoice.dueDate}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Descripción</h4>
                                                                    <p className="text-sm">{selectedInvoice.description}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Servicios incluidos</h4>
                                                                    <ul className="text-sm space-y-1">
                                                                        {selectedInvoice.services.map((service, index) => (
                                                                            <li key={index} className="flex items-center gap-2">
                                                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                                                {service}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Pedidos incluidos</h4>
                                                                    <p className="text-sm">{selectedInvoice.orders.join(", ")}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                {invoice.status !== "pagada" && (
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        <CreditCard className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    )
}