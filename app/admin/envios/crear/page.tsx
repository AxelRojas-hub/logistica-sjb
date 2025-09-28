"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
    PageHeader,
    ShipmentConfigurationCard,
    IncludedOrdersCard,
    useShipmentLogic
} from "./components"

export default function AdminCrearEnvioPage() {
    const {
        adminBranch,
        pendingOrders,
        suggestedRoute,
        routeSegments,
        ordersForDestination,
        availableDrivers,
        selectedDriver,
        setSelectedDriver,
        selectedRouteInfo,
        selectedDriverInfo,
        canCreateShipment,
        getOrderSegment
    } = useShipmentLogic()

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <PageHeader />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <ShipmentConfigurationCard
                            adminBranch={adminBranch}
                            suggestedRoute={suggestedRoute}
                            routeSegments={routeSegments}
                            ordersForDestination={ordersForDestination}
                            pendingOrders={pendingOrders}
                            availableDrivers={availableDrivers}
                            selectedDriver={selectedDriver}
                            setSelectedDriver={setSelectedDriver}
                            canCreateShipment={canCreateShipment}
                            selectedRouteInfo={selectedRouteInfo}
                            selectedDriverInfo={selectedDriverInfo}
                        />

                        <IncludedOrdersCard
                            ordersForDestination={ordersForDestination}
                            suggestedRoute={suggestedRoute}
                            routeSegments={routeSegments}
                            getOrderSegment={getOrderSegment}
                        />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}