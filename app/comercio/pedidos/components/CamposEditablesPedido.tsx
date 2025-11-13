"use client"

interface Sucursal {
    idSucursal: number
    direccionSucursal: string
    ciudadSucursal: string
}

interface CamposEditablesPedidoProps {
    ciudadDestino: string
    fechaLimiteEntrega: string
    sucursales: Sucursal[]
    loading: boolean
    loadingSucursales: boolean
    fieldErrors: Record<string, string>
    onCiudadChange: (ciudad: string) => void
    onFechaChange: (fecha: string) => void
}

export function CamposEditablesPedido({
    ciudadDestino,
    fechaLimiteEntrega,
    sucursales,
    loading,
    loadingSucursales,
    fieldErrors,
    onCiudadChange,
    onFechaChange
}: CamposEditablesPedidoProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Modificar Pedido</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Solo puedes modificar la ciudad de destino y la fecha límite de entrega.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
                {/* Ciudad de destino */}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Ciudad de destino *
                    </label>
                    <select
                        value={ciudadDestino}
                        onChange={(e) => onCiudadChange(e.target.value)}
                        disabled={loading || loadingSucursales}
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.ciudadDestino ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                    >
                        <option value="">Seleccionar ciudad</option>
                        {Array.from(new Set(sucursales.map(s => s.ciudadSucursal)))
                            .filter(ciudad => ciudad && ciudad.trim() !== "")
                            .sort()
                            .map((ciudad, index) => (
                                <option key={`ciudad-${index}-${ciudad}`} value={ciudad}>
                                    {ciudad}
                                </option>
                            ))
                        }
                    </select>
                    {fieldErrors.ciudadDestino && (
                        <p className="text-sm text-red-600">{fieldErrors.ciudadDestino}</p>
                    )}
                </div>
                
                {/* Fecha límite */}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Fecha límite de entrega *
                    </label>
                    <input
                        type="date"
                        value={fechaLimiteEntrega}
                        onChange={(e) => onFechaChange(e.target.value)}
                        disabled={loading}
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldErrors.fechaLimiteEntrega ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                    />
                    {fieldErrors.fechaLimiteEntrega && (
                        <p className="text-sm text-red-600">{fieldErrors.fechaLimiteEntrega}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
