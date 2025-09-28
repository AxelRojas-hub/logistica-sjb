import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function PageHeader() {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/envios">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </Link>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Crear envío</h1>
        </div>
    )
}