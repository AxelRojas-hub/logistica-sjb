import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DollarSign } from "lucide-react"
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
                    <DialogTitle>Detalle de Factura {invoice.nroFactura}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Estado Pago</h4>
                            <FacturaStatusBadge status={invoice.estadoPago} />
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Importe Total</h4>
                            <p className="text-xl font-bold flex items-center gap-1">
                                <DollarSign className="h-5 w-5" />
                                {invoice.importeTotal.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">Fecha de emisión</h4>
                            <p className="text-sm">{new Date(invoice.fechaEmision).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Periodo Facturación</h4>
                            <p className="text-sm">
                                {new Date(invoice.fechaInicio).toLocaleDateString()} - {new Date(invoice.fechaFin).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-1">ID Comercio</h4>
                            <p className="text-sm">{invoice.idComercio}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">ID Factura</h4>
                            <p className="text-sm">{invoice.idFactura}</p>
                        </div>
                    </div>
                    {invoice.nroPago && (
                        <div>
                            <h4 className="font-medium mb-1">Número de Pago</h4>
                            <p className="text-sm">{invoice.nroPago}</p>
                        </div>
                    )}
                    {invoice.fechaPago && (
                        <div>
                            <h4 className="font-medium mb-1">Fecha de Pago</h4>
                            <p className="text-sm">{new Date(invoice.fechaPago).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}