"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewOrderForm {
    dniCliente: number
    nombreCliente: string
    telefonoCliente: string
    emailCliente: string
    direccionCliente: string
    ciudadDestino: string
    idSucursalDestino: number
    peso: number
    fechaLimiteEntrega: string
    tipoTransporte: number | null
    serviciosOpcionales: number[]
}

interface DatosDestinatarioProps {
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    loading: boolean
    fieldErrors: Record<string, string>
}

export function DatosDestinatario({ 
    newOrder, 
    setNewOrder, 
    loading, 
    fieldErrors 
}: DatosDestinatarioProps) {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Datos del destinatario</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dni">DNI *</Label>
                    <Input
                        id="dni"
                        type="number"
                        placeholder="12345678"
                        value={newOrder.dniCliente || ""}
                        onChange={(e) => setNewOrder({ ...newOrder, dniCliente: Number(e.target.value) })}
                        disabled={loading}
                        className={fieldErrors.dniCliente ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.dniCliente && (
                        <p className="text-sm text-red-600">{fieldErrors.dniCliente}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                        id="nombre"
                        type="text"
                        placeholder="Juan Pérez"
                        value={newOrder.nombreCliente}
                        onChange={(e) => setNewOrder({ ...newOrder, nombreCliente: e.target.value })}
                        disabled={loading}
                        className={fieldErrors.nombreCliente ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.nombreCliente && (
                        <p className="text-sm text-red-600">{fieldErrors.nombreCliente}</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                        id="telefono"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        value={newOrder.telefonoCliente}
                        onChange={(e) => setNewOrder({ ...newOrder, telefonoCliente: e.target.value })}
                        disabled={loading}
                        className={fieldErrors.telefonoCliente ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.telefonoCliente && (
                        <p className="text-sm text-red-600">{fieldErrors.telefonoCliente}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        value={newOrder.emailCliente}
                        onChange={(e) => setNewOrder({ ...newOrder, emailCliente: e.target.value })}
                        disabled={loading}
                        className={fieldErrors.emailCliente ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.emailCliente && (
                        <p className="text-sm text-red-600">{fieldErrors.emailCliente}</p>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                    id="direccion"
                    type="text"
                    placeholder="Calle SJB 123"
                    value={newOrder.direccionCliente}
                    onChange={(e) => setNewOrder({ ...newOrder, direccionCliente: e.target.value })}
                    disabled={loading}
                    className={fieldErrors.direccionCliente ? "border-red-500 focus:border-red-500" : ""}
                />
                {fieldErrors.direccionCliente && (
                    <p className="text-sm text-red-600">{fieldErrors.direccionCliente}</p>
                )}
            </div>
        </section>
    )
}