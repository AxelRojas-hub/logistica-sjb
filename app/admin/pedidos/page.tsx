import { createClient } from "@/lib/supabaseServer"
import { getPedidos } from "@/lib/models/Pedido"
import { PedidosAdminContent } from "./components"

export default async function AdminPedidosPage() {
    const supabase = await createClient()
    const pedidos = await getPedidos(supabase)

    return <PedidosAdminContent pedidos={pedidos} />
}