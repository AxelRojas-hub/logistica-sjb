import type { RutaActual } from "@/lib/types"

interface RouteGeneralDetailsProps {
    currentRoute: RutaActual
}

export function RouteGeneralDetails({ currentRoute }: RouteGeneralDetailsProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-medium">Detalles Generales</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total de sucursales:</span>
                    <span className="font-medium">{currentRoute.totalSucursales}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Sucursal actual:</span>
                    <span className="font-medium">{currentRoute.sucursalActual}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Próxima sucursal:</span>
                    <span className="font-medium">{currentRoute.sucursalSiguiente}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Finalización estimada:</span>
                    <span className="font-medium">{currentRoute.finalizacionEstimada}</span>
                </div>
            </div>
        </div>
    )
}