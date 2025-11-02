import { Card, CardContent } from "@/components/ui/card"
import {
    Package,
    FileText,
    ScrollText,
} from "lucide-react"
import Link from "next/link"

export default async function ComercioPage() {
    return (
        <div className="h-[85dvh] bg-background pt-4 flex flex-col items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground">Panel de Comercio</h1>
                    <p className="mt-2 text-muted-foreground">Selecciona una opción para continuar</p>
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
