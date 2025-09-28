import { Truck, Eye, CheckCircle, Building } from "lucide-react"

export default function ActionGlossary() {
    return (
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Acciones disponibles:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Ver detalle del pedido</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>Marcar en tránsito</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Marcar como entregado</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>Marcar en sucursal</span>
                </div>
            </div>
        </div>
    )
}