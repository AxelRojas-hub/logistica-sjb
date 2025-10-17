"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Sun, Moon, Monitor } from "lucide-react"
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
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
                    </div>

                    {/* Select de cambio de actor y toggle de tema */}
                    <div className="flex items-center gap-2">

                        {/* Toggle de tema */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    {!mounted ? (
                                        <Monitor className="h-4 w-4" />
                                    ) : theme === "light" ? (
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
