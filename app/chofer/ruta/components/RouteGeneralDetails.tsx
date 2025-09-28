import { CurrentRoute } from "@/lib/types"

interface RouteGeneralDetailsProps {
    currentRoute: CurrentRoute
}

export function RouteGeneralDetails({ currentRoute }: RouteGeneralDetailsProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-medium">Detalles Generales</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total de sucursales:</span>
                    <span className="font-medium">{currentRoute.totalBranches}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Sucursal actual:</span>
                    <span className="font-medium">{currentRoute.currentBranch}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Próxima sucursal:</span>
                    <span className="font-medium">{currentRoute.nextBranch}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Finalización estimada:</span>
                    <span className="font-medium">{currentRoute.estimatedCompletion}</span>
                </div>
            </div>
        </div>
    )
}