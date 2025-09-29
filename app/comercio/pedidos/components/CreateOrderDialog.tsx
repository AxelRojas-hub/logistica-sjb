import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface NewOrderForm {
    recipient: string
    address: string
    neighborhood: string
    phone: string
    description: string
    weight: string
    specialInstructions: string
    totalAmount: number
    services: string[]
    deadline: string
}

interface CreateOrderDialogProps {
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    onCreateOrder: () => void
}

export function CreateOrderDialog({ newOrder, setNewOrder, onCreateOrder }: CreateOrderDialogProps) {
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Registrar Pedido
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar nuevo Pedido</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Destinatario *</label>
                            <Input
                                placeholder="Nombre completo"
                                value={newOrder.recipient}
                                onChange={(e) => setNewOrder({ ...newOrder, recipient: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono *</label>
                            <Input
                                placeholder="+54 11 1234-5678"
                                value={newOrder.phone}
                                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dirección *</label>
                        <Input
                            placeholder="Dirección completa"
                            value={newOrder.address}
                            onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Barrio *</label>
                            <Input
                                placeholder="Barrio"
                                value={newOrder.neighborhood}
                                onChange={(e) => setNewOrder({ ...newOrder, neighborhood: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Peso *</label>
                            <Input
                                placeholder="2.5 kg"
                                value={newOrder.weight}
                                onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción del producto *</label>
                        <Textarea
                            placeholder="Describe el producto a entregar"
                            value={newOrder.description}
                            onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Monto *</label>
                            <Input
                                type="number"
                                placeholder="15000"
                                value={newOrder.totalAmount}
                                onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha límite *</label>
                            <Input
                                type="date"
                                value={newOrder.deadline}
                                onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Servicios incluidos *</label>
                        <div className="space-y-3">
                            {[
                                { id: 'retiro', label: 'Retiro en comercio' },
                                { id: 'envio', label: 'Envío a domicilio' },
                                { id: 'embalaje', label: 'Embalaje' }
                            ].map((service) => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={service.id}
                                        checked={newOrder.services.includes(service.label)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setNewOrder({
                                                    ...newOrder,
                                                    services: [...newOrder.services, service.label]
                                                })
                                            } else {
                                                setNewOrder({
                                                    ...newOrder,
                                                    services: newOrder.services.filter(s => s !== service.label)
                                                })
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={service.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {service.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instrucciones especiales</label>
                        <Textarea
                            placeholder="Instrucciones adicionales para la entrega"
                            value={newOrder.specialInstructions}
                            onChange={(e) => setNewOrder({ ...newOrder, specialInstructions: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={onCreateOrder} className="flex-1">
                            Crear Pedido
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}