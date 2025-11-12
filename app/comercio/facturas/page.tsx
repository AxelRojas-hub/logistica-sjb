import { Factura } from "@/lib/types";
import { FacturaPageHeader, FacturasTable } from "./components"
import { createClient } from "@/lib/supabaseServer";
import { getComercioByName } from "@/lib/models/Comercio";

export default async function ComercioFacturasPage() {
    const supabase = await createClient()
    const comercio = await supabase.auth.getUser()
    const nombreComercio = comercio.data.user?.user_metadata.nombreComercio;
    const dataComercio = await getComercioByName(nombreComercio)

    const invoices: Factura[] = dataComercio?.facturas || [];

    // Obtener información de la sucursal origen
    let sucursalOrigen = undefined;
    if (dataComercio?.idSucursalOrigen) {
        const { data: sucursal } = await supabase
            .from('sucursal')
            .select('direccion_sucursal, ciudad_sucursal')
            .eq('id_sucursal', dataComercio.idSucursalOrigen)
            .single();

        if (sucursal) {
            sucursalOrigen = {
                direccionSucursal: sucursal.direccion_sucursal,
                ciudadSucursal: sucursal.ciudad_sucursal
            };
        }
    }

    // Información del comercio para el PDF
    const comercioInfo = {
        nombreComercio: dataComercio?.nombreComercio || 'Comercio',
        direccion: dataComercio?.domicilioFiscal || 'Dirección no disponible',
        telefono: undefined, // TODO: Agregar teléfono si está disponible
        email: dataComercio?.email || undefined,
        sucursalOrigen
    };

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FacturaPageHeader />

                <div className="space-y-6">
                    <FacturasTable invoices={invoices} comercioInfo={comercioInfo} />
                </div>
            </div>
        </div>
    )
}