"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

function calcularDiasMorosidad(fechaVencimiento: string): number {
    const fechaVenc = new Date(fechaVencimiento);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaVenc.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

interface ComercioMoroso {
    id_comercio: number;
    nombre_comercio: string;
    nombre_responsable: string;
    email_comercio: string;
    cantidad_facturas_vencidas: number;
    total_adeudado: number;
    fecha_vencimiento_mas_antigua: string;
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
                            <TableRow key={comercio.id_comercio}>
                                <TableCell className="font-medium">{comercio.nombre_comercio}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm">{comercio.email_comercio}</p>
                                        <p className="text-sm">{comercio.nombre_responsable}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    ${comercio.total_adeudado.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={calcularDiasMorosidad(comercio.fecha_vencimiento_mas_antigua) > 60 ? "destructive" : "default"}>
                                        {calcularDiasMorosidad(comercio.fecha_vencimiento_mas_antigua)} días
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {comercio.cantidad_facturas_vencidas}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}