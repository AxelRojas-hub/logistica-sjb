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
    const { data: comercioData } = await supabase
        .from('comercio')
        .select('*, contrato(estado_contrato)')
        .eq('id_cuenta_comercio', idCuentaComercio)
        .single();
    
    const comercio = mapRowToComercio(comercioData)
    // Agregar estado del contrato si existe
    if (comercioData?.contrato) {
        const contrato = Array.isArray(comercioData.contrato) ? comercioData.contrato[0] : comercioData.contrato
        comercio.estadoContrato = (contrato as { estado_contrato: string })?.estado_contrato as typeof comercio.estadoContrato
    }
    const idComercio = comercio.idComercio;

    let pedidos: Pedido[] = []
    if (idComercio) {
        pedidos = await getPedidosByComercio(supabase, idComercio)
    }

    const sucursales: Sucursal[] = await getSucursalesAlcanzables(
        supabase,
        comercio.idSucursalOrigen
    )

    // Servicios x contrato
    let servicioTransporte: Servicio | null = null
    let serviciosOpcionales: Servicio[] = []

    if (comercio.idContrato) {
        const { data: contratoServiciosData } = await supabase
            .from('contrato_servicio')
            .select(`
                id_servicio,
                servicio:id_servicio (
                    id_servicio,
                    nombre_servicio,
                    costo_servicio
                )
            `)
            .eq('id_contrato', comercio.idContrato)

        if (contratoServiciosData) {
            type ServicioRow = { id_servicio: number; nombre_servicio: string; costo_servicio: number }
            const serviciosContratados = contratoServiciosData.map(cs => {
                const servicio = (Array.isArray(cs.servicio) ? cs.servicio[0] : cs.servicio) as ServicioRow
                return {
                    idServicio: servicio.id_servicio,
                    nombreServicio: servicio.nombre_servicio,
                    costoServicio: servicio.costo_servicio
                }
            })

            // Separar transporte de servicios opcionales
            servicioTransporte = serviciosContratados.find(s => 
                s.nombreServicio.toLowerCase().includes('transporte')
            ) || null

            serviciosOpcionales = serviciosContratados.filter(s => 
                !s.nombreServicio.toLowerCase().includes('transporte')
            )
        }
    }

    return (
        <PedidosContent 
            pedidos={pedidos} 
            comercio={comercio}
            sucursales={sucursales}
            servicioTransporte={servicioTransporte}
            serviciosOpcionales={serviciosOpcionales}
        />
    )
}