import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Comercio, Contrato, Factura, Pedido } from "@/lib/types"
import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"
import { ComerciosTable } from "./components"

interface ComercioWithDetails extends Comercio {
    email?: string
    nombreResponsable?: string
    contrato?: Contrato
    facturas: Factura[]
    pedidos: Pedido[]
}

export default async function AdminComerciosPage() {
    const supabase = await createClient()

    const { data: comercios, error: comerciosError } = await supabase
        .from("comercio")
        .select("*")

    if (comerciosError || !comercios) {
        return <div>Error cargando comercios</div>
    }

    const comerciosConDetalles: ComercioWithDetails[] = await Promise.all(
        comercios.map(async (comercio) => {
            let email = ""
            let nombreResponsable = ""
            let contrato: Contrato | undefined

            const { data: cuentaComercio } = await supabase
                .from("cuenta_comercio")
                .select("*")
                .eq("id_cuenta_comercio", comercio.id_cuenta_comercio)
                .single()

            if (cuentaComercio) {
                email = cuentaComercio.email_comercio
                nombreResponsable = cuentaComercio.nombre_responsable
            }

            const { data: contratoData } = await supabase
                .from("contrato")
                .select("*")
                .eq("id_contrato", comercio.id_contrato)
                .single()

            if (contratoData) {
                contrato = {
                    idContrato: contratoData.id_contrato,
                    tipoCobro: contratoData.tipo_cobro,
                    descuento: contratoData.descuento,
                    estadoContrato: contratoData.estado_contrato,
                    duracionContratoMeses: contratoData.duracion_contrato,
                    fechaFinContrato: contratoData.fecha_fin_contrato,
                }
            }

            const { data: facturas } = await supabase
                .from("factura")
                .select("*")
                .eq("id_comercio", comercio.id_comercio)


            const pedidos = await getPedidosByComercio(supabase, comercio.id_comercio)

            return {
                idComercio: comercio.id_comercio,
                idContrato: comercio.id_contrato,
                idCuentaComercio: comercio.id_cuenta_comercio,
                idSucursalOrigen: comercio.id_sucursal_origen,
                nombreComercio: comercio.nombre_comercio,
                domicilioFiscal: comercio.domicilio_fiscal,
                estadoComercio: comercio.estado_comercio,
                email,
                nombreResponsable,
                contrato,
                facturas: facturas || [],
                pedidos: pedidos
            }
        })
    )
    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Comercios</h1>
                    <p className="mt-2 text-muted-foreground">Administra comercios y contratos del sistema</p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al menú principal
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Lista de Comercios</h2>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Input placeholder="Buscar comercio..." className="w-full sm:w-64" />
                        </div>
                    </div>

                    <div className="bg-accent/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Glosario de Acciones:</h4>
                        <div className="dark:text-gray-300 flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>Ver detalles del comercio</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Historial de pedidos</span>
                            </div>
                        </div>
                    </div>

                    <ComerciosTable comercios={comerciosConDetalles} />
                </div>
            </div>
        </div>
    )
}