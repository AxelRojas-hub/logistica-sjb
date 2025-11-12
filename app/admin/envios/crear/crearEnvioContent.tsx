"use client"

import { useState } from "react"
import { ShipmentConfigurationCard, IncludedOrdersCard } from "./components"
import { PedidoConDetalles } from "@/lib/models/Pedido"
import { SucursalFrecuente } from "./page"
import { RutaConTramos } from "@/lib/types"

interface CrearEnvioContentProps {
    choferes: { id: string; nombre: string }[]
    pedidosPendientes: PedidoConDetalles[]
    sucursalDestinoMasFrecuente: SucursalFrecuente | null
    rutaElegida: RutaConTramos | null
    idSucursalOrigen: number
}

export function CrearEnvioContent({ choferes, pedidosPendientes, sucursalDestinoMasFrecuente, rutaElegida, idSucursalOrigen }: CrearEnvioContentProps) {
    const [selectedDriver, setSelectedDriver] = useState<string>("")

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <ShipmentConfigurationCard
                selectedDriver={selectedDriver}
                onDriverChange={setSelectedDriver}
                choferes={choferes}
                sucursalDestinoMasFrecuente={sucursalDestinoMasFrecuente}
                rutaElegida={rutaElegida}
                pedidosPendientes={pedidosPendientes}
                idSucursalOrigen={idSucursalOrigen}
            />            <IncludedOrdersCard pedidosPendientes={pedidosPendientes} />
        </div>
    )
}
