"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Truck, Building2, Home, Sun, Moon, Monitor } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    const getActiveActor = () => {
        if (pathname.startsWith("/admin")) return "admin"
        if (pathname.startsWith("/chofer")) return "chofer"
        if (pathname.startsWith("/comercio")) return "comercio"
        return "home"
    }

    const activeActor = getActiveActor()

    const actors = [
        {
            id: "admin",
            name: "Administrador",
            icon: User,
            path: "/admin",
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            id: "chofer",
            name: "Chofer",
            icon: Truck,
            path: "/chofer",
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            id: "comercio",
            name: "Comercio",
            icon: Building2,
            path: "/comercio",
            color: "bg-purple-500 hover:bg-purple-600"
        }
    ]

    const handleActorChange = (path: string) => {
        router.push(path)
    }

    const handleHomeClick = () => {
        router.push("/")
    }

    // No mostrar header en la página principal
    if (pathname === "/") {
        return null
    }

    return (
        <header className="bg-background border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo/Título */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={handleHomeClick}
                            className="flex items-center gap-2 hover:bg-accent"
                        >
                            <Home className="h-5 w-5" />
                            <h1 className="text-xl font-bold text-foreground">Logística SJB</h1>
                        </Button>

                        {activeActor !== "home" && (
                            <Badge variant="outline" className="text-sm">
                                {actors.find(actor => actor.id === activeActor)?.name}
                            </Badge>
                        )}
                    </div>

                    {/* Botones de cambio de actor y toggle de tema */}
                    <div className="flex items-center gap-2">
                        {actors.map((actor) => {
                            const IconComponent = actor.icon
                            const isActive = activeActor === actor.id

                            return (
                                <Button
                                    key={actor.id}
                                    variant={isActive ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleActorChange(actor.path)}
                                    className={`flex items-center gap-2 ${isActive
                                        ? actor.color + " text-white"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {actor.name}
                                </Button>
                            )
                        })}

                        {/* Toggle de tema */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    {theme === "light" ? (
                                        <Sun className="h-4 w-4" />
                                    ) : theme === "dark" ? (
                                        <Moon className="h-4 w-4" />
                                    ) : (
                                        <Monitor className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Monitor className="mr-2 h-4 w-4" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
