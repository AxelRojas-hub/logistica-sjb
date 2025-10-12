import { CheckCircle } from "lucide-react"

interface ServiciosDisponiblesProps {
    services: string[]
}

export function ServiciosDisponibles({ services }: ServiciosDisponiblesProps) {
    return (
        <div>
            <p className="text-sm text-gray-500 mb-2">Servicios incluidos</p>
            <div className="space-y-1">
                {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm">{service}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}