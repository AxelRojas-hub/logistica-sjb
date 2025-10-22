import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"
import type { Pedido } from "@/lib/types"
import { PedidosContent } from "./components"

export default async function ComercioPedidosPage() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();
    const idCuentaComercio = user.data.user?.user_metadata.idCuentaComercio;
    const comercio = await supabase.from('comercio').select('*').eq('id_cuenta_comercio', idCuentaComercio).single();
    console.log(comercio);
    const idComercio = comercio.data.id_comercio;

    let pedidos: Pedido[] = []

    if (idComercio) {
        pedidos = await getPedidosByComercio(supabase, idComercio)
    }

    return <PedidosContent pedidos={pedidos} />
}