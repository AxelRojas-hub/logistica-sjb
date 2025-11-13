import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getQuickStats } from "@/lib/models/Stats"
import { QuickStats, DebtReportGenerator, BillingReportGenerator } from "./components"

export default async function AdminReportesPage() {
    const stats = await getQuickStats();

    return (
        <TooltipProvider>
            <div className="min-h-[85dvh] bg-background pt-4 flex flex-col">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
                        <p className="mt-2 text-muted-foreground">Genera reportes detallados del sistema</p>
                    </div>

                    {/* Botón para volver al menú principal */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al menú principal
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Reporte de Comercios Morosos</CardTitle>
                                    <CardDescription>Genera un reporte con comercios que tienen facturas vencidas o pendientes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DebtReportGenerator />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Reporte de Facturación por Período</CardTitle>
                                    <CardDescription>
                                        Genera un reporte de facturación en un rango de fechas específico
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BillingReportGenerator />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Stats */}
                        <QuickStats stats={stats} />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}