import { mockContract, mockAvailableServices } from "@/lib/mock-data"
import { ContractPageHeader, ContractCard } from "./components"

export default function ComercioContratoPage() {
    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ContractPageHeader />

                <div className="space-y-6">
                    <ContractCard
                        contract={mockContract}
                        availableServices={mockAvailableServices}
                    />
                </div>
            </div>
        </div>
    )
}