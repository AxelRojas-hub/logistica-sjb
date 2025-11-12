"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Sun, Moon, Monitor, LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabaseClient } from "@/lib/supabaseClient"
import Image from "next/image"

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleHomeClick = () => {
        router.push("/")
    }

    const handleLogoutClick = () => {
        setShowLogoutDialog(true)
    }

    const handleConfirmLogout = async () => {
        await supabaseClient.auth.signOut()
        router.push("/")
        router.refresh()
        setShowLogoutDialog(false)
    }

    // No mostrar header en la página principal
    if (pathname === "/" || pathname === "/auth/register" || pathname === "/auth/reset") {
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
                            <Image src="/logo.svg" alt="Logistica SJB" width={40} height={40} />
                            <h1 className="text-xl font-bold text-foreground">Logística SJB</h1>
                        </Button>
                    </div>

                    {/* Select de cambio de actor y toggle de tema */}
                    <div className="flex items-center gap-2">
                        {/* Botón Logout */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogoutClick}
                            className="flex items-center gap-2"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>

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

            {/* Modal de confirmación de logout */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro que querés cerrar sesión?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmLogout}>
                            Cerrar sesión
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    )
}
