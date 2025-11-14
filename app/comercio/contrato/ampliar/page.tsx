import { createClient } from "@/lib/supabaseServer"
import { getComercioByName } from "@/lib/models/Comercio"
import { Contrato } from "@/lib/types"
import { redirect } from "next/navigation"
import AmpliarContratoForm from "./AmpliarContratoForm"

export default async function AmpliarContratoPage() {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    const metadata = user.user?.user_metadata
    const comercio = await getComercioByName(metadata?.nombreComercio)
    const contratoActual = comercio!.contrato as Contrato

    if (!contratoActual || contratoActual.estadoContrato !== 'vigente') {
        redirect('/comercio/contrato')
    }

    const { data: servicios } = await supabase
        .from('servicio')
        .select('*')
        .order('nombre_servicio')

    // Mapear servicios de snake_case a camelCase
    const serviciosMapeados = servicios?.map((s) => ({
        idServicio: s.id_servicio,
        nombreServicio: s.nombre_servicio,
        costoServicio: s.costo_servicio
    })) || []

    const { data: serviciosActuales } = await supabase
        .from('contrato_servicio')
        .select('id_servicio')
        .eq('id_contrato', contratoActual.idContrato)

    const idsServiciosActuales = serviciosActuales?.map(s => s.id_servicio) || []

    return (
        <AmpliarContratoForm 
            contratoActual={contratoActual}
            serviciosDisponibles={serviciosMapeados}
            serviciosActualesIds={idsServiciosActuales}
        />
    )
}
