import { Truck } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-[85dvh] bg-background flex items-center justify-center">
            <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8">

                <div className="flex items-center justify-center">
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
                                Cargando envíos...
                            </h3>
                            <span className="text-foreground">Buscando rutas y sucursales</span>
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