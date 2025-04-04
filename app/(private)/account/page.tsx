import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./_components/form";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const userJSON = JSON.parse(cookieStore.get("USER_DATA")?.value || "");

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userJSON.id,
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Conta</h2>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
