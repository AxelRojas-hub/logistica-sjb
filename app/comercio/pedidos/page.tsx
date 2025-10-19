import { createClient } from "@/lib/supabaseServer"
import type { Pedido } from "@/lib/types"
import { PedidosContent } from "./components"

export default async function ComercioPedidosPage() {
    const supabase = await createClient()

    // TODO: Obtener nombre_comercio de la sesión de Supabase
    const nombreComercio = null

    let pedidos: Pedido[] = []

    if (nombreComercio) {
        const { data, error } = await supabase
            .from("pedido")
            .select("*")
            .eq("id_comercio", nombreComercio)

        if (error) {
            console.error("Error fetching pedidos:", error)
        } else {
            pedidos = data || []
        }
    }

    return <PedidosContent pedidos={pedidos} />
}