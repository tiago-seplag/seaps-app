/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Item } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { addItem } from "@/app/actions/add-item";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  checklist_id: z.string(),
  items: z.array(
    z.object({
      item_id: z.string(),
    }),
  ),
});

export function AddItemForm({
  propertyId,
}: {
  propertyId: string;
  item?: Item;
}) {
  const { id } = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checklist_id: id?.toString(),
      items: [
        {
          item_id: "",
        },
      ],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { items, checklist_id } = values;

    addItem({
      checklist_id,
      item_id: items[items?.length - 1].item_id,
    })
      .then(() => router.back())
      .catch(() => toast.error("Esse item já foi adicionado."));
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            return (
              <Field
                key={field.id}
                index={index}
                form={form}
                disabled={index != fields.length - 1}
                remove={remove}
                propertyId={propertyId}
                itemId={fields[fields.length - 2]?.item_id}
                append={append}
              />
            );
          })}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

const Field = ({
  index,
  itemId,
  form,
  disabled,
  propertyId,
  remove,
  append,
}: {
  index: number;
  form: any;
  itemId?: string;
  propertyId: string;
  disabled: boolean;
  remove: (index: number) => void;
  append: (value: any) => void;
}) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!disabled) {
      const url = itemId ? `item_id=${itemId}` : `property_id=${propertyId}`;
      fetch("/api/items?" + url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length < 1) {
            remove(index);
          }
          setItems(data);
        });
    }
  }, [itemId, propertyId, disabled, remove, index]);

  return (
    <div className="relative flex w-full gap-4 rounded border border-dashed p-2">
      <FormField
        control={form.control}
        name={`items.${index}.item_id`}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Item</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={(e) => {
                field.onChange(e);
                append({
                  item_id: undefined as unknown as string,
                });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o item" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        size="icon"
        disabled={disabled}
        className="absolute -right-5 -top-5 h-8 w-8 rounded-full"
        onClick={() => remove(index)}
        variant="destructive"
      >
        <Trash width={16} />
      </Button>
    </div>
  );
};
