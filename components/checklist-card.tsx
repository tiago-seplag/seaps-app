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
import Image from "next/image";

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
      image: string | null;
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
    <Card>
      <CardHeader className="flex-row items-center space-y-0">
        <CardTitle>{checklistItem.item.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pb-4">
        {!checklistItem.image ? (
          <FileUploader
            id={checklistItem.id}
            disabled={status === "CLOSED"}
            maxFileCount={10}
            accept={{ "image/*": [] }}
            maxSize={1024 * 1024 * 1024 * 2}
          />
        ) : (
          <Button
            variant="ghost"
            onClick={imageDialog.show}
            className="h-40 min-h-40 w-full overflow-hidden border bg-muted-foreground/10 object-cover p-0"
          >
            <Image
              src={"http://172.16.146.58:3333/" + checklistItem.image}
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
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-red-300 px-1 py-3 dark:bg-red-800 md:flex-row">
            <RadioGroupItem value="0" id={checklistItem.id + `0`} />
            <Label htmlFor={checklistItem.id + `0`}>Ruim</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-yellow-300 px-1 py-3 dark:bg-yellow-800 md:flex-row">
            <RadioGroupItem value="1" id={checklistItem.id + `1`} />
            <Label htmlFor={checklistItem.id + `1`}>Regular</Label>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded bg-green-300 px-1 py-3 dark:bg-green-800 md:flex-row">
            <RadioGroupItem value="2" id={checklistItem.id + `2`} />
            <Label htmlFor={checklistItem.id + `2`}>Bom</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="w-full overflow-hidden">
          {checklistItem.observation ? (
            <Button
              className="block h-full min-h-14 w-full py-2"
              disabled={status === "CLOSED"}
              variant="outline"
              onClick={observationDialog.show}
            >
              <p
                title={checklistItem.observation}
                className="line line-clamp-2 w-full text-ellipsis text-wrap break-words text-start"
              >
                {checklistItem.observation}
              </p>
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={observationDialog.show}
              disabled={status === "CLOSED"}
              className="min-h-14 w-full border border-dashed"
            >
              Adicionar Observação
            </Button>
          )}
        </div>
      </CardFooter>
      <ImageDialog
        item={checklistItem}
        onOpenChange={imageDialog.toggle}
        open={imageDialog.visible}
      />
      <ObservationDialog
        item={checklistItem}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
      />
    </Card>
  );
};
