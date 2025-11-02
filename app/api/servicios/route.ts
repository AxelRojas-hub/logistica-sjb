import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: servicios, error } = await supabase
            .from("servicio")
            .select("*")

        if (error) {
            console.error("Error al obtener servicios:", error)
            return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
        }

        return NextResponse.json(servicios)

    } catch (error) {
        console.error("Error en API de servicios:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}