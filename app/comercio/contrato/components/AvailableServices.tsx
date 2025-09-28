import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Service {
    id: string
    name: string
    description: string
    monthlyFee: number
}

interface AvailableServicesProps {
    availableServices: Service[]
    includedServices: string[]
}

export function AvailableServices({ availableServices, includedServices }: AvailableServicesProps) {
    const filteredServices = availableServices.filter(
        service => !includedServices.includes(service.name)
    )

    return (
        <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Servicios Adicionales Disponibles</h3>
            <div className="grid md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
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
    )
}