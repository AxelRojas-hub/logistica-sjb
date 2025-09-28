import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Contract } from "@/lib/types"
import { ContractStatusBadge } from "./ContractStatusBadge"
import { ContractDetails } from "./ContractDetails"
import { IncludedServices } from "./IncludedServices"
import { AvailableServices } from "./AvailableServices"
import { ContractActions } from "./ContractActions"

interface Service {
    id: string
    name: string
    description: string
    monthlyFee: number
}

interface ContractCardProps {
    contract: Contract
    availableServices: Service[]
}

export function ContractCard({ contract, availableServices }: ContractCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Contrato {contract.id}</CardTitle>
                        <CardDescription>Plan de servicios logísticos</CardDescription>
                    </div>
                    <ContractStatusBadge status={contract.status} />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <ContractDetails contract={contract} />
                <IncludedServices services={contract.services} />
                <AvailableServices
                    availableServices={availableServices}
                    includedServices={contract.services}
                />
                <ContractActions />
            </CardContent>
        </Card>
    )
}