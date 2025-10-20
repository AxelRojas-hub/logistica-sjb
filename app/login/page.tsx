"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setSuccess("¡Cuenta registrada exitosamente! Puedes iniciar sesión ahora.");
        }
    }, [searchParams]);

    const validate = () => {
        if (!email || !password) {
            return "Todos los campos son obligatorios.";
        }
        // Validación básica de email
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return "El correo electrónico no es válido.";
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
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.ok) {
                router.push("/");
                router.refresh();
            } else {
                console.log("Error", data.error);
                setError("Credenciales incorrectas.");
            }
        } catch {
            setError("Error de red. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[90vh] flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="flex flex-col items-center pb-0">
                    <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
                    <p className="text-muted-foreground text-sm">Accede a tu cuenta</p>
                </CardHeader>
                <CardContent>
                    {success && (
                        <div className="mb-4 p-2 rounded bg-green-100 text-green-700 text-sm text-center">{success}</div>
                    )}
                    {error && (
                        <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm text-center">{error}</div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="usuario@correo.com"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Accediendo..." : "Acceder"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">¿No tienes cuenta? </span>
                        <Link href="/login/register" className="text-blue-600 hover:underline">
                            Regístrate
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
