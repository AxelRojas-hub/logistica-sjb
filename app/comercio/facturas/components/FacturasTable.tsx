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
}

export function FacturasTable({ invoices }: FacturasTableProps) {
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
                            <TableHead>Nro Factura</TableHead>
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Periodo</TableHead>
                            <TableHead>Estado Pago</TableHead>
                            <TableHead>Importe Total</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.idFactura} className="hover:bg-accent/50">
                                <TableCell className="font-medium">{invoice.nroFactura}</TableCell>
                                <TableCell>{new Date(invoice.fechaEmision).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {new Date(invoice.fechaInicio).toLocaleDateString()} - {new Date(invoice.fechaFin).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <FacturaStatusBadge status={invoice.estadoPago} />
                                </TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${invoice.importeTotal.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <FacturaActionsCell
                                        invoice={invoice}
                                        onViewInvoice={handleViewFactura}
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