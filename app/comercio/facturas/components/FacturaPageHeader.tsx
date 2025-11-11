import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function FacturaPageHeader() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Historial de Facturas</h1>
                <p className="mt-2 text-muted-foreground">Consulta y gestiona tu historial de facturación</p>
            </div>

            {/* Botón para volver al menú principal */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/comercio">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al menú principal
                    </Button>
                </Link>
            </div>
        </div>
    )
}