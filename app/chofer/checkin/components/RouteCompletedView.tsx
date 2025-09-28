import { PackageCheck } from "lucide-react"

export function RouteCompletedView() {
    return (
        <div className="text-center py-8">
            <PackageCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ruta completada</h3>
            <p className="text-muted-foreground">Has finalizado exitosamente la ruta de envío</p>
        </div>
    )
}