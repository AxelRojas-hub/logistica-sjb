import { useState, useEffect } from "react"
import { mockRoutes, mockDriverOrders, mockAdminContext, mockDrivers, mockBranches } from "@/lib/mock-data"

interface DestinationGroup {
    city: string;
    orders: typeof mockDriverOrders;
    count: number;
}

export function useShipmentLogic() {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([])
    const [selectedDestination, setSelectedDestination] = useState<string>("")
    const [selectedRoute, setSelectedRoute] = useState<string>("")
    const [selectedDriver, setSelectedDriver] = useState<string>("")

    const adminBranch = mockBranches.find(branch => branch.id === mockAdminContext.branchId)
    const pendingOrders = mockDriverOrders.filter(order => order.status === "pendiente")
    const getDestinationGroups = (): DestinationGroup[] => {
        const groups: { [key: string]: typeof mockDriverOrders } = {}
        const adminBranchCity = adminBranch?.name.replace('Sucursal ', '') || 'Buenos Aires';

        pendingOrders.forEach(order => {
            const city = order.locality.split('(')[0].trim() // Extraer ciudad de "Buenos Aires (CABA)"
            // Excluir pedidos destinados a la misma ciudad de la sucursal origen
            if (city.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                adminBranchCity.toLowerCase().includes(city.toLowerCase())) {
                return;
            }
            if (!groups[city]) {
                groups[city] = []
            }
            groups[city].push(order)
        })

        return Object.entries(groups)
            .map(([city, orders]) => ({
                city,
                orders,
                count: orders.length
            }))
            .sort((a, b) => b.count - a.count)
    }

    const destinationGroups = getDestinationGroups()
    const mostFrequentDestination = destinationGroups[0]?.city || ""

    const getRouteForDestination = (destination: string) => {
        return mockRoutes.find(route => {
            const adminBranchName = adminBranch?.name.replace('Sucursal ', '') || 'Buenos Aires';
            const startsFromAdminBranch = route.branches[0].toLowerCase().includes(adminBranchName.toLowerCase());
            const includesDestination = route.branches.some(branch =>
                branch.toLowerCase().includes(destination.toLowerCase()) ||
                destination.toLowerCase().includes(branch.toLowerCase())
            );
            return startsFromAdminBranch && includesDestination;
        })
    }

    const suggestedRoute = selectedDestination
        ? getRouteForDestination(selectedDestination)
        : mostFrequentDestination
            ? getRouteForDestination(mostFrequentDestination)
            : null

    const getRouteSegments = (route: typeof mockRoutes[0] | null) => {
        if (!route || !adminBranch) return [];

        const adminBranchName = adminBranch.name.replace('Sucursal ', '');
        const adminIndex = route.branches.findIndex(branch =>
            branch.toLowerCase().includes(adminBranchName.toLowerCase())
        );

        if (adminIndex === -1) return route.branches;

        return route.branches.slice(adminIndex);
    }

    const routeSegments = getRouteSegments(suggestedRoute || null);

    const adminBranchCity = adminBranch?.name.replace('Sucursal ', '') || 'Buenos Aires';

    const ordersForRoute = suggestedRoute && routeSegments.length > 0
        ? pendingOrders.filter(order => {
            const orderCity = order.locality.split('(')[0].trim();
            // Excluir pedidos destinados a la misma ciudad de origen
            if (orderCity.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                adminBranchCity.toLowerCase().includes(orderCity.toLowerCase())) {
                return false;
            }
            return routeSegments.some(segment =>
                segment.toLowerCase().includes(orderCity.toLowerCase()) ||
                orderCity.toLowerCase().includes(segment.toLowerCase())
            );
        })
        : selectedDestination
            ? pendingOrders.filter(order => {
                const orderCity = order.locality.split('(')[0].trim();
                if (orderCity.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                    adminBranchCity.toLowerCase().includes(orderCity.toLowerCase())) {
                    return false;
                }
                return order.locality.includes(selectedDestination);
            })
            : mostFrequentDestination
                ? pendingOrders.filter(order => {
                    const orderCity = order.locality.split('(')[0].trim();
                    if (orderCity.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                        adminBranchCity.toLowerCase().includes(orderCity.toLowerCase())) {
                        return false;
                    }
                    return order.locality.includes(mostFrequentDestination);
                })
                : []

    const ordersForDestination = ordersForRoute

    const getOrderSegment = (order: typeof mockDriverOrders[0]) => {
        if (!suggestedRoute || routeSegments.length === 0) return null;

        const orderCity = order.locality.split('(')[0].trim();
        const matchingSegment = routeSegments.find(segment =>
            segment.toLowerCase().includes(orderCity.toLowerCase()) ||
            orderCity.toLowerCase().includes(segment.toLowerCase())
        );

        if (matchingSegment) {
            const segmentIndex = routeSegments.indexOf(matchingSegment);
            return {
                segment: matchingSegment,
                index: segmentIndex,
                isIntermediate: segmentIndex > 0 && segmentIndex < routeSegments.length - 1,
                isFinal: segmentIndex === routeSegments.length - 1
            };
        }
        return null;
    }

    const availableDrivers = mockDrivers.filter(driver =>
        driver.branchId === mockAdminContext.branchId && driver.status === "available"
    )

    // Auto-seleccionar destino más frecuente y ruta sugerida al cargar
    useEffect(() => {
        if (mostFrequentDestination && !selectedDestination) {
            setSelectedDestination(mostFrequentDestination)
        }
        if (suggestedRoute && !selectedRoute) {
            setSelectedRoute(suggestedRoute.id)
        }
    }, [mostFrequentDestination, suggestedRoute, selectedDestination, selectedRoute, ordersForDestination, selectedOrders])

    const selectedRouteInfo = mockRoutes.find(route => route.id === selectedRoute)
    const selectedDriverInfo = mockDrivers.find(driver => driver.id === selectedDriver)

    const canCreateShipment = !!(ordersForDestination.length > 0 && selectedRoute && selectedDriver)

    return {
        selectedOrders,
        selectedDestination,
        selectedRoute,
        selectedDriver,
        setSelectedOrders,
        setSelectedDestination,
        setSelectedRoute,
        setSelectedDriver,
        adminBranch,
        pendingOrders,
        suggestedRoute,
        routeSegments,
        ordersForDestination,
        availableDrivers,
        selectedRouteInfo,
        selectedDriverInfo,
        canCreateShipment,
        getOrderSegment
    }
}