"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import type { Invoice } from "@/lib/types"
import { InvoiceStatusBadge } from "./InvoiceStatusBadge"
import { InvoiceActionsCell } from "./InvoiceActionsCell"
import { InvoiceDetailsDialog } from "./InvoiceDetailsDialog"

interface InvoicesTableProps {
    invoices: Invoice[]
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleViewInvoice = (invoice: Invoice) => {
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
                                <TableCell>{invoice.issuedDate}</TableCell>
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell>
                                    <p className="text-sm max-w-[150px] truncate" title={invoice.services.join(", ")}>
                                        {invoice.services.join(", ")}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </TableCell>
                                <TableCell className="font-bold text-lg">
                                    ${invoice.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <InvoiceActionsCell
                                        invoice={invoice}
                                        onViewInvoice={handleViewInvoice}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <InvoiceDetailsDialog
                    invoice={selectedInvoice}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </Dialog>
        </Card>
    )
}