import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Contrato } from "@/lib/types"
import { ContratoStatusBadge } from "./ContratoStatusBadge"
import { DetalleContrato } from "./DetalleContrato"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface ContratoCardProps {
    contrato: Contrato | null
}

export function ContratoCard({ contrato }: ContratoCardProps) {
    if (!contrato) {
        return (
            <Card>
                <CardContent className=" flex flex-col justify-center gap-4 items-center py-8 text-center text-muted-foreground">
                    No hay contrato activo actualmente
                    <Link href="/comercio/contrato/crear">
                        <Button
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Crear contrato
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Contrato {contrato.idContrato}</CardTitle>
                        <CardDescription>Plan de servicios logísticos</CardDescription>
                    </div>
                    <ContratoStatusBadge status={contrato.estadoContrato} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <DetalleContrato contrato={contrato} />
                <div className="flex gap-2 pt-4 border-t">
                    <Button className="dark:text-white bg-blue-600 hover:bg-blue-700">
                        Renovar Contrato
                    </Button>
                    <Button variant="outline">
                        Modificar Plan
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}