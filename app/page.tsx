import { Suspense } from "react";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
