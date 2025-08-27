"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Truck, Building2, User, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export default function Home() {
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const handleActorSelect = (actor: string) => {
    router.push(`/${actor}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with theme toggle */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold text-foreground">Sistema de Logística SJB</h2>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Oscuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Actor Selection */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Selecciona tu Perfil
            </h1>
            <p className="text-muted-foreground">
              Selecciona tu perfil para acceder al sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-500"
              onClick={() => handleActorSelect("admin")}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <User className="h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Administrador</h3>
                <p className="text-muted-foreground">Gestiona envíos, comercios y reportes</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-green-500"
              onClick={() => handleActorSelect("chofer")}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Truck className="h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Chofer</h3>
                <p className="text-muted-foreground">Gestiona entregas y rutas asignadas</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-500"
              onClick={() => handleActorSelect("comercio")}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Building2 className="h-16 w-16 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Comercio</h3>
                <p className="text-muted-foreground">Gestiona pedidos y facturación</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
