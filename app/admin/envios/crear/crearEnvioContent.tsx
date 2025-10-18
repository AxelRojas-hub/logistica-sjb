"use client"

import { useState } from "react"
import { ShipmentConfigurationCard, IncludedOrdersCard } from "./components"

interface CrearEnvioContentProps {
    rutas: { id: string; nombre: string }[]
    choferes: { id: string; nombre: string }[]
}

export function CrearEnvioContent({ rutas, choferes }: CrearEnvioContentProps) {
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
            />

            <IncludedOrdersCard />
        </div>
    )
}
