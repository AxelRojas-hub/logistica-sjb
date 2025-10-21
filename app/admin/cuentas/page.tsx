import { Button } from "@/components/ui/button";
import CreateAccountForm from "./components/CreateAccountForm";
import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export const dynamic = "force-dynamic";
interface Sucursal {
    idSucursal: number;
    direccionSucursal: string;
    ciudadSucursal: string;
}

export default async function CuentasPage() {
    let sucursales: Sucursal[] = [];

    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("sucursal")
            .select("id_sucursal, direccion_sucursal, ciudad_sucursal")
            .order("ciudad_sucursal");

        if (!error && data) {
            sucursales = data.map((s) => ({
                idSucursal: s.id_sucursal,
                direccionSucursal: s.direccion_sucursal,
                ciudadSucursal: s.ciudad_sucursal,
            }));
        }
    } catch (error) {
        console.error("Error fetching sucursales:", error);
    }

    return <CreateAccountForm sucursales={sucursales} />;

}
