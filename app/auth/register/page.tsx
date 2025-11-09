"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Sucursal } from "@/lib/types";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sucursalesLoading, setSucursalesLoading] = useState(true);

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nombreResponsable, setNombreResponsable] = useState("");
    const [nombreComercio, setNombreComercio] = useState("");
    const [domicilioFiscal, setDomicilioFiscal] = useState("");
    const [idSucursal, setIdSucursal] = useState("");

    // Cargar sucursales
    useEffect(() => {
        const loadSucursales = async () => {
            try {
                const res = await fetch("/api/sucursales");
                if (!res.ok) throw new Error("Error al cargar sucursales");
                const data = await res.json();
                setSucursales(data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las sucursales");
            } finally {
                setSucursalesLoading(false);
            }
        };
        loadSucursales();
    }, []);

    const validate = () => {
        if (!email || !password || !confirmPassword || !nombreResponsable || !nombreComercio || !domicilioFiscal || !idSucursal) {
            return "Todos los campos son obligatorios.";
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            return "El correo electrónico no es válido.";
        }
        if (password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres.";
        }
        if (password !== confirmPassword) {
            return "Las contraseñas no coinciden.";
        }
        if (nombreResponsable.trim().length < 3) {
            return "El nombre del responsable debe tener al menos 3 caracteres.";
        }
        if (nombreComercio.trim().length < 3) {
            return "El nombre del comercio debe tener al menos 3 caracteres.";
        }
        if (domicilioFiscal.trim().length < 5) {
            return "El domicilio fiscal debe tener al menos 5 caracteres.";
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
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    nombreResponsable,
                    nombreComercio,
                    domicilioFiscal,
                    idSucursal: parseInt(idSucursal),
                }),
            });
            const data = await res.json();
            if (data.ok) {
                router.push("/?registered=true");
            } else {
                setError(data.error || "Error al crear la cuenta.");
            }
        } catch (err) {
            console.error(err);
            setError("Error de red. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="flex flex-col items-center pb-0">
                    <h1 className="text-2xl font-bold mb-2">Registrar comercio</h1>
                    <p className="text-muted-foreground text-sm">Crea tu cuenta de comercio</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 rounded bg-red-100 text-red-700 text-sm text-center">{error}</div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                        {/* Información de cuenta */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Información de Cuenta</h2>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="usuario@correo.com"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombreResponsable">Nombre del responsable</Label>
                                <Input
                                    id="nombreResponsable"
                                    name="nombreResponsable"
                                    type="text"
                                    value={nombreResponsable}
                                    onChange={e => setNombreResponsable(e.target.value)}
                                    placeholder="Juan Pérez"
                                    disabled={loading}
                                    required
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
                                    placeholder="••••••••"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Información del comercio */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Información del Comercio</h2>
                            <div className="space-y-2">
                                <Label htmlFor="nombreComercio">Nombre del comercio</Label>
                                <Input
                                    id="nombreComercio"
                                    name="nombreComercio"
                                    type="text"
                                    value={nombreComercio}
                                    onChange={e => setNombreComercio(e.target.value)}
                                    placeholder="Mi Tienda"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="domicilioFiscal">Domicilio fiscal</Label>
                                <Input
                                    id="domicilioFiscal"
                                    name="domicilioFiscal"
                                    type="text"
                                    value={domicilioFiscal}
                                    onChange={e => setDomicilioFiscal(e.target.value)}
                                    placeholder="Calle Principal 123"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idSucursal">Sucursal de origen</Label>
                                <Select value={idSucursal} onValueChange={setIdSucursal} disabled={sucursalesLoading || loading}>
                                    <SelectTrigger id="idSucursal">
                                        <SelectValue placeholder="Selecciona una sucursal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sucursales.map(s => (
                                            <SelectItem key={s.idSucursal} value={s.idSucursal.toString()}>
                                                {s.ciudadSucursal} - {s.direccionSucursal}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Registrando..." : "Registrarse"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">¿Ya tiene una cuenta? </span>
                        <Link href="/" className="text-blue-600 hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
