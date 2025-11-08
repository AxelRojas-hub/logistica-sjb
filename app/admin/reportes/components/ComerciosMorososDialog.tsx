"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Comercio, Factura } from "@/lib/types"

interface ComercioMoroso extends Comercio {
    facturas: Factura[]
    deudaTotal: number
    diasMorosidad: number
    email?: string
}

interface ComerciosMorososDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    comercios: ComercioMoroso[]
    dias: number
    onExportReport: () => void
}

export function ComerciosMorososDialog({
    isOpen,
    onOpenChange,
    comercios,
    dias,
    onExportReport
}: ComerciosMorososDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reporte de Comercios Morosos</DialogTitle>
                    <DialogDescription>
                        Comercios con facturas vencidas en los últimos {dias} días
                    </DialogDescription>
                </DialogHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Comercio</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead className="text-right">Deuda Total</TableHead>
                            <TableHead className="text-center">Días de Morosidad</TableHead>
                            <TableHead className="text-center">Facturas Vencidas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comercios.map((comercio) => (
                            <TableRow key={comercio.idComercio}>
                                <TableCell className="font-medium">{comercio.nombreComercio}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm">{comercio.email}</p>
                                        <p className="text-xs text-muted-foreground">{comercio.domicilioFiscal}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ${comercio.deudaTotal.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={comercio.diasMorosidad > 60 ? "destructive" : "default"}>
                                        {comercio.diasMorosidad} días
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {comercio.facturas.filter(f => f.estadoPago === "vencido").length}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}