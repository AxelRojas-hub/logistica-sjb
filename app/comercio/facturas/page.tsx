import { mockInvoices } from "@/lib/mock-data"
import { InvoicePageHeader, InvoicesTable } from "./components"

export default function ComercioFacturasPage() {
    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InvoicePageHeader />

                <div className="space-y-6">
                    <InvoicesTable invoices={mockInvoices} />
                </div>
            </div>
        </div>
    )
}