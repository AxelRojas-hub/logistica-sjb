import { Truck } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">

                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">

                        <div className="flex justify-center">
                            <div className="relative">
                                <Truck className="h-16 w-16 text-primary animate-bounce" />
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-foreground">
                                Cargando pedidos
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Obteniendo información de envíos y rutas disponibles...
                            </p>
                        </div>

                        <div className="flex justify-center pt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
