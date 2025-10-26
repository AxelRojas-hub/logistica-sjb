import { createClient } from "@/lib/supabaseServer"
import { Servicio } from "@/lib/types"
import CrearContratoForm from "./CrearContratoForm"

export default async function CrearContratoPage() {
    const supabase = await createClient()

    // busca los servicios disponibles
    const { data, error } = await supabase
        .from("servicio")
        .select("*")
        .order("nombre_servicio")

    if (error) {
        console.error("Error fetching servicios:", error)
    }

    const servicios: Servicio[] = data
        ? data.map((s) => ({
            idServicio: s.id_servicio,
            nombreServicio: s.nombre_servicio,
            costoServicio: s.costo_servicio,
        }))
        : []

    return <CrearContratoForm servicios={servicios} />
}
