import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"
import type { Pedido } from "@/lib/types"
import { PedidosContent } from "./components"

export default async function ComercioPedidosPage() {
    const supabase = await createClient()
    const comercio = await supabase.auth.getUser();
    console.log(comercio.data.user?.user_metadata);
    // TODO: Obtener idComercio de la sesión de Supabase
    const idComercio = null

    let pedidos: Pedido[] = []

    if (idComercio) {
        pedidos = await getPedidosByComercio(supabase, idComercio)
    }

    return <PedidosContent pedidos={pedidos} />
}