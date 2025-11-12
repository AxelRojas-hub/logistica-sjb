"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, MapPin, Search, PackageX } from "lucide-react"

interface EnviosTableProps {
    envios: any[]
    empleadoMap: Map<any, string>
    rutaMap: Map<any, any>
    sucursalMap: Map<any, any>
}

export function EnviosTable({ envios, empleadoMap, rutaMap, sucursalMap }: EnviosTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Filtrar envíos basado en búsqueda y estado
    const filteredEnvios = envios.filter(envio => {
        const matchesSearch = searchTerm === "" ||
            envio.id_envio.toString().includes(searchTerm) ||
            empleadoMap.get(envio.legajo_empleado)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rutaMap.get(envio.id_ruta)?.nombreRuta?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || envio.estado_envio === statusFilter

        return matchesSearch && matchesStatus
    })

    const capitalizeStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "en_camino":
                return "bg-blue-100 text-blue-800"
            case "finalizado":
                return "bg-green-100 text-green-800"
            case "planificado":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <>
            {/* Controles de búsqueda y filtrado */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por ID, chofer o ruta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="en_camino">En camino</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                        <SelectItem value="planificado">Planificado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabla de envíos */}
            {filteredEnvios.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="rounded-full bg-muted p-6">
                                <PackageX className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-foreground">
                                    {envios.length === 0 ? "No hay envíos activos" : "No se encontraron resultados"}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    {envios.length === 0
                                        ? "No se encontraron envíos en curso."
                                        : "Intenta ajustar los filtros de búsqueda."
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <div className="min-h-50 max-h-80 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Chofer</TableHead>
                                    <TableHead>Legajo</TableHead>
                                    <TableHead>Ruta</TableHead>
                                    <TableHead>Sucursal Actual</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEnvios.map((envio) => {
                                    const nombreChofer = empleadoMap.get(envio.legajo_empleado) || "Sin asignar"
                                    const nombreRuta = rutaMap.get(envio.id_ruta)?.nombreRuta || `Ruta ${envio.id_ruta}`
                                    const nombreSucursal = sucursalMap.get(envio.id_sucursal_actual)?.ciudadSucursal || `Sucursal ${envio.id_sucursal_actual}`

                                    return (
                                        <TableRow key={envio.id_envio} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">#{envio.id_envio}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(envio.estado_envio)}>
                                                    {capitalizeStatus(envio.estado_envio)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{nombreChofer}</TableCell>
                                            <TableCell>{envio.legajo_empleado}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                                    {nombreRuta}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {nombreSucursal}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}
        </>
    )
}