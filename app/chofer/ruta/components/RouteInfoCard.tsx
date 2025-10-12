import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RutaActual } from "@/lib/types"
import { RouteGeneralDetails } from "./RouteGeneralDetails"
import { BranchSequence } from "./BranchSequence"

interface RouteInfoCardProps {
    currentRoute: RutaActual | null
}

export function RouteInfoCard({ currentRoute }: RouteInfoCardProps) {
    if (!currentRoute) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No hay ruta asignada actualmente
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Ruta</CardTitle>
                <CardDescription>{currentRoute.nombre}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <RouteGeneralDetails currentRoute={currentRoute} />
                    <BranchSequence currentRoute={currentRoute} />
                </div>
            </CardContent>
        </Card>
    )
}