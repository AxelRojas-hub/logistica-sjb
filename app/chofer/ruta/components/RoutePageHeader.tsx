import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

export function RoutePageHeader() {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Ruta Asignada</h2>
            <Button variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Confirmar Ruta
            </Button>
        </div>
    )
}