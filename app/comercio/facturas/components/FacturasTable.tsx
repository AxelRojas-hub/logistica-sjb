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
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Vencimiento</TableHead>
                            <TableHead>Servicios</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} className="hover:bg-accent/50">
                                <TableCell>{invoice.fechaEmision}</TableCell>
                                <TableCell>{invoice.fechaVencimiento}</TableCell>
                                <TableCell>
                                    <p className="text-sm max-w-[150px] truncate" title={invoice.servicios.join(", ")}>
                                        {invoice.servicios.join(", ")}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <FacturaStatusBadge status={invoice.estado} />
                                </TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${invoice.monto.toLocaleString()}
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