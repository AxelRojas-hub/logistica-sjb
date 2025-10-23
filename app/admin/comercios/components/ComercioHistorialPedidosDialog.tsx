"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Comercio, Factura, Contrato, Pedido, Sucursal } from "@/lib/types"
import OrderStatusBadge from "../../pedidos/components/OrderStatusBadge"
import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import { getSucursales } from "@/lib/models/Sucursal"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
    pedidos: Pedido[]
}

interface ComercioHistorialPedidosDialogProps {
    comercio: ComercioWithDetails | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function ComercioHistorialPedidosDialog({
    comercio,
    isOpen,
    onOpenChange,
}: ComercioHistorialPedidosDialogProps) {
    const [sucursales, setSucursales] = useState<Sucursal[]>([])

    useEffect(() => {
        const loadSucursales = async () => {
            const sucursalesData = await getSucursales(supabaseClient)
            setSucursales(sucursalesData)
        }
        loadSucursales()
    }, [])

    const getSucursalNombre = (idSucursal: number) => {
        const sucursal = sucursales.find(s => s.idSucursal === idSucursal)
        return sucursal ? `${sucursal.direccionSucursal}` : `Sucursal ${idSucursal}`
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('es-AR')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-none !w-[95vw] sm:!max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Historial de Pedidos</DialogTitle>
                    <DialogDescription>
                        {comercio?.nombreComercio && `Pedidos del comercio: ${comercio.nombreComercio}`}
                    </DialogDescription>
                </DialogHeader>

                {comercio && (
                    <>
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg flex-shrink-0">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {comercio.pedidos?.length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Pedidos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {comercio.pedidos?.filter(p => p.estadoPedido === 'entregado').length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Entregados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {comercio.pedidos?.filter(p => 
                                        p.estadoPedido === 'en_preparacion' || 
                                        p.estadoPedido === 'en_camino' || 
                                        p.estadoPedido === 'en_sucursal'
                                    ).length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">En Proceso</div>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <div className="border rounded-lg overflow-x-auto" >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>N° Pedido</TableHead>
                                            <TableHead>Fecha Registro</TableHead>
                                            <TableHead>Estado Actual</TableHead>
                                            <TableHead>Sucursal Origen</TableHead>
                                            <TableHead>Sucursal Destino</TableHead>
                                            <TableHead>Fecha Entrega</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comercio.pedidos && comercio.pedidos.length > 0 ? (
                                            comercio.pedidos.map((pedido) => (
                                                <TableRow key={`pedido-${pedido.idPedido}`}>
                                                    <TableCell className="font-medium">
                                                        #{pedido.idPedido}
                                                    </TableCell>
                                                    <TableCell>
                                                        -
                                                        {/* {formatDate(pedido.fechaRegistro)} */}
                                                        {/* TODO Hace falta un campo 'fecha_registro' en la BD  */}
                                                    </TableCell>
                                                    <TableCell>
                                                        <OrderStatusBadge status={pedido.estadoPedido} />
                                                    </TableCell>
                                                    <TableCell>
                                                        {getSucursalNombre(comercio.idSucursalOrigen)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getSucursalNombre(pedido.idSucursalDestino)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(pedido.fechaEntrega)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow key="no-pedidos">
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    Este comercio no tiene pedidos registrados
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
