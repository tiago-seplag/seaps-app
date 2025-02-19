"use client";

import { ChecklistItems } from "@prisma/client";
import { Button } from "@/components/ui/button";
// import { CameraIcon } from "lucide-react";
// import Link from "next/link";
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
// import { useParams } from "next/navigation";
// import { useParams } from "next/navigation";

export const ChecklistCard = ({
  checklistItem,
}: {
  propertyId: string;
  checklistItem: ChecklistItems & {
    item: {
      name: string;
      level: number;
    };
  };
}) => {
  // const { itemId } = useParams<{ itemId?: string[] }>();
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
        {checklistItem.images ? (
          <div className="h-40 w-full bg-red-300"></div>
        ) : (
          <FileUploader
            // value={field.value}
            // onValueChange={field.onChange}
            maxFileCount={4}
            accept={{
              "image/*": [],
            }}
            // progresses={progresses}
            maxSize={1024 * 1024 * 1024 * 2}
            // pass the onUpload function here for direct upload
            // onUpload={onUpload}
            // disabled={isUploading}
          />
          // <div className="flex h-40 w-full items-center justify-center rounded bg-muted">
          //   <CameraIcon size={42} className="text-muted-foreground" />
          // </div>
        )}
        <RadioGroup
          className="flex w-full"
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
            <p
              className="line-clamp-2 min-h-9 cursor-pointer text-wrap rounded-md border border-dashed px-4 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={observationDialog.show}
            >
              {checklistItem.observation}
            </p>
          ) : (
            <Button
              variant="ghost"
              onClick={observationDialog.show}
              className="w-full border border-dashed"
            >
              Adicionar Observação
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={imageDialog.show}
            className="w-full border border-dashed"
          >
            image{" "}
          </Button>
        </div>
        {/* <Button
          asChild={checklistItem.item.level < 3}
          disabled={checklistItem.item.level === 3}
          className="w-full"
          variant="secondary"
        >
          <Link
            href={
              itemId ? checklistItem.item_id : "items/" + checklistItem.item_id
            }
          >
            Listar Subitens
          </Link>
        </Button> */}
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
