import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ContractPageHeader() {

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Mi Contrato</h1>
                <p className="mt-2 text-muted-foreground">Gestiona tu contrato y servicios logísticos</p>
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

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Contrato Actual</h2>
            </div>
        </div>
    )
}