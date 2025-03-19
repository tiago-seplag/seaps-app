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
import { MessageSquareText } from "lucide-react";
import Image from "next/image";
import { ImageObservationDialog } from "./image-observation-dialog";
import { cn } from "@/lib/utils";

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

  return (
    <Card className="h-[326px]">
      {image.observation && (
        <CardHeader>
          <CardDescription>{image.observation}</CardDescription>
        </CardHeader>
      )}
      <CardContent
        className={cn("grid gap-4 pb-4", !image.observation && "pt-6")}
      >
        <Image
          src={process.env.BUCKET_URL + image.image}
          alt="checklist-image"
          width={388}
          height={160}
          className="pointer-events-none h-56 w-full object-cover"
        />
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
    </Card>
  );
};
