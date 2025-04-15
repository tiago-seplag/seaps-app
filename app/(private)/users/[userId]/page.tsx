import { GoBack } from "@/components/go-back";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditUserForm } from "../_components/edit-user-form";

export default async function Page({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
      name: true,
      is_active: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-3 truncate">
        <GoBack href="/users" />
        <h2
          className="truncate text-2xl font-bold tracking-tight"
          title={user.name}
        >
          {user.name}
        </h2>
      </div>
      <EditUserForm user={user} />
    </div>
  );
}
