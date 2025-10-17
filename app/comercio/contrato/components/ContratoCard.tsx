import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Contrato } from "@/lib/types"
import { ContratoStatusBadge } from "./ContratoStatusBadge"
import { DetalleContrato } from "./DetalleContrato"
import { ContratoActions } from "./ContratoActions"

interface ContratoCardProps {
    contract: Contrato | null
}

export function ContratoCard({ contract }: ContratoCardProps) {
    if (!contract) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No hay contrato activo actualmente
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Contrato {contract.idContrato}</CardTitle>
                        <CardDescription>Plan de servicios logísticos</CardDescription>
                    </div>
                    <ContratoStatusBadge status={contract.estadoContrato} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <DetalleContrato contract={contract} />
                <ContratoActions />
            </CardContent>
        </Card>
    )
}