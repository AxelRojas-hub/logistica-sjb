"use client"

import { useState } from "react"
import { ShipmentConfigurationCard, IncludedOrdersCard } from "./components"
import { PedidoConDetalles } from "@/lib/models/Pedido"
import { SucursalFrecuente } from "./page"

interface CrearEnvioContentProps {
    rutas: { id: string; nombre: string }[]
    choferes: { id: string; nombre: string }[]
    pedidosPendientes: PedidoConDetalles[]
    sucursalDestinoMasFrecuente: SucursalFrecuente | null
}

export function CrearEnvioContent({ rutas, choferes, pedidosPendientes, sucursalDestinoMasFrecuente }: CrearEnvioContentProps) {
    const [selectedRoute, setSelectedRoute] = useState<string>("")
    const [selectedDriver, setSelectedDriver] = useState<string>("")

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <ShipmentConfigurationCard
                selectedRoute={selectedRoute}
                onRouteChange={setSelectedRoute}
                selectedDriver={selectedDriver}
                onDriverChange={setSelectedDriver}
                rutas={rutas}
                choferes={choferes}
                sucursalDestinoMasFrecuente={sucursalDestinoMasFrecuente}
            />

            <IncludedOrdersCard pedidosPendientes={pedidosPendientes} />
        </div>
    )
}
