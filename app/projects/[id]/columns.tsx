/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service, Step } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Pen, PlusIcon, TrashIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import Link from "next/link";

export const columns: ColumnDef<Service>[] = [
  // {
  //   accessorKey: "id",
  //   size: 50,
  //   header: ({ table }) => (
  //     <div className="flex h-full items-center">
  //       <button
  //         onClick={() => table.toggleAllRowsExpanded()}
  //         {...{
  //           style: { cursor: "pointer" },
  //         }}
  //       >
  //         {table.getIsAllRowsExpanded() ? (
  //           <SquareMinus className="text-red-500" size={14} />
  //         ) : table.getIsSomeRowsExpanded() ? (
  //           <SquarePlus className="text-yellow-500" size={14} />
  //         ) : (
  //           <SquarePlus className="text-green-500" size={14} />
  //         )}
  //       </button>
  //       <span className="ml-2">Item</span>
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div
  //       style={{
  //         paddingLeft: `${row.depth * 1}rem`,
  //       }}
  //     >
  //       <div className="flex h-full items-center">
  //         {row.getCanExpand() ? (
  //           <button
  //             {...{
  //               onClick: row.getToggleExpandedHandler(),
  //               style: { cursor: "pointer" },
  //             }}
  //           >
  //             {row.getIsExpanded() ? (
  //               <SquareMinus className="text-red-500" size={14} />
  //             ) : (
  //               <SquarePlus className="text-green-500" size={14} />
  //             )}
  //           </button>
  //         ) : (
  //           <CircleMinus size={14} className="text-blue-500" />
  //         )}
  //         <span className="ml-2">{idFormat(row.id)}</span>
  //       </div>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "delivery",
    header: "Período",
    // accessorFn: (row) => `${row.delivery}º Período`,
    cell({ row }) {
      return <DeliveryBadge delivery={row.original.level} />;
    },
  },
  {
    accessorKey: "duration",
    header: "Duração",
    size: 100,
  },
  {
    accessorKey: "usts",
    header: "UST's",
    size: 100,
  },
  {
    accessorKey: "level",
    header: "level",
    size: 100,
  },
  {
    accessorKey: "is_delivered",
    header: "Entrega",
    size: 100,
    cell({ row }) {
      return (
        <Badge variant={row.original.name ? "green" : "red"}>
          {row.original.name ? "Sim" : "Não"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "",
    size: 100,
    cell({ row }) {
      return <Actions step={row} />;
    },
  },
];

export function Column(steps: Step[]): ColumnDef<any>[] {
  return steps.map(
    (step): ColumnDef<any> => ({
      accessorKey: step.id,
      header: step.name,
      cell({ row }) {
        const isSome = row.original.steps.some(
          (serviceStep: any) => serviceStep.step_id === step.id,
        );
        return (
          <Badge variant={isSome ? "green" : "red"}>
            {isSome ? "Sim" : "Não"}
          </Badge>
        );
      },
    }),
  );
}

const Actions = ({ step }: { step: Row<Service> }) => {
  const deleteDialog = useModal();

  return (
    <div className="flex w-fit gap-2">
      <Button variant="ghost" className="h-5 w-5 p-0">
        <Pen size={8} />
      </Button>
      <Button
        variant="ghost"
        onClick={deleteDialog.show}
        className="h-5 w-5 p-0"
      >
        <TrashIcon size={8} className="text-red-500" />
      </Button>
      {step.original.level > 1 ? null : (
        <Button
          variant="ghost"
          className="h-5 w-5 p-0"
          disabled={step.original.level > 1}
          asChild
        >
          <Link
            href={
              step.original.project_id +
              "/create-steps?step_id=" +
              step.original.id
            }
          >
            <PlusIcon size={8} />
          </Link>
        </Button>
      )}
      {/* <DeleteDialog
        item={idFormat(step.id)}
        onOpenChange={deleteDialog.toggle}
        open={deleteDialog.visible}
        unit={step.original}
      /> */}
    </div>
  );
};

const DeliveryBadge = ({ delivery }: { delivery: number | string }) => {
  const number = Number(delivery);

  const colors: { [key: number]: string } = {
    1: "hover:bg-zinc-100/80 bg-zinc-100 text-zinc-900",
    2: "hover:bg-zinc-200/80 bg-zinc-200 text-zinc-900",
    3: "hover:bg-zinc-300/80 bg-zinc-300 text-zinc-900",
    4: "hover:bg-zinc-400/80 bg-zinc-400 text-zinc-900",
    5: "hover:bg-zinc-500/80 bg-zinc-500 text-zinc-50",
    6: "hover:bg-zinc-600/80 bg-zinc-600 text-zinc-50",
    7: "hover:bg-zinc-700/80 bg-zinc-700 text-zinc-50",
    8: "hover:bg-zinc-800/80 bg-zinc-800 text-zinc-50",
    9: "hover:bg-zinc-900/80 bg-zinc-900 text-zinc-50",
    10: "hover:bg-zinc-100/80 bg-zinc-100 text-zinc-900",
  };

  return (
    <Badge
      className={colors[number] + " w-24 justify-center"}
    >{`${number}º Período`}</Badge>
  );
};
