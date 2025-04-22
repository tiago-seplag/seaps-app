"use client";

import { $Enums } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { MessageSquareText, Trash } from "lucide-react";
import Image from "next/image";
import { ImageObservationDialog } from "./image-observation-dialog";
import { cn } from "@/lib/utils";
import { DeleteDialog } from "./delete-dialog";

export const ChecklistImageCard = ({
  image,
  status,
}: {
  status: $Enums.Status;
  image: {
    id: string;
    image: string;
    created_at: Date;
    checklist_item_id: string;
    observation: string | null;
  };
}) => {
  const observationDialog = useModal();
  const deleteDialog = useModal();

  return (
    <Card className="flex min-h-[326px] flex-col">
      <CardHeader className="flex-row items-center justify-end py-2">
        <Button variant="destructive" onClick={deleteDialog.show}>
          <Trash />
        </Button>
      </CardHeader>
      <CardContent className={cn(!image.observation && "pt-6", "h-full")}>
        <Image
          src={process.env.BUCKET_URL + image.image}
          alt="checklist-image"
          width={388}
          height={160}
          className="pointer-events-none h-full max-h-56 min-h-56 w-full object-cover"
        />
        {image.observation && (
          <CardDescription className="line-clamp-2 min-h-[2lh] pt-3">
            {image.observation}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={observationDialog.show}
        >
          Observação da Imagem
          <MessageSquareText />
        </Button>
      </CardFooter>
      <ImageObservationDialog
        image={image}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
        status={status}
      />
      <DeleteDialog
        image={image}
        onOpenChange={deleteDialog.toggle}
        open={deleteDialog.visible}
        status={status}
      />
    </Card>
  );
};
