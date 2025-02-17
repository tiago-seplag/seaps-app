import { AddItemForm } from "./_components/add-item-form";
import { prisma } from "@/lib/prisma";
import { GoBack } from "@/components/go-back";

type AddItemPageProps = {
  params: Promise<{
    id: string[];
  }>;
  searchParams: Promise<{
    item_id?: string;
    level: string;
  }>;
};

export default async function AddItem({ params }: AddItemPageProps) {
  const { id } = await params;

  const checklist = await prisma.checklist.findUniqueOrThrow({
    where: { id: id[0] },
  });

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center">
        <GoBack />
        <h2>Criar Item</h2>
      </div>

      <AddItemForm propertyId={checklist.property_id} />
    </div>
  );
}
