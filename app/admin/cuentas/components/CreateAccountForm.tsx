"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type UserRole = "chofer" | "admin";

interface Sucursal {
    idSucursal: number;
    direccionSucursal: string;
    ciudadSucursal: string;
}

interface CreateAccountFormProps {
    sucursales: Sucursal[];
}

export default function CreateAccountForm({ sucursales }: CreateAccountFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [rol, setRol] = useState<UserRole>("chofer");
    const [idSucursal, setIdSucursal] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            // 1. Obtener el legajo más alto
            const { data: empleados, error: fetchError } = await supabaseClient
                .from("empleado")
                .select("legajo_empleado")
                .order("legajo_empleado", { ascending: false })
                .limit(1);

            if (fetchError) {
                setError("Error al obtener legajos: " + fetchError.message);
                setLoading(false);
                return;
            }

            const nuevoLegajo = empleados && empleados.length > 0 ? empleados[0].legajo_empleado + 1 : 1000;

            // 2. Crear usuario en Supabase Auth
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        rol,
                        nombre,
                        legajo: nuevoLegajo
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            if (!authData.user) {
                setError("No se pudo crear el usuario");
                setLoading(false);
                return;
            }

            // 3. Crear empleado en base de datos
            const { error: empleadoError } = await supabaseClient.from("empleado").insert({
                nombre_empleado: nombre,
                rol,
                legajo_empleado: nuevoLegajo,
                contrasena: password
            });

            if (empleadoError) {
                setError("Error al crear el empleado: " + empleadoError.message);
                setLoading(false);
                return;
            }

            // 4. Si es admin, crear entrada en tabla administrador
            if (rol === "admin" && idSucursal) {
                const { error: adminError } = await supabaseClient.from("administrador").insert({
                    legajo_empleado: nuevoLegajo,
                    id_sucursal: parseInt(idSucursal),
                });

                if (adminError) {
                    setError("Error al crear el administrador: " + adminError.message);
                    setLoading(false);
                    return;
                }
            }

            // 5. Si es chofer, crear entrada en tabla chofer
            if (rol === "chofer") {
                const { error: choferError } = await supabaseClient.from("chofer").insert({
                    legajo_empleado: nuevoLegajo,
                });

                if (choferError) {
                    setError("Error al crear el chofer: " + choferError.message);
                    setLoading(false);
                    return;
                }
            }

            setMessage(`Cuenta creada exitosamente para ${email}`);
            setEmail("");
            setPassword("");
            setNombre("");
            setRol("chofer");
            setIdSucursal("");
        } catch (err) {
            setError("Error de red. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-4 flex flex-col">
            <div className="max-w-2xl mx-auto px-4 w-full py-8">
                <Link href="/admin">
                    <Button
                        variant="outline"
                        className="flex items-center mb-4 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al menú principal
                    </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold">Crear Cuenta</h1>
                        <p className="text-muted-foreground mt-2">Agrega un nuevo chofer o administrador</p>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre Completo</Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@correo.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rol">Rol</Label>
                                <Select value={rol} onValueChange={(value) => setRol(value as UserRole)}>
                                    <SelectTrigger id="rol">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="chofer">Chofer</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {rol === "admin" && (
                                <div className="space-y-2">
                                    <Label htmlFor="sucursal">Sucursal</Label>
                                    <Select value={idSucursal} onValueChange={setIdSucursal}>
                                        <SelectTrigger id="sucursal">
                                            <SelectValue placeholder="Selecciona una sucursal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sucursales.map((sucursal) => (
                                                <SelectItem key={sucursal.idSucursal} value={sucursal.idSucursal.toString()}>
                                                    {sucursal.ciudadSucursal} - {sucursal.direccionSucursal}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creando..." : "Crear Cuenta"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
