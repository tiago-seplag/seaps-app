import { GoBack } from "@/components/go-back";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { prisma } from "@/lib/prisma";
import { Pen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  const model = await prisma.model.findFirst({
    where: {
      id,
    },
    include: {
      modelItems: {
        include: {
          item: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!model) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3 truncate">
          <GoBack href="/models" />
          <h2
            className="truncate text-2xl font-bold tracking-tight"
            title={model.name}
          >
            {model.name}
          </h2>
        </div>
        <div className="self-end">
          <Button asChild>
            <Link href={model.id + "/edit"}>
              <Pen />
              Editar Modelo
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Label>Preview</Label>
        {model &&
          model.modelItems?.map((field, index) => {
            return (
              <div
                key={index}
                className="w-full max-w-lg rounded border border-dashed p-2"
              >
                <Label>{field.item.name}</Label>
                <RadioGroup className="flex w-full" disabled>
                  <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-red-300 px-1 py-2 dark:bg-red-800">
                    <RadioGroupItem value="0" id={"0"} />
                    <Label htmlFor={"0"}>Ruim</Label>
                  </div>
                  <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-yellow-300 px-1 py-2 dark:bg-yellow-800">
                    <RadioGroupItem value="1" id={"1"} />
                    <Label htmlFor={"1"}>Regular</Label>
                  </div>
                  <div className="flex w-full flex-row items-center justify-center gap-2 rounded bg-green-300 px-1 py-2 dark:bg-green-800">
                    <RadioGroupItem value="2" id={"2"} />
                    <Label htmlFor={"2"}>Bom</Label>
                  </div>
                </RadioGroup>
              </div>
            );
          })}
      </div>
    </div>
  );
}
