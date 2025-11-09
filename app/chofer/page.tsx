import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
    CheckCircle,
    Route
} from "lucide-react"
import Link from "next/link"

export default function ChoferPage() {
    return (
        <TooltipProvider>
            <div className="h-[85dvh] bg-background flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-foreground">Panel de Chofer</h1>
                        <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                    </div>

                        <div className="mb-6 flex justify-end max-w-6xl w-full mx-auto px-2">
                        <Link href="/manuales/G8_Manual de usuario - Administrador-1.pdf" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-muted-foreground hover:text-foreground border-muted hover:border-foreground transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 mr-2"
                                >
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                </svg>
                                Manual de usuario
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Link href="/chofer/checkin">
                            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Check-In</h3>
                                    <p className="text-muted-foreground">Realizar check-in en sucursal</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/chofer/ruta">
                            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <Route className="h-12 w-12 text-purple-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Consultar Ruta</h3>
                                    <p className="text-muted-foreground">Ver información de tu ruta</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}