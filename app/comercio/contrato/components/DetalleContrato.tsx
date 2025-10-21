import { Calendar, Package } from "lucide-react"
import type { Contrato } from "@/lib/types"

interface DetalleContratoProps {
    contrato: Contrato
}

export function DetalleContrato({ contrato }: DetalleContratoProps) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {contrato.duracionContratoMeses} meses
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Tipo de cobro</p>
                <p className="font-medium flex items-center gap-2">
                    {contrato.tipoCobro}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Descuento</p>
                <p className="font-bold text-lg flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {contrato.descuento}%
                </p>
            </div>
            {contrato.fechaFinContrato && (
                <div className="md:col-span-3">
                    <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                    <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(contrato.fechaFinContrato).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    )
}