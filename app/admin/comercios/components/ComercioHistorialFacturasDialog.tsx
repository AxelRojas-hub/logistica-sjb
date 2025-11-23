"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Factura, Comercio } from "@/lib/types"
import { FacturaStatusBadge } from "../../../comercio/facturas/components/FacturaStatusBadge"

interface ComercioWithDetails extends Comercio {
    facturas: Factura[]
}

interface ComercioHistorialFacturasDialogProps {
    comercio: ComercioWithDetails | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function ComercioHistorialFacturasDialog({
    comercio,
    isOpen,
    onOpenChange,
}: ComercioHistorialFacturasDialogProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("es-AR")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-none !w-[95vw] sm:!max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Historial de Facturas</DialogTitle>
                    <DialogDescription>
                        {comercio?.nombreComercio && `Facturas del comercio: ${comercio.nombreComercio}`}
                    </DialogDescription>
                </DialogHeader>
                {comercio && (
                    <div className="overflow-y-auto flex-1">
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>N° Factura</TableHead>
                                        <TableHead>Importe</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha Emisión</TableHead>
                                        <TableHead>Fecha Vencimiento</TableHead>
                                        <TableHead>Fecha Pago</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comercio.facturas && comercio.facturas.length > 0 ? (
                                        comercio.facturas.map((factura) => (
                                            <TableRow key={`factura-${factura.idFactura}`}>
                                                <TableCell>{factura.nroFactura}</TableCell>
                                                <TableCell>${factura.importeTotal?.toLocaleString("es-AR")}</TableCell>
                                                <TableCell>
                                                    <FacturaStatusBadge status={factura.estadoPago} />
                                                </TableCell>
                                                <TableCell>{formatDate(factura.fechaEmision)}</TableCell>
                                                <TableCell>{formatDate(factura.fechaFin)}</TableCell>
                                                <TableCell>{formatDate(factura.fechaPago)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow key="no-facturas">
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Este comercio no tiene facturas registradas
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
