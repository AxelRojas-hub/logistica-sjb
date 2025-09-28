import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
}

interface CreateOrderDialogProps {
    newOrder: NewOrderForm
    setNewOrder: (order: NewOrderForm) => void
    onCreateOrder: () => void
}

export function CreateOrderDialog({ newOrder, setNewOrder, onCreateOrder }: CreateOrderDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Registrar Pedido
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar nuevo Pedido</DialogTitle>
                    <DialogDescription>
                        Completa la información para crear un nuevo pedido de entrega
                    </DialogDescription>
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