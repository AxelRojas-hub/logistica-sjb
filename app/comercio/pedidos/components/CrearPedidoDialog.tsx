import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface NewOrderForm {
    dniCliente: number
    idSucursalDestino: number
    precio: number
    fechaLimiteEntrega: string
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
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">DNI Cliente *</label>
                            <Input
                                type="number"
                                placeholder="12345678"
                                value={newOrder.dniCliente || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, dniCliente: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sucursal Destino *</label>
                            <Input
                                type="number"
                                placeholder="1"
                                value={newOrder.idSucursalDestino || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, idSucursalDestino: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Precio *</label>
                            <Input
                                type="number"
                                placeholder="15000"
                                value={newOrder.precio || ""}
                                onChange={(e) => setNewOrder({ ...newOrder, precio: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fecha Límite Entrega *</label>
                            <Input
                                type="date"
                                value={newOrder.fechaLimiteEntrega}
                                onChange={(e) => setNewOrder({ ...newOrder, fechaLimiteEntrega: e.target.value })}
                            />
                        </div>
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