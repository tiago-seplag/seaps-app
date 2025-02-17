"use client";

import { ChecklistItems } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CameraIcon } from "lucide-react";
import Link from "next/link";
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
import { useParams } from "next/navigation";

export const ChecklistCard = ({
  checklistItem,
}: {
  propertyId: string;
  checklistItem: ChecklistItems & {
    item: {
      name: string;
    };
  };
}) => {
  const { id } = useParams()
  const observationDialog = useModal();

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
      <CardContent className="grid gap-4">
        {checklistItem.images ? (
          <div className="h-40 w-full bg-red-300"></div>
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded bg-muted">
            <CameraIcon size={42} className="text-muted-foreground" />
          </div>
        )}
        <RadioGroup
          className="flex w-full"
          onValueChange={(e) => handleChangeValue(e, checklistItem.id)}
          defaultValue={String(checklistItem.score)}
        >
          <div className="flex flex-col md:flex-row gap-2 justify-center w-full items-center rounded bg-green-300 px-1 py-4 dark:bg-green-800">
            <RadioGroupItem value="2" id={checklistItem.id + `2`} />
            <Label htmlFor={checklistItem.id + `2`}>Bom</Label>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center w-full items-center rounded bg-yellow-300 px-1 py-4 dark:bg-yellow-800">
            <RadioGroupItem value="1" id={checklistItem.id + `1`} />
            <Label htmlFor={checklistItem.id + `1`}>Regular</Label>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center w-full items-center rounded bg-red-300 px-1 py-4 dark:bg-red-800">
            <RadioGroupItem value="0" id={checklistItem.id + `0`} />
            <Label htmlFor={checklistItem.id + `0`}>Ruim</Label>
          </div>
        </RadioGroup>
        <div className="overflow-hidden">
          {checklistItem.observation ? (
            <p
              className="line-clamp-2 text-wrap text-muted-foreground"
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
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-col sm:flex-row">
        {/* <Button asChild className="w-full">
        <Link
            href={
              checklistItem.checklist_id +
              "/create-item?property_id=" +
              propertyId +
              "&item_id=" +
              checklistItem.item_id
            }
          >
            Criar Subitem
          </Link>
        </Button> */}
        <Button asChild className="w-full" variant="secondary">
          <Link
            href={id?.toString().replaceAll(',', '/') + '/' + checklistItem.item_id}
          >
            Listar Subitem
          </Link>
        </Button>
      </CardFooter>
      <ObservationDialog
        item={checklistItem}
        onOpenChange={observationDialog.toggle}
        open={observationDialog.visible}
      />
    </Card>
  );
};
