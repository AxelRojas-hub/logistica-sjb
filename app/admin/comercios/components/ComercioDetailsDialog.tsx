"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { AlertTriangle } from "lucide-react"
import { Comercio, Contrato, Factura } from "@/lib/types"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
}

interface ComercioDetailsDialogProps {
    comercio: ComercioWithDetails | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "En ruta":
            return "bg-blue-100 text-blue-800"
        case "En sucursal":
            return "bg-green-100 text-green-800"
        case "pendiente":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
        case "en proceso":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
        case "completado":
            return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
        case "en_transito":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
        case "entregado":
            return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
        case "cancelado":
            return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
        default:
            return "bg-muted text-muted-foreground"
    }
}
// Revisar si queda 
// const calculateDeudaTotal = (facturas: Factura[]) => {
//     return facturas
//         .filter((f) => f.estadoPago !== "pagado")
//         .reduce((sum, f) => sum + f.importeTotal, 0)
// }

// const calculateFacturasVencidas = (facturas: Factura[]) => {
//     return facturas.filter((f) => f.estadoPago === "vencido").length
// }

export function ComercioDetailsDialog({
    comercio,
    isOpen,
    onOpenChange,
}: ComercioDetailsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detalles del Comercio</DialogTitle>
                    <DialogDescription>
                        Información completa del comercio y su situación contractual
                    </DialogDescription>
                </DialogHeader>

                {comercio && (
                    <div className="space-y-6">
                        {/* Información General */}
                        <div className="space-y-3 border-b pb-4">
                            <h3 className="font-semibold text-sm text-muted-foreground">Información General</h3>
                            <div>
                                <p className="text-xs text-muted-foreground">Nombre</p>
                                <p className="font-medium">{comercio.nombreComercio}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium text-sm">{comercio.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Responsable</p>
                                <p className="font-medium">{comercio.nombreResponsable || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Domicilio Fiscal</p>
                                <p className="font-medium text-sm">{comercio.domicilioFiscal}</p>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="space-y-3 pb-4">
                            <h3 className="font-semibold text-sm text-muted-foreground">Estado</h3>
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(comercio.estadoComercio)} variant="outline">
                                    {comercio.estadoComercio}
                                </Badge>
                            </div>
                        </div>

                        {/* Información de Contrato */}
                        {/* <div className="space-y-3 border-b pb-4">
                            <h3 className="font-semibold text-sm text-muted-foreground">Información del Contrato</h3>
                            {comercio.contrato ? (
                                <>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Estado</p>
                                        <p className="font-medium">{comercio.contrato.estadoContrato}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Duración (meses)</p>
                                        <p className="font-medium">{comercio.contrato.duracionContratoMeses}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tipo de Cobro</p>
                                        <p className="font-medium">{comercio.contrato.tipoCobro}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Descuento</p>
                                        <p className="font-medium">{comercio.contrato.descuento}%</p>
                                    </div>
                                    {comercio.contrato.fechaFinContrato && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Fecha de Fin</p>
                                            <p className="font-medium">
                                                {new Date(comercio.contrato.fechaFinContrato).toLocaleDateString(
                                                    "es-AR"
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Sin contrato asociado</p>
                            )}
                        </div> */}

                        {/* Información Financiera */}
                        {/* <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground">Información Financiera</h3>
                            <div>
                                <p className="text-xs text-muted-foreground">Deuda Total</p>
                                <p className="font-medium text-lg">
                                    ${calculateDeudaTotal(comercio.facturas).toLocaleString("es-AR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Facturas Vencidas</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {calculateFacturasVencidas(comercio.facturas) > 0 ? (
                                        <Badge variant="destructive" className="text-xs">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            {calculateFacturasVencidas(comercio.facturas)}
                                        </Badge>
                                    ) : (
                                        <p className="text-sm text-green-600">Sin facturas vencidas</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total de Facturas</p>
                                <p className="font-medium">{comercio.facturas.length}</p>
                            </div>
                        </div> */}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
