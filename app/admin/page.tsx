import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
    Truck,
    Building2,
    FileText,
    Package
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
                        <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            <Link href="/admin/envios">
                                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500 h-full">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                        <Truck className="h-12 w-12 text-blue-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Envíos</h3>
                                        <p className="text-muted-foreground">Gestiona y monitorea todos los envíos</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/admin/pedidos">
                                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-orange-500 h-full">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                        <Package className="h-12 w-12 text-orange-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Pedidos</h3>
                                        <p className="text-muted-foreground">Gestiona los pedidos de tu sucursal</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/admin/comercios">
                                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500 h-full">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                        <Building2 className="h-12 w-12 text-green-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Comercios</h3>
                                        <p className="text-muted-foreground">Administra comercios y contratos</p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/admin/reportes">
                                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500 h-full">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                                        <FileText className="h-12 w-12 text-purple-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Reportes</h3>
                                        <p className="text-muted-foreground">Genera y visualiza reportes</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
