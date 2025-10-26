"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CobroContrato, Servicio } from "@/lib/types"
import { ArrowLeft, Package, Calendar, CreditCard, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CrearContratoFormProps {
    servicios: Servicio[]
}

export default function CrearContratoForm({ servicios }: CrearContratoFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [tipoCobro, setTipoCobro] = useState<CobroContrato>("mensual")
    const [duracionMeses, setDuracionMeses] = useState<3 | 6 | 12>(3)
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const toggleServicio = (idServicio: number) => {
        setServiciosSeleccionados((prev) =>
            prev.includes(idServicio)
                ? prev.filter((id) => id !== idServicio)
                : [...prev, idServicio]
        )
    }

    // Calcular descuento según duración del contrato
    const calcularDescuento = (): number => {
        if (duracionMeses === 6) return 10
        if (duracionMeses === 12) return 15
        return 0
    }

    const calcularCostoTotal = () => {
        const serviciosCosto = servicios
            .filter((s) => serviciosSeleccionados.includes(s.idServicio))
            .reduce((total, s) => total + s.costoServicio, 0)

        const descuento = calcularDescuento()
        const costoConDescuento = serviciosCosto * (1 - descuento / 100)
        const multiplicador = tipoCobro === "mensual" ? 1 : 0.5
        const costoPorPeriodo = costoConDescuento * multiplicador

        return {
            costoPorPeriodo,
            costoMensual: costoConDescuento,
            costoTotal: costoConDescuento * duracionMeses,
            descuento,
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")

        // Validaciones
        if (serviciosSeleccionados.length === 0) {
            setError("Debe seleccionar al menos un servicio")
            return
        }

        setLoading(true)

        // Calcula la fecha de fin del contrato
        const fechaFinContrato = new Date()
        fechaFinContrato.setMonth(fechaFinContrato.getMonth() + duracionMeses)

        try {
            // TODO: Aca habria que implementar la pasarela de MP
            const costos = calcularCostoTotal()

            //TODO: La creación del contrato seria condicional a la respuesta de MP
            const apiResponse = true;

            if (apiResponse) {
                const response = await fetch("/api/contratos/crear", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tipoCobro,
                        duracionMeses,
                        serviciosSeleccionados,
                        descuento: costos.descuento,
                        fechaFinContrato: fechaFinContrato.toISOString().split("T")[0],
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Error al crear el contrato")
                }

                setMessage("Contrato creado exitosamente")
                router.push("/comercio/contrato")
            }
        } catch (err) {
            console.error("Error:", err)
            const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al procesar el contrato"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const costos = calcularCostoTotal()

    return (
        <div className="min-h-screen bg-background pt-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio/contrato">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Nuevo Contrato</h1>
                        <p className="text-muted-foreground">
                            Configure los detalles de su contrato de servicios logísticos
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Configuración Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Configuración del Contrato
                            </CardTitle>
                            <CardDescription>
                                Seleccione la duración y tipo de cobro
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex w-full justify-start gap-12 space-y-4">
                            {/* Duración */}
                            <div className="space-y-2">
                                <Label htmlFor="duracion">Duración del Contrato</Label>
                                <Select
                                    value={duracionMeses.toString()}
                                    onValueChange={(val) => setDuracionMeses(Number(val) as 3 | 6 | 12)}
                                >
                                    <SelectTrigger id="duracion">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 meses</SelectItem>
                                        <SelectItem value="6">6 meses</SelectItem>
                                        <SelectItem value="12">12 meses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tipo de Cobro */}
                            <div className="space-y-2">
                                <Label htmlFor="tipoCobro">Frecuencia de Cobro</Label>
                                <Select
                                    value={tipoCobro}
                                    onValueChange={(val) => setTipoCobro(val as CobroContrato)}
                                >
                                    <SelectTrigger id="tipoCobro">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mensual">Mensual</SelectItem>
                                        <SelectItem value="quincenal">Quincenal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Información de Descuento */}
                            {calcularDescuento() > 0 && (
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-sm text-green-800">
                                        <strong>Descuento del {calcularDescuento()}%</strong>
                                        <br />
                                        Por contratar {duracionMeses} meses sin deudas
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Servicios */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Servicios
                            </CardTitle>
                            <CardDescription>
                                Seleccione los servicios que desea incluir en el contrato
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {servicios.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No hay servicios disponibles
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {servicios.map((servicio) => {
                                        const isSelected = serviciosSeleccionados.includes(
                                            servicio.idServicio
                                        )
                                        return (
                                            <div
                                                key={servicio.idServicio}
                                                className={`flex items-center gap-3 p-3 rounded-md border-2 transition-colors ${isSelected ? "border-green-500" : "border-border"
                                                    }`}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() =>
                                                        toggleServicio(servicio.idServicio)
                                                    }
                                                />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="font-medium">
                                                        {servicio.nombreServicio}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ${servicio.costoServicio.toLocaleString(
                                                            "es-AR",
                                                            { minimumFractionDigits: 2 }
                                                        )}/mes
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resumen de Costos */}
                    {serviciosSeleccionados.length > 0 && (
                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Resumen de Costos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Costo mensual base:</span>
                                    <span className="font-medium">
                                        ${costos.costoMensual.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                {costos.descuento > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Descuento aplicado:</span>
                                        <Badge variant="secondary">{costos.descuento}%</Badge>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Costo por pago ({tipoCobro}):
                                    </span>
                                    <span className="font-medium">
                                        ${costos.costoPorPeriodo.toLocaleString("es-AR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            Costo total ({duracionMeses} meses):
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            ${costos.costoTotal.toLocaleString("es-AR", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Messages */}
                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                            {message}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/comercio/contrato" className="flex-1">
                            <Button type="button" variant="outline" className="w-full">
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading || serviciosSeleccionados.length === 0}
                            className="flex-1"
                        >
                            <CreditCard className="h-4 w-4 mr-2" />
                            {loading ? "Procesando..." : "Proceder al Pago"}
                        </Button>
                    </div>

                    {/* Nota sobre MercadoPago */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground text-center">
                                <strong>Nota:</strong> El pago se procesará a través de MercadoPago.
                                La integración se implementará próximamente.
                            </p>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
