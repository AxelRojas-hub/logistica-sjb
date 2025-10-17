import type { RutaConTramos, Tramo } from "@/lib/types"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

interface RouteGeneralDetailsProps {
    currentRoute: RutaConEstado
}

export function RouteGeneralDetails({ currentRoute }: RouteGeneralDetailsProps) {
    const tramoActualIndex = currentRoute.tramoActual ?? -1
    const proxTramo = currentRoute.tramos[tramoActualIndex + 1]

    return (
        <div className="space-y-3">
            <h3 className="font-medium">Detalles Generales</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total de tramos:</span>
                    <span className="font-medium">{currentRoute.tramos.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tramo actual:</span>
                    <span className="font-medium">{tramoActualIndex >= 0 ? tramoActualIndex + 1 : "No iniciado"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Próximo destino:</span>
                    <span className="font-medium">
                        {proxTramo ? `Sucursal ${proxTramo.idSucursalDestino}` : "Completado"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Duración total estimada:</span>
                    <span className="font-medium">
                        {currentRoute.tramos.reduce((acc, t) => acc + t.duracionEstimadaMin, 0)} min
                    </span>
                </div>
            </div>
        </div>
    )
}