"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import type { Factura } from "@/lib/types"
import { FacturaStatusBadge } from "./FacturaStatusBadge"
import { FacturaActionsCell } from "./FacturaActionsCell"
import { FacturaDetailsDialog } from "./FacturaDetailsDialog"

interface FacturasTableProps {
    invoices: Factura[]
    comercioInfo: {
        nombreComercio: string
        direccion: string
        telefono?: string
        email?: string
        sucursalOrigen?: {
            direccionSucursal: string
            ciudadSucursal: string
        }
    }
}

export function FacturasTable({ invoices, comercioInfo }: FacturasTableProps) {
    const [selectedInvoice, setSelectedInvoice] = useState<Factura | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleViewFactura = (invoice: Factura) => {
        setSelectedInvoice(invoice)
        setIsDialogOpen(true)
    }

    return (
        <Card>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Nro Factura</TableHead>
                            <TableHead className="text-center">Fecha Emisión</TableHead>
                            <TableHead className="text-center">Periodo</TableHead>
                            <TableHead className="text-center">Estado Pago</TableHead>
                            <TableHead >Importe Total</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.idFactura} className="hover:bg-accent/50">
                                <TableCell className="text-center font-medium">{invoice.nroFactura}</TableCell>
                                <TableCell className="text-center">{new Date(invoice.fechaEmision).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">
                                    {new Date(invoice.fechaInicio).toLocaleDateString()} - {new Date(invoice.fechaFin).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="flex items-center justify-center">
                                    <FacturaStatusBadge status={invoice.estadoPago} />
                                </TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${invoice.importeTotal.toLocaleString()}
                                </TableCell>
                                <TableCell className="flex justify-center">
                                    <FacturaActionsCell
                                        invoice={invoice}
                                        onViewInvoice={handleViewFactura}
                                        comercioInfo={comercioInfo}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <FacturaDetailsDialog
                    invoice={selectedInvoice}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </Dialog>
        </Card>
    )
}