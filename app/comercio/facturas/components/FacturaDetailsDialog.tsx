import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import type { Factura } from "@/lib/types"
import { FacturaStatusBadge } from "./FacturaStatusBadge"

interface FacturaDetailsDialogProps {
    invoice: Factura | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FacturaDetailsDialog({ invoice, open, onOpenChange }: FacturaDetailsDialogProps) {
    if (!invoice) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalle de Factura {invoice.id}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Estado</h4>
                            <FacturaStatusBadge status={invoice.estado} />
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Monto Total</h4>
                            <p className="text-xl font-bold">${invoice.monto.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Fecha de emisión</h4>
                            <p className="text-sm">{invoice.fechaEmision}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Fecha de vencimiento</h4>
                            <p className="text-sm">{invoice.fechaVencimiento}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Descripción</h4>
                        <p className="text-sm">{invoice.descripcion}</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Servicios incluidos</h4>
                        <ul className="text-sm space-y-1">
                            {invoice.servicios.map((service, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Pedidos incluidos</h4>
                        <p className="text-sm">{invoice.pedidos.join(", ")}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}