/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogProps } from "@radix-ui/react-dialog";
// import { Button } from "@/components/ui/button";
import {
  Dialog,
  //   DialogClose,
  DialogContent,
  //   DialogDescription,
  //   DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChecklistItems } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface ObservationDialogProps extends DialogProps {
  item: ChecklistItems & {
    item: {
      name: string;
    };
    images: {
      id: string;
      image: string | null;
      created_at: Date;
      checklist_item_id: string;
    }[];
  };
  slides?: any;
  config?: any;
}

export function ImageDialog({ ...props }: ObservationDialogProps) {
  const [select, setSelected] = useState(0);
  const [mainCaroselApi, setApi] = useState<CarouselApi>();
  const [thumbsCaroselApi, setThumbApi] = useState<CarouselApi>();

  const onSelect = useCallback(() => {
    if (!mainCaroselApi || !thumbsCaroselApi) return;
    thumbsCaroselApi.scrollTo(mainCaroselApi.selectedScrollSnap());
    setSelected(mainCaroselApi.selectedScrollSnap());
  }, [mainCaroselApi, thumbsCaroselApi]);

  useEffect(() => {
    if (!mainCaroselApi) {
      return;
    }

    mainCaroselApi
      .on("select", onSelect)
      .on("reInit", onSelect)
      .on("init", onSelect);
  }, [mainCaroselApi, onSelect]);

  return (
    <Dialog {...props}>
      <DialogContent
        className="w-full max-w-xl border-none bg-transparent shadow-none"
        aria-describedby="content"
      >
        <DialogHeader>
          <DialogTitle hidden>Imagens</DialogTitle>
        </DialogHeader>
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <Carousel className="max-w-lg" setApi={setApi}>
            <CarouselContent aria-describedby="content">
              {props.item.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square p-1">
                    <img
                      src={"http://172.16.146.58:3333/" + image.image}
                      className="h-full w-full rounded object-cover"
                      alt=""
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <Carousel setApi={setThumbApi}>
            <CarouselContent aria-describedby="content">
              {props.item.images.map((image, index) => (
                <CarouselItem key={index} className={"basis-1/5"}>
                  <button
                    onClick={() => mainCaroselApi?.scrollTo(index)}
                    type="button"
                    className={
                      "h-24 w-24 rounded" +
                      ` ${select === index ? "border border-sky-400" : ""}`
                    }
                  >
                    <img
                      src={"http://172.16.146.58:3333/" + image.image}
                      className="h-full w-full object-fill"
                      alt=""
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
