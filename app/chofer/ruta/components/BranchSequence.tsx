import { CurrentRoute } from "@/lib/types"

interface BranchSequenceProps {
    currentRoute: CurrentRoute
}

export function BranchSequence({ currentRoute }: BranchSequenceProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-medium">Secuencia de Sucursales</h3>
            <div className="space-y-2">
                {currentRoute.branches.map((branch, index) => (
                    <div key={branch.name} className="flex items-center gap-3">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${branch.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : branch.status === "current"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {index + 1}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className={branch.status === "current" ? "font-medium" : ""}>
                                {branch.name}
                            </span>
                            <span className="text-sm text-gray-500">{branch.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}