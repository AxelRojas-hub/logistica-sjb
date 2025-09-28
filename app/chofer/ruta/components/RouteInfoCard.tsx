import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrentRoute } from "@/lib/types"
import { RouteGeneralDetails } from "./RouteGeneralDetails"
import { BranchSequence } from "./BranchSequence"

interface RouteInfoCardProps {
    currentRoute: CurrentRoute
}

export function RouteInfoCard({ currentRoute }: RouteInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Ruta</CardTitle>
                <CardDescription>{currentRoute.name}</CardDescription>
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