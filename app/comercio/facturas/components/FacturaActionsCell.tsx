import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, CreditCard, Loader2 } from "lucide-react"
import type { Factura } from "@/lib/types"
import { useInvoicePDF } from "../hooks/useInvoicePDF"

interface FacturaActionsCellProps {
    invoice: Factura
    onViewInvoice: (invoice: Factura) => void
    comercioInfo: {
        nombreComercio: string
        direccion: string
        telefono?: string
        email?: string
        sucursalOrigen?: {
            direccionSucursal: string
            ciudadSucursal: string
        }
    }
}

export function FacturaActionsCell({ invoice, onViewInvoice, comercioInfo }: FacturaActionsCellProps) {
    const { generatePDF, isGenerating } = useInvoicePDF()

    const handleDownloadPDF = async () => {
        try {
            await generatePDF(invoice, comercioInfo)
        } catch (error) {
            console.error('Error descargando factura:', error)
            // TODO: Mostrar toast de error
        }
    }

    return (
        <div className="flex gap-1">
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewInvoice(invoice)}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Download className="h-4 w-4" />
                )}
            </Button>
            {invoice.estadoPago !== "pagado" && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CreditCard className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}