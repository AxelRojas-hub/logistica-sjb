"use server" 

import { createClient } from "@/lib/supabaseServer"
import { revalidatePath } from "next/cache" 



type AddServicesPayload = {
  idContrato: number;

  idServicios: number[]; 
};

export async function agregarServiciosAlContrato(payload: AddServicesPayload) {
  const supabase = await createClient();

  try {

    const { error: deleteError } = await supabase
      .from("contrato_servicio") 
      .delete()
      .eq("id_contrato", payload.idContrato);

    if (deleteError) {
      console.error("Error al limpiar servicios antiguos:", deleteError);
      return { success: false, message: deleteError.message };
    }

    const nuevosServicios = payload.idServicios.map(idServ => ({
      id_contrato: payload.idContrato,
      id_servicio: idServ,
    }));

    const { error: insertError } = await supabase
      .from("contrato_servicio")
      .insert(nuevosServicios);

    if (insertError) {
      console.error("Error al insertar nuevos servicios:", insertError);
      return { success: false, message: insertError.message };
    }

    revalidatePath("/comercio/contrato");
    return { success: true, message: "¡Servicios actualizados!" };

  } catch (err) {
    console.error("Error inesperado:", err);
    return { success: false, message: "Error inesperado en el servidor." };
  }
}


