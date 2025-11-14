"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, CreditCard } from "lucide-react"
import Link from "next/link"
import type { Contrato, Servicio } from "@/lib/types"

interface AmpliarContratoFormProps {
    contratoActual: Contrato
    serviciosDisponibles: Servicio[]
    serviciosActualesIds: number[]
}

export default function AmpliarContratoForm({ 
    contratoActual, 
    serviciosDisponibles,
    serviciosActualesIds 
}: AmpliarContratoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [serviciosNuevos, setServiciosNuevos] = useState<number[]>([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const serviciosParaAgregar = serviciosDisponibles.filter(
        s => !serviciosActualesIds.includes(s.idServicio)
    )

    const serviciosActuales = serviciosDisponibles.filter(
        s => serviciosActualesIds.includes(s.idServicio)
    )

    const toggleServicio = (idServicio: number) => {
        setServiciosNuevos((prev) =>
            prev.includes(idServicio)
                ? prev.filter((id) => id !== idServicio)
                : [...prev, idServicio]
        )
    }

    const calcularCostoTotal = () => {
        return serviciosParaAgregar
            .filter(s => serviciosNuevos.includes(s.idServicio))
            .reduce((total, s) => total + s.costoServicio, 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")

        if (serviciosNuevos.length === 0) {
            setError("Debe seleccionar al menos un servicio nuevo")
            return
        }

        setLoading(true)

        try {
            // TODO: Implementar pasarela de MP para cobrar los servicios nuevos
            //const costoTotal = calcularCostoTotal()
            
            const apiResponse = true // Simulación de respuesta de MP

            if (apiResponse) {
                const response = await fetch("/api/contratos/ampliar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idContrato: contratoActual.idContrato,
                        serviciosNuevos
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Error al ampliar el contrato")
                }

                setMessage("Contrato ampliado exitosamente")
                setTimeout(() => router.push("/comercio/contrato"), 1500)
            }
        } catch (err) {
            console.error("Error:", err)
            setError(err instanceof Error ? err.message : "Ocurrió un error")
        } finally {
            setLoading(false)
        }
    }

    const costoTotal = calcularCostoTotal()

    return (
        <div className="min-h-screen bg-background pt-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio/contrato">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Ampliar Plan de Contrato</h1>
                        <p className="text-muted-foreground">
                            Agregue servicios adicionales a su contrato vigente
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Contrato Actual */}
                    <Card className="border-blue-200 dark:border-blue-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Contrato Actual
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Duración</p>
                                <p className="font-semibold">{contratoActual.duracionContratoMeses} meses</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de Cobro</p>
                                <Badge variant="outline" className="capitalize">
                                    {contratoActual.tipoCobro}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Descuento</p>
                                <p className="font-semibold">{contratoActual.descuento}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Vencimiento</p>
                                <p className="font-semibold">
                                    {new Date(contratoActual.fechaFinContrato!).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Servicios Actuales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Servicios Incluidos</CardTitle>
                            <CardDescription>Ya activos en su plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {serviciosActuales.map((servicio) => (
                                    <div
                                        key={servicio.idServicio}
                                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked disabled />
                                            <p className="font-medium">{servicio.nombreServicio}</p>
                                        </div>
                                        <p className="font-semibold">${servicio.costoServicio.toLocaleString(
                                                            "es-AR",
                                                            { minimumFractionDigits: 2 }
                                                        )}/mes</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Servicios Disponibles */}
                    {serviciosParaAgregar.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Agregar Servicios</CardTitle>
                                <CardDescription>Seleccione servicios adicionales</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    {serviciosParaAgregar.map((servicio) => {
                                        const isSelected = serviciosNuevos.includes(servicio.idServicio)
                                        return (
                                            <div
                                                key={servicio.idServicio}
                                                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                                                    isSelected ? "border-primary bg-primary/5" : ""
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleServicio(servicio.idServicio)}
                                                    />
                                                    <label className="font-medium cursor-pointer" onClick={() => toggleServicio(servicio.idServicio)}>
                                                        {servicio.nombreServicio}
                                                    </label>
                                                </div>
                                                <p className="font-semibold">${servicio.costoServicio.toLocaleString(
                                                            "es-AR",
                                                            { minimumFractionDigits: 2 }
                                                        )}/mes</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Ya tiene todos los servicios disponibles
                            </CardContent>
                        </Card>
                    )}

                    {/* Resumen */}
                    {serviciosNuevos.length > 0 && (
                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Resumen de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="font-semibold">Total a pagar:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ${costoTotal.toLocaleString("es-AR",{ minimumFractionDigits: 2})}/mes
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Pago por servicios adicionales.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
                            {message}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Link href="/comercio/contrato" className="flex-1">
                            <Button type="button" variant="outline" className="w-full" disabled={loading}>
                                Cancelar
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={loading || serviciosNuevos.length === 0}
                        >
                            {loading ? "Procesando..." : "Confirmar Ampliación"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
