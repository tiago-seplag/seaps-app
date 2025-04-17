import { ProfileForm } from "./_components/form";
import { getUser } from "@/lib/dal";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Conta</h2>
        </div>
      </div>

      <ProfileForm
        user={{
          email: user?.email,
          name: user?.name,
        }}
      />
    </div>
  );
}
