import { createClient } from "@/lib/supabaseServer"
import { getPedidosByComercio } from "@/lib/models/Pedido"
import { mapRowToComercio } from "@/lib/models/Comercio"
import { getSucursalesAlcanzables } from "@/lib/models/Sucursal"
import type { Pedido, Servicio, Sucursal } from "@/lib/types"
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

    const sucursales: Sucursal[] = await getSucursalesAlcanzables(
        supabase,
        comercio.idSucursalOrigen
    )

    const { data: serviciosData } = await supabase
        .from('servicio')
        .select('*')
        .order('nombre_servicio')

    const servicios: Servicio[] = serviciosData?.map(s => ({
        idServicio: s.id_servicio,
        nombreServicio: s.nombre_servicio,
        costoServicio: s.costo_servicio
    })) || []

    return (
        <PedidosContent 
            pedidos={pedidos} 
            comercio={comercio}
            sucursales={sucursales}
            servicios={servicios}
        />
    )
}