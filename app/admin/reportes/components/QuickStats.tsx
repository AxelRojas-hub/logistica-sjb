import { Card, CardContent } from "@/components/ui/card"
import {
    Truck,
    Building2,
    AlertTriangle
} from "lucide-react"
import type { StatsData } from "@/lib/models/Stats"

interface QuickStatsProps {
    stats: StatsData;
}

export function QuickStats({ stats }: QuickStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Envíos Activos</p>
                            <p className="text-2xl font-bold text-foreground">{stats.enviosActivos}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Building2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Comercios Activos</p>
                            <p className="text-2xl font-bold text-foreground">{stats.comerciosActivos}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Comercios Morosos</p>
                            <p className="text-2xl font-bold text-foreground">{stats.comerciosMorosos}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}