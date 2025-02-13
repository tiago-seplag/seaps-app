import { CreateItemForm } from "./_components/create-item-form";
import { prisma } from "@/lib/prisma";
import { GoBack } from "@/components/go-back";

type CreateStepsPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    item_id?: string;
    level: string;
  };
};

export default async function CreateSteps({
  searchParams,
}: CreateStepsPageProps) {
  const { item_id, level } = await searchParams;
  let item;

  if (item_id) {
    item = await prisma.item.findUniqueOrThrow({
      where: { id: item_id },
    });
  }

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center">
        <GoBack />
        <h2>Criar Item</h2>
      </div>

      <CreateItemForm level={level} item={item} />
    </div>
  );
}
