"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Servicio {
    id_servicio: number
    nombre_servicio: string
    costo_servicio: number
}

interface NewOrderForm {
    // Datos del destinatario
    dniCliente: number
    nombreCliente: string
    telefonoCliente: string
    emailCliente: string
    direccionCliente: string
    
    // Datos del pedido
    ciudadDestino: string
    idSucursalDestino: number
    peso: number
    fechaLimiteEntrega: string
    
    // Datos para pedido_servicio
    tipoTransporte: number | null 
    serviciosOpcionales: number[]
}

interface ServiciosSectionProps {
    servicios: Servicio[]
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    loading: boolean
    isFieldDisabled?: (fieldName: string) => boolean
}

export function ServiciosSection({ 
    servicios, 
    newOrder, 
    setNewOrder, 
    loading,
    isFieldDisabled = () => false
}: ServiciosSectionProps) {
    // Servicios separados por tipo
    const servicioTransporte = servicios.find(s => 
        s.nombre_servicio.toLowerCase().includes('transporte')
    )
    
    const serviciosOpcionales = servicios.filter(s => 
        !s.nombre_servicio.toLowerCase().includes('transporte')
    )

    const actualizarServicios = (tipoTransporte: number | null, opcionales: number[]) => {
        setNewOrder({ 
            ...newOrder, 
            tipoTransporte,
            serviciosOpcionales: opcionales
        })
    }

    return (
        <div className="space-y-4">
            <h4 className="font-medium">Servicios de transporte</h4>
            {servicioTransporte && (
                <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/30">
                        <RadioGroup 
                            value={newOrder.tipoTransporte?.toString() || servicioTransporte.id_servicio.toString()} 
                            onValueChange={(value) => actualizarServicios(Number(value), newOrder.serviciosOpcionales)}
                            disabled={loading || isFieldDisabled('tipoTransporte')}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value={servicioTransporte.id_servicio.toString()} 
                                        id={`transporte-${servicioTransporte.id_servicio}`}
                                    />
                                    <Label 
                                        htmlFor={`transporte-${servicioTransporte.id_servicio}`}
                                        className="font-medium"
                                    >
                                        {servicioTransporte.nombre_servicio}
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            )}

            {serviciosOpcionales.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium">Servicios adicionales (opcionales)</h4>
                    <div className="grid gap-3">
                        {serviciosOpcionales.map((servicio) => (
                            <div key={servicio.id_servicio} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id={`servicio-${servicio.id_servicio}`}
                                        checked={newOrder.serviciosOpcionales.includes(servicio.id_servicio)}
                                        onCheckedChange={(checked) => {
                                            const nuevosOpcionales = checked 
                                                ? [...newOrder.serviciosOpcionales, servicio.id_servicio]
                                                : newOrder.serviciosOpcionales.filter(id => id !== servicio.id_servicio)
                                            actualizarServicios(newOrder.tipoTransporte, nuevosOpcionales)
                                        }}
                                        disabled={loading || isFieldDisabled('serviciosOpcionales')}
                                    />
                                    <Label 
                                        htmlFor={`servicio-${servicio.id_servicio}`}
                                        className="cursor-pointer text-foreground"
                                    >
                                        {servicio.nombre_servicio}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}