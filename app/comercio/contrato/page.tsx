import { ContractPageHeader, ContratoCard } from "./components"
import { createClient } from "@/lib/supabaseServer"
import { getComercioByName } from "@/lib/models/Comercio"
import { Contrato, Servicio } from "@/lib/types"
import { getServicios } from "@/lib/models/Servicio"

export default async function ComercioContratoPage() {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    const metadata = user.user?.user_metadata
    const comercio = await getComercioByName(metadata?.nombreComercio)
    const contrato = comercio!.contrato as Contrato;

    const serviciosDisponibles: Servicio[] = await getServicios(supabase)

    let serviciosActualesIds: number[] = []
    if (contrato) {
        const { data: serviciosActuales } = await supabase
            .from("contrato_servicio")
            .select("id_servicio")
            .eq("id_contrato", contrato.idContrato)
        
        if (serviciosActuales) {
            serviciosActualesIds = serviciosActuales.map(s => s.id_servicio)
        }
    }

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ContractPageHeader />
                <div className="space-y-6">
                        <ContratoCard 
                            comercio={comercio}
                            contrato={contrato}
                            serviciosDisponibles={serviciosDisponibles}
                            serviciosActuales={serviciosActualesIds}
                        />
                
                </div>
            </div>
        </div>
    )
}