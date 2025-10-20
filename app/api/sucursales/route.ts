import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("sucursal")
            .select("id_sucursal, direccion_sucursal, ciudad_sucursal")
            .order("ciudad_sucursal");

        if (error) {
            return NextResponse.json(
                { error: "Error al obtener sucursales" },
                { status: 500 }
            );
        }

        // Mapear snake_case a camelCase
        const sucursales = data.map(s => ({
            idSucursal: s.id_sucursal,
            direccionSucursal: s.direccion_sucursal,
            ciudadSucursal: s.ciudad_sucursal,
        }));

        return NextResponse.json(sucursales);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
