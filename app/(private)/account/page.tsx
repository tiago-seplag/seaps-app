import { ProfileForm } from "./_components/form";

export default async function Page() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Conta</h2>
        </div>
      </div>

      <ProfileForm />
    </div>
  );
}
