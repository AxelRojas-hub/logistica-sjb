import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RouteInfoCard, RoutePageHeader } from "./components"

export default function ChoferRutaPage() {
    // TODO: Obtener datos de ruta desde la API
    const currentRoute = null;

    return (
        <TooltipProvider>
            <div className="h-screen bg-background flex flex-col">
                <div className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground">Consultar Ruta</h1>
                            <p className="mt-2 text-muted-foreground">Ver información detallada de tu ruta asignada</p>
                        </div>

                        {/* Botón para volver al menú principal */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/chofer">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al menú principal
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-6">
                            <RoutePageHeader />
                            <RouteInfoCard currentRoute={currentRoute} />
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}