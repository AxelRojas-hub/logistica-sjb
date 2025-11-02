import type { RutaConTramos, Tramo } from "@/lib/types"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
}

interface BranchSequenceProps {
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

export function BranchSequence({ currentRoute }: BranchSequenceProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-medium">Secuencia de Tramos</h3>
            <div className="space-y-2">
                {currentRoute.tramos.map((tramo, index) => {
                    // Mostrar todos los tramos con "origen → destino"
                    const nombre = `${tramo.nombreSucursalOrigen || `Sucursal ${tramo.idSucursalOrigen}`} → ${tramo.nombreSucursalDestino || `Sucursal ${tramo.idSucursalDestino}`}`

                    return (
                        <div key={`${tramo.nroTramo}-${index}`} className="flex items-center gap-3">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${tramo.estado === "completado"
                                    ? "bg-green-100 text-green-800"
                                    : tramo.estado === "actual"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <span className={tramo.estado === "actual" ? "font-medium" : ""}>
                                    {nombre}
                                </span>
                                <span className="text-sm text-gray-500">{formatDuration(tramo.duracionEstimadaMin)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}