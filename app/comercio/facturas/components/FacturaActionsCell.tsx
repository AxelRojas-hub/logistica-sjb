import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, CreditCard } from "lucide-react"
import type { Factura } from "@/lib/types"

interface FacturaActionsCellProps {
    invoice: Factura
    onViewInvoice: (invoice: Factura) => void
}

export function FacturaActionsCell({ invoice, onViewInvoice }: FacturaActionsCellProps) {
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
            {invoice.estado !== "pagada" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CreditCard className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}