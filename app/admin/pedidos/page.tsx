import { createClient } from "@/lib/supabaseServer"
import { getPedidosPorSucursalAdmin } from "@/lib/models/Pedido"
import { PedidosAdminContent } from "./components"

export default async function AdminPedidosPage() {
    const supabase = await createClient()
    const { pedidos, idSucursalAdmin } = await getPedidosPorSucursalAdmin(supabase)

    return <PedidosAdminContent pedidos={pedidos} idSucursalAdmin={idSucursalAdmin} />
}