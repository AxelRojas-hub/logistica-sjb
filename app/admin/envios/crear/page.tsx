"use client"

import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PageHeader, ShipmentConfigurationCard, IncludedOrdersCard } from "./components"

export default function AdminCrearEnvioPage() {
    const [selectedRoute, setSelectedRoute] = useState<string>("")
    const [selectedDriver, setSelectedDriver] = useState<string>("")

    // TODO: Implementar obtención de datos desde Supabase
    // TODO: Obtener sucursal actual del admin autenticado
    // TODO: Obtener pedidos pendientes del comercio
    // TODO: Obtener rutas disponibles
    // TODO: Obtener choferes disponibles

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <PageHeader />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <ShipmentConfigurationCard
                            selectedRoute={selectedRoute}
                            onRouteChange={setSelectedRoute}
                            selectedDriver={selectedDriver}
                            onDriverChange={setSelectedDriver}
                        />

                        <IncludedOrdersCard />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}