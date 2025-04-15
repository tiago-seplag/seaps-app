import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { version } from "@/package.json";

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <h1 className="scroll-m-20 text-xl font-semibold tracking-tight [&:not(:first-child)]:mt-6">
        USUÁRIO INATIVO
      </h1>
      <p className="py-2 text-center">
        Por favor, solicite a liberação de acesso ao sistema junto a um
        administrador responsável.
      </p>
      <div className="mt-4 inline-flex items-center gap-4">
        <LogoutButton />
      </div>
      <p className="absolute bottom-4 text-sm">Versão: {version}</p>
      <div className="absolute bottom-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}
