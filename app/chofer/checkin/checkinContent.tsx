"use client"

import { useState, useTransition, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { RouteStatusCard } from "./components"
import type { RutaConTramos, Tramo } from "@/lib/types"
import { updateEnvioSucursalActual, finalizarEnvio } from "./actions"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TramoConEstado extends Tramo {
    estado: "completado" | "actual" | "pendiente"
}

interface RutaConEstado extends RutaConTramos {
    tramos: TramoConEstado[]
    tramoActual: number | null
}

interface CheckinContentProps {
    initialRoute: RutaConEstado | null
}

export function CheckinContent({ initialRoute }: CheckinContentProps) {
    const [currentRoute, setCurrentRoute] = useState<RutaConEstado | null>(() => {
        if (!initialRoute) return null

        // Mapear los tramos a TramoConEstado con estados basados en tramoActual
        const tramosConEstado: TramoConEstado[] = initialRoute.tramos.map((tramo, index) => {
            let estado: "completado" | "actual" | "pendiente"

            if (initialRoute.tramoActual === null) {
                // Si no hay tramoActual, el primero es actual
                estado = index === 0 ? "actual" : "pendiente"
            } else if (index < initialRoute.tramoActual) {
                estado = "completado"
            } else if (index === initialRoute.tramoActual) {
                estado = "actual"
            } else {
                estado = "pendiente"
            }

            return { ...tramo, estado }
        })

        return {
            ...initialRoute,
            tramos: tramosConEstado
        }
    })
    const [pendingSucursal, setPendingSucursal] = useState<number | null>(null)
    const [, startTransition] = useTransition()

    // Estados para los modales de confirmación
    const [showCheckinDialog, setShowCheckinDialog] = useState(false)
    const [showFinishDialog, setShowFinishDialog] = useState(false)
    const [pendingTramoIndex, setPendingTramoIndex] = useState<number | null>(null)

    // actualiza la sucursal cuando cambia pendingSucursal
    useEffect(() => {
        if (pendingSucursal === null) return
        startTransition(async () => {
            try {
                await updateEnvioSucursalActual(pendingSucursal)
            } catch (error) {
                console.error("Error al actualizar sucursal:", error)
            }
            setPendingSucursal(null)
        })
    }, [pendingSucursal])

    const handleCheckIn = (tramoIndex: number) => {
        setPendingTramoIndex(tramoIndex)
        setShowCheckinDialog(true)
    }

    const handleConfirmCheckIn = () => {
        if (pendingTramoIndex === null) return

        setCurrentRoute(prev => {
            if (!prev) return null

            const tramoActual = prev.tramos[pendingTramoIndex]
            const idSucursalActual = tramoActual.idSucursalOrigen

            setPendingSucursal(idSucursalActual)

            return {
                ...prev,
                tramos: prev.tramos.map((tramo, index) => {
                    if (index === pendingTramoIndex) {
                        // El tramo clickeado ahora es el actual
                        return { ...tramo, estado: "actual" as const }
                    }
                    if (index < pendingTramoIndex) {
                        // Todos los tramos anteriores son completados
                        return { ...tramo, estado: "completado" as const }
                    }
                    // Los tramos posteriores son pendientes
                    return { ...tramo, estado: "pendiente" as const }
                }),
                tramoActual: pendingTramoIndex
            }
        })

        setShowCheckinDialog(false)
        setPendingTramoIndex(null)
    }

    const handleFinishRoute = () => {
        setShowFinishDialog(true)
    }

    const handleConfirmFinishRoute = () => {
        setCurrentRoute(null)

        startTransition(async () => {
            try {
                await finalizarEnvio()
            } catch (error) {
                console.error("Error al finalizar envío:", error)
            }
        })

        setShowFinishDialog(false)
    }

    const getNextTramo = (): Tramo | null => {
        if (!currentRoute) return null
        const currentIndex = currentRoute.tramos.findIndex(tramo => tramo.estado === "actual")
        return currentRoute.tramos[currentIndex + 1] || null
    }

    const isLastTramo = () => {
        if (!currentRoute) return false
        const currentIndex = currentRoute.tramos.findIndex(tramo => tramo.estado === "actual")
        return currentIndex === currentRoute.tramos.length - 1
    }

    return (
        <>
            {!currentRoute ? (
                <div className="text-center py-12 text-muted-foreground">
                    No hay ruta asignada actualmente
                </div>
            ) : (
                <div className="space-y-6">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {currentRoute.nombreRuta} - {currentRoute.tramos[0].nombreSucursalOrigen} a {currentRoute.tramos[currentRoute.tramos.length - 1].nombreSucursalDestino}
                    </Badge>

                    <RouteStatusCard
                        currentRoute={currentRoute}
                        onCheckIn={handleCheckIn}
                        onFinishRoute={handleFinishRoute}
                        getNextTramo={getNextTramo}
                        isLastTramo={isLastTramo}
                    />
                </div>
            )}

            {/* Modal de confirmación para check-in */}
            <AlertDialog open={showCheckinDialog} onOpenChange={setShowCheckinDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar llegada</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingTramoIndex !== null && currentRoute &&
                                `¿Querés confirmar que llegaste a ${currentRoute.tramos[pendingTramoIndex].nombreSucursalOrigen}? Esto no se puede deshacer.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingTramoIndex(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCheckIn}>
                            Confirmar llegada
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de confirmación para finalizar ruta */}
            <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Finalizar recorrido</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Querés finalizar el recorrido de la ruta? Esto no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmFinishRoute}>
                            Finalizar recorrido
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
