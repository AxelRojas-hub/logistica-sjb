import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, CreditCard } from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoiceActionsCellProps {
    invoice: Invoice
    onViewInvoice: (invoice: Invoice) => void
}

export function InvoiceActionsCell({ invoice, onViewInvoice }: InvoiceActionsCellProps) {
    return (
        <div className="flex gap-1">
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewInvoice(invoice)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
            </Button>
            {invoice.status !== "pagada" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CreditCard className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}