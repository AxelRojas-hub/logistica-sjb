import { Calendar, DollarSign } from "lucide-react"
import type { Contract } from "@/lib/types"

interface ContractDetailsProps {
    contract: Contract
}

export function ContractDetails({ contract }: ContractDetailsProps) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div>
                <p className="text-sm text-gray-500">Fecha inicio</p>
                <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {contract.startDate}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Fecha fin</p>
                <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {contract.endDate}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Tarifa mensual</p>
                <p className="font-bold text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ${contract.monthlyFee.toLocaleString()}
                </p>
            </div>
        </div>
    )
}