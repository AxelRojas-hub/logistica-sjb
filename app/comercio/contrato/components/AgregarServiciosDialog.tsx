"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" 
import { Contrato, Servicio } from "@/lib/types"
import { agregarServiciosAlContrato } from "../actions"

interface AgregarServiciosDialogProps {
    contrato: Contrato | null
    serviciosDisponibles: Servicio[] 
    serviciosActuales: number[]
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function AgregarServiciosDialog({
    contrato,
    serviciosDisponibles,
    serviciosActuales,
    isOpen,
    onOpenChange,
}: AgregarServiciosDialogProps) {
    
    const [isPending, startTransition] = useTransition();
    const [selectedServices, setSelectedServices] = useState<number[]>(serviciosActuales);

    if (!contrato) return null;

    const handleCheckboxChange = (idServicio: number) => {
    setSelectedServices((prev) =>
        prev.includes(idServicio)
        ? prev.filter((id) => id !== idServicio) // Si ya estaba, lo saca
        : [...prev, idServicio] // Si no estaba, lo agrega
    );
    };

  // confirmar
    const handleSubmit = async () => {
    startTransition(async () => {
        const result = await agregarServiciosAlContrato({
        idContrato: contrato.idContrato,
        idServicios: selectedServices, 
        });

        if (result.success) {
        onOpenChange(false);
        } else {
        alert(`Error: ${result.message}`);
        }
    });
    };

    return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
        <DialogHeader>
            <DialogTitle>Añadir Servicios al Contrato (R-10)</DialogTitle>
            <DialogDescription>
            Selecciona los servicios adicionales que quieres incluir.
            </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
            <h4 className="font-medium">Servicios Disponibles</h4>
            {serviciosDisponibles.map((servicio) => (
            <div key={servicio.idServicio} className="flex items-center space-x-2">
                <Checkbox
                id={`servicio-${servicio.idServicio}`}
                onCheckedChange={() => handleCheckboxChange(servicio.idServicio)}
                checked={selectedServices.includes(servicio.idServicio)}
                />
                <label
                htmlFor={`servicio-${servicio.idServicio}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                {servicio.nombreServicio} (${servicio.costoServicio})
                </label>
            </div>
            ))}
        </div>

        <DialogFooter>
            <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Actualizando..." : "Confirmar Servicios"}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}