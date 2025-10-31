import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"
import { mapRowToComercio } from "@/lib/models/Comercio"
import type { Pedido } from "@/lib/types"
import { PedidosContent } from "./components"

export default async function ComercioPedidosPage() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const idCuentaComercio = user.data.user?.user_metadata.idCuentaComercio;
    const { data: comercioData } = await supabase.from('comercio').select('*').eq('id_cuenta_comercio', idCuentaComercio).single();
    
    const comercio = mapRowToComercio(comercioData)
    const idComercio = comercio.idComercio;

    let pedidos: Pedido[] = []

    if (idComercio) {
        pedidos = await getPedidosByComercio(supabase, idComercio)
    }

    return <PedidosContent pedidos={pedidos} comercio={comercio} />
}