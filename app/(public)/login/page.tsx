import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
// import { version } from "@/package.json";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <div className="mt-4 inline-flex items-center gap-4">
        <Link href={"/privacy-policy"} className="text-sky-600 hover:underline">
          Politica de Privacidade
        </Link>
        <p className="text-sm">Versão: 0.1.0</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}
