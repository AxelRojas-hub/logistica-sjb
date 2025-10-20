"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { supabaseClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function NuevaContrasenaPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        // Verificar si hay una sesión válida para el reset de contraseña
        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabaseClient.auth.getSession();

                if (error || !session) {
                    setError("Enlace inválido o expirado. Solicita un nuevo correo de recuperación.");
                    setIsValidSession(false);
                } else {
                    setIsValidSession(true);
                }
            } catch (err) {
                console.error("Error verificando sesión:", err);
                setError("Error al verificar la sesión. Intenta de nuevo.");
                setIsValidSession(false);
            } finally {
                setCheckingSession(false);
            }
        };

        checkSession();
    }, []);

    const validate = () => {
        if (!password || !confirmPassword) {
            return "Todos los campos son obligatorios.";
        }

        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres.";
        }

        if (password !== confirmPassword) {
            return "Las contraseñas no coinciden.";
        }

        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabaseClient.auth.updateUser({
                password: password
            });

            if (error) {
                console.error("Error actualizando contraseña:", error);
                setError("Error al actualizar la contraseña. Intenta de nuevo.");
                return;
            }

            toast.success("Contraseña actualizada. Redirigiendo al login...");

            // Cerrar la sesión actual para que el usuario inicie sesión con la nueva contraseña
            await supabaseClient.auth.signOut();

            // Redirigir al login después de un breve delay
            setTimeout(() => {
                router.push("/login");
            }, 1000);

        } catch (err) {
            console.error("Error en actualización:", err);
            setError("Error interno. Intenta de nuevo.");
        }

    };

    if (checkingSession) {
        return (
            <main className="bg-black min-h-screen flex flex-col items-center justify-center">
                <Image
                    src="/logo200x200.png"
                    alt="Logo"
                    width={130}
                    height={130}
                    priority
                    className="mb-8 w-auto"
                />
                <Card className="w-full max-w-sm shadow-lg">
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Verificando enlace...</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    if (!isValidSession) {
        return (
            <main className="bg-black min-h-screen flex flex-col items-center justify-center">
                <Image
                    src="/logo200x200.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="mb-8"
                    style={{ height: "auto" }}
                />
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="flex flex-col items-center pb-4">
                        <h1 className="text-2xl font-bold mb-2 text-red-600">
                            Enlace inválido
                        </h1>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Este enlace de recuperación de contraseña es inválido o ha expirado.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Por favor, solicita un nuevo correo de recuperación de contraseña.
                        </p>
                        <Button
                            onClick={() => router.push("/login")}
                            className="w-full"
                        >
                            Volver al inicio de sesión
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="bg-black min-h-screen flex flex-col items-center justify-center">
            <Image
                src="/logo200x200.png"
                alt="Logo"
                width={100}
                height={100}
                className="mb-8"
                style={{ height: "auto" }}
            />
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="flex flex-col items-center pb-0">
                    <h1 className="text-2xl font-bold mb-2">Nueva contraseña</h1>
                    <p className="text-muted-foreground text-sm text-center">
                        Ingresa tu nueva contraseña
                    </p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nueva contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    minLength={6}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Mínimo 6 caracteres
                                </p>
                            </div>
                            <div className="gap-y-2">
                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Actualizando..." : "Actualizar contraseña"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}