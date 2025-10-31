"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sucursal {
    idSucursal: number
    direccionSucursal: string
    ciudadSucursal: string
}

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

interface DatosPedidoProps {
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    sucursales: Sucursal[]
    loading: boolean
    loadingSucursales: boolean
    fieldErrors: Record<string, string>
    onCiudadChange: (ciudad: string) => void
}

export function DatosPedido({ 
    newOrder, 
    setNewOrder, 
    sucursales, 
    loading, 
    loadingSucursales, 
    fieldErrors,
    onCiudadChange 
}: DatosPedidoProps) {
    const ciudadesUnicas = useMemo(() => {
        return Array.from(new Set(sucursales.map(s => s.ciudadSucursal)))
            .filter((ciudad: string) => ciudad && ciudad.trim() !== "")
            .sort()
    }, [sucursales])
    
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Datos del pedido</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Ciudad de destino *</Label>
                    <Select
                        value={newOrder.ciudadDestino}
                        onValueChange={onCiudadChange}
                        disabled={loading || loadingSucursales}
                    >
                        <SelectTrigger className={fieldErrors.ciudadDestino ? "border-red-500 focus:border-red-500" : ""}>
                            <SelectValue placeholder={
                                loadingSucursales 
                                    ? "Cargando sucursales..." 
                                    : sucursales.length === 0 
                                        ? "No hay sucursales disponibles" 
                                        : "Seleccionar ciudad"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {sucursales.length > 0 ? (
                                ciudadesUnicas.map((ciudad: string, index: number) => (
                                    <SelectItem key={`ciudad-${index}-${ciudad}`} value={ciudad}>
                                        {ciudad}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-data" disabled>
                                    {loadingSucursales ? "Cargando..." : "No hay ciudades disponibles"}
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {fieldErrors.ciudadDestino && (
                        <p className="text-sm text-red-600">{fieldErrors.ciudadDestino}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="sucursal">Sucursal de destino</Label>
                    <Input
                        id="sucursal"
                        type="text"
                        value={(() => {
                            const sucursal = sucursales.find(s => s.ciudadSucursal === newOrder.ciudadDestino)
                            return sucursal ? `${sucursal.ciudadSucursal} - ${sucursal.direccionSucursal}` : ""
                        })()}
                        disabled={true}
                        className="bg-gray-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                        id="peso"
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={newOrder.peso || ""}
                        onChange={(e) => setNewOrder({ ...newOrder, peso: Number(e.target.value) })}
                        disabled={loading}
                        className={fieldErrors.peso ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.peso && (
                        <p className="text-sm text-red-600">{fieldErrors.peso}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="fechaLimite">Fecha límite de entrega *</Label>
                    <Input
                        id="fechaLimite"
                        type="date"
                        value={newOrder.fechaLimiteEntrega}
                        onChange={(e) => setNewOrder({ ...newOrder, fechaLimiteEntrega: e.target.value })}
                        disabled={loading}
                        className={fieldErrors.fechaLimiteEntrega ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.fechaLimiteEntrega && (
                        <p className="text-sm text-red-600">{fieldErrors.fechaLimiteEntrega}</p>
                    )}
                </div>
            </div>
        </div>
    )
}