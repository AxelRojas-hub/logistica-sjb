import { ContractPageHeader, ContratoCard } from "./components"

export default function ComercioContratoPage() {
    // TODO: Obtener contrato desde la API
    const contract = null

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ContractPageHeader />

                <div className="space-y-6">
                    <ContratoCard contract={contract} />
                </div>
            </div>
        </div>
    )
}