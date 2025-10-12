import { useState, useEffect } from "react"
import type { Ruta, Pedido, Chofer, Sucursal } from "@/lib/types"

interface DestinationGroup {
    city: string;
    orders: Pedido[];
    count: number;
}

export function useShipmentLogic() {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([])
    const [selectedDestination, setSelectedDestination] = useState<string>("")
    const [selectedRoute, setSelectedRoute] = useState<string>("")
    const [selectedDriver, setSelectedDriver] = useState<string>("")

    // TODO: Obtener datos desde la API
    const mockRutas: Ruta[] = [];
    const mockDriverOrders: Pedido[] = [];
    const mockChoferes: Chofer[] = [];
    const mockSucursales: Sucursal[] = [];
    const mockAdmin = { id: "ADM-001", sucursalId: "SUC-BA" };

    const adminBranch = mockSucursales.find(branch => branch.id === mockAdmin.sucursalId)
    const pendingOrders = mockDriverOrders.filter(order => order.estado === "pendiente")
    const getDestinationGroups = (): DestinationGroup[] => {
        const groups: { [key: string]: typeof mockDriverOrders } = {}
        const adminBranchCity = adminBranch?.nombre.replace('Sucursal ', '') || 'Buenos Aires';

        pendingOrders.forEach(order => {
            const city = order.localidad.split('(')[0].trim() // Extraer ciudad de "Buenos Aires (CABA)"
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
        return mockRutas.find(route => {
            const adminBranchName = adminBranch?.nombre.replace('Sucursal ', '') || 'Buenos Aires';
            const startsFromAdminBranch = route.sucursales[0].toLowerCase().includes(adminBranchName.toLowerCase());
            const includesDestination = route.sucursales.some(branch =>
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

    const getRouteSegments = (route: Ruta | null) => {
        if (!route || !adminBranch) return [];

        const adminBranchName = adminBranch.nombre.replace('Sucursal ', '');
        const adminIndex = route.sucursales.findIndex(branch =>
            branch.toLowerCase().includes(adminBranchName.toLowerCase())
        );

        if (adminIndex === -1) return route.sucursales;

        return route.sucursales.slice(adminIndex);
    }

    const routeSegments = getRouteSegments(suggestedRoute || null);

    const adminBranchCity = adminBranch?.nombre.replace('Sucursal ', '') || 'Buenos Aires';

    const ordersForRoute = suggestedRoute && routeSegments.length > 0
        ? pendingOrders.filter(order => {
            const orderCity = order.localidad.split('(')[0].trim();
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
                const orderCity = order.localidad.split('(')[0].trim();
                if (orderCity.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                    adminBranchCity.toLowerCase().includes(orderCity.toLowerCase())) {
                    return false;
                }
                return order.localidad.includes(selectedDestination);
            })
            : mostFrequentDestination
                ? pendingOrders.filter(order => {
                    const orderCity = order.localidad.split('(')[0].trim();
                    if (orderCity.toLowerCase().includes(adminBranchCity.toLowerCase()) ||
                        adminBranchCity.toLowerCase().includes(orderCity.toLowerCase())) {
                        return false;
                    }
                    return order.localidad.includes(mostFrequentDestination);
                })
                : []

    const ordersForDestination = ordersForRoute

    const getOrderSegment = (order: Pedido) => {
        if (!suggestedRoute || routeSegments.length === 0) return null;

        const orderCity = order.localidad.split('(')[0].trim();
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

    const availableDrivers = mockChoferes.filter(driver =>
        driver.sucursalId === mockAdmin.sucursalId && driver.estado === "disponible"
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

    const selectedRouteInfo = mockRutas.find(route => route.id === selectedRoute)
    const selectedDriverInfo = mockChoferes.find(driver => driver.id === selectedDriver)

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