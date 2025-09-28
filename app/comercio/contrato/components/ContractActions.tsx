import { Button } from "@/components/ui/button"

export function ContractActions() {
    return (
        <div className="flex gap-2 pt-4 border-t">
            <Button className="dark:text-white bg-blue-600 hover:bg-blue-700">
                Renovar Contrato
            </Button>
            <Button variant="outline">
                Modificar Plan
            </Button>
        </div>
    )
}