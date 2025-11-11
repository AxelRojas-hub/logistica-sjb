import { Card, CardContent } from "@/components/ui/card"
import {
    Package,
    FileText,
    ScrollText,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ComercioPage() {
    return (
        <div className="h-[85dvh] bg-background pt-4 flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground">Panel de Comercio</h1>
                    <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                </div>

                    <div className="mb-6 flex justify-end max-w-6xl w-full mx-auto px-2">
                        <Link href="/manuales/G8_Manual de usuario - Comercio.pdf" target="_blank" rel="noopener noreferrer">
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

                <div className="flex-1 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Link href="/comercio/pedidos">
                            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <Package className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Pedidos</h3>
                                    <p className="text-muted-foreground">Gestiona tus pedidos y entregas</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/comercio/facturas">
                            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <FileText className="h-12 w-12 text-green-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Facturas</h3>
                                    <p className="text-muted-foreground">Consulta tu historial de facturación</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/comercio/contrato">
                            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500 h-full">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                    <ScrollText className="h-12 w-12 text-purple-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">Mi Contrato</h3>
                                    <p className="text-muted-foreground">Gestiona tu contrato y servicios</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
