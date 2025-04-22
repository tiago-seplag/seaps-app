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
import { Ellipsis, MessageSquareText, Star, Trash } from "lucide-react";
import Image from "next/image";
import { ImageObservationDialog } from "./image-observation-dialog";
import { DeleteDialog } from "./delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const ChecklistImageCard = ({
  image,
  checklistImage,
  status,
}: {
  checklistImage?: string;
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
  const router = useRouter();

  const handleUpdateChecklistItem = async () => {
    axios
      .put("/api/checklist-item/" + image.checklist_item_id, {
        image: image.image,
      })
      .then(() => router.refresh())
      .catch((e) => {
        if (e.response.data.messages?.length > 0) {
          e.response.data.messages.map((msg: string) => toast.error(msg));
        } else if (e.response.data.message) {
          toast.error(e.response.data.message);
        }
      });
  };

  const IS_PRINCIPAL_IMAGE = checklistImage === image.image;

  return (
    <Card className="flex min-h-[326px] flex-col">
      <CardHeader className="flex-row items-center justify-end py-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={IS_PRINCIPAL_IMAGE}
              onClick={handleUpdateChecklistItem}
              className="group"
            >
              <Star
                className={cn(
                  IS_PRINCIPAL_IMAGE && "fill-yellow-400",
                  "text-yellow-400 group-hover:fill-yellow-400",
                )}
              />
              {IS_PRINCIPAL_IMAGE ? "Principal" : "Tornar Principal"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={deleteDialog.show}
            >
              <Trash /> Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className={"h-full"}>
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
