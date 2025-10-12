import { Factura } from "@/lib/types";
import { FacturaPageHeader, FacturasTable } from "./components"

export default function ComercioFacturasPage() {
    // TODO: Obtener facturas desde la API
    const invoices: Factura[] = [];

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FacturaPageHeader />

                <div className="space-y-6">
                    <FacturasTable invoices={invoices} />
                </div>
            </div>
        </div>
    )
}