"use client";

import { $Enums, ChecklistItems } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import { ObservationDialog } from "./observation-dialog";
import { FileUploader } from "./file-uploader";
import { ImageDialog } from "./image-dialog";
import { Camera, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ChecklistCard = ({
  checklistItem,
  status,
}: {
  status: $Enums.Status;
  propertyId: string;
  checklistItem: ChecklistItems & {
    item: {
      name: string;
      level: number;
    };
    images: {
      id: string;
      image: string;
      created_at: Date;
      checklist_item_id: string;
      observation: string | null;
    }[];
  };
}) => {
  const observationDialog = useModal();
  const imageDialog = useModal();

  const handleChangeValue = (value: string, id: string) => {
    fetch("/api/checklist-item/" + id, {
      method: "PUT",
      body: JSON.stringify({ score: value }),
    });
  };

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader>
        <CardTitle>{checklistItem.item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        {!checklistItem.image ? (
          <FileUploader
            id={checklistItem.id}
            disabled={status === "CLOSED"}
            maxFileCount={5}
            accept={{ "image/*": [] }}
            maxSize={1024 * 1024 * 1024 * 2}
          />
        ) : (
          <Button
            variant="ghost"
            onClick={imageDialog.show}
            className="w-full flex-grow overflow-hidden border bg-muted-foreground/10 object-cover p-0"
          >
            <Image
              src={process.env.BUCKET_URL + checklistItem.image}
              alt="checklist-image"
              width={388}
              height={160}
              className="pointer-events-none h-full w-full object-cover"
            />
          </Button>
        )}
        <RadioGroup
          className="flex w-full"
          disabled={status === "CLOSED"}
          onValueChange={(e) => handleChangeValue(e, checklistItem.id)}
          defaultValue={String(checklistItem.score)}
        >
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-green-300 px-1 py-3 dark:bg-green-800 md:flex-row">
            <RadioGroupItem value="2" id={checklistItem.id + `2`} />
            <Label htmlFor={checklistItem.id + `2`}>Bom</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-yellow-300 px-1 py-3 dark:bg-yellow-800 md:flex-row">
            <RadioGroupItem value="1" id={checklistItem.id + `1`} />
            <Label htmlFor={checklistItem.id + `1`}>Regular</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-red-300 px-1 py-3 dark:bg-red-800 md:flex-row">
            <RadioGroupItem value="0" id={checklistItem.id + `0`} />
            <Label htmlFor={checklistItem.id + `0`}>Ruim</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={observationDialog.show}
        >
          Observação
          <MessageSquareText />
        </Button>
        <Button className="w-full" variant="outline" asChild>
          <Link href={"items/" + checklistItem.id}>
            Imagens
            <Camera />
          </Link>
        </Button>
      </CardFooter>
      <ImageDialog
        item={checklistItem}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
      />
      <ObservationDialog
        status={status}
        item={checklistItem}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
      />
    </Card>
  );
};
