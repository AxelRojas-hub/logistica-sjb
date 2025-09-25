"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    DollarSign,
    CheckCircle,
    Plus,
    ArrowLeft
} from "lucide-react"
import { mockContract, mockAvailableServices } from "@/lib/mock-data"
import Link from "next/link"

export default function ComercioContratoPage() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "activo":
                return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            case "vencido":
                return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "activo":
                return "Activo"
            case "vencido":
                return "Vencido"
            case "pendiente":
                return "Pendiente"
            default:
                return status
        }
    }

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Mi Contrato</h1>
                    <p className="mt-2 text-muted-foreground">Gestiona tu contrato y servicios logísticos</p>
                </div>

                {/* Botón para volver al menú principal */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/comercio">
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-foreground">Contrato Actual</h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">Contrato {mockContract.id}</CardTitle>
                                    <CardDescription>Plan de servicios logísticos</CardDescription>
                                </div>
                                <Badge className={getStatusColor(mockContract.status)}>
                                    {getStatusText(mockContract.status)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Fecha inicio</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {mockContract.startDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fecha fin</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {mockContract.endDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tarifa mensual</p>
                                    <p className="font-bold text-lg flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        ${mockContract.monthlyFee.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Servicios incluidos</p>
                                <div className="space-y-1">
                                    {mockContract.services.map((service, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span className="text-sm">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-medium mb-4">Servicios Adicionales Disponibles</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {mockAvailableServices
                                        .filter(service => !mockContract.services.includes(service.name))
                                        .map((service) => (
                                            <Card key={service.id} className="border border-gray-200">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium">{service.name}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">${service.monthlyFee.toLocaleString()}</p>
                                                            <p className="text-xs text-gray-500">por mes</p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" className="w-full mt-3">
                                                        <Plus className="h-3 w-3 mr-2" />
                                                        Agregar
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button className="dark:text-white bg-blue-600 hover:bg-blue-700">
                                    Renovar Contrato
                                </Button>
                                <Button variant="outline">
                                    Modificar Plan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}