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

function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function RouteGeneralDetails({ currentRoute }: RouteGeneralDetailsProps) {
    const tramoActualIndex = currentRoute.tramoActual ?? -1
    const proxTramo = currentRoute.tramos[tramoActualIndex + 1]
    const totalDuration = currentRoute.tramos.reduce((acc, t) => acc + t.duracionEstimadaMin, 0)

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
                        {proxTramo ? (proxTramo.nombreSucursalDestino || `Sucursal ${proxTramo.idSucursalDestino}`) : "Completado"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Duración total estimada:</span>
                    <span className="font-medium">
                        {formatDuration(totalDuration)}
                    </span>
                </div>
            </div>
        </div>
    )
}