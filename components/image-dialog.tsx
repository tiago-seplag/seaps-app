/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import Image from "next/image";

interface ObservationDialogProps extends DialogProps {
  item: ChecklistItems & {
    item: {
      name: string;
    };
    images: {
      id: string;
      image: string;
      created_at: Date;
      checklist_item_id: string;
      observation: string | null;
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
        className="w-full max-w-[600px] border-none px-0 shadow-none"
        aria-describedby="content"
      >
        <DialogHeader hidden>
          <DialogTitle hidden>Imagens</DialogTitle>
          <DialogDescription hidden>Imagens</DialogDescription>
        </DialogHeader>
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4">
          <Carousel setApi={setApi}>
            <CarouselContent aria-describedby="content">
              {props.item.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square w-full max-w-[512px]">
                    <Image
                      src={process.env.BUCKET_URL + image.image}
                      className="h-full w-full rounded object-contain"
                      width={512}
                      height={512}
                      alt={image.observation || ""}
                    />
                    {image.observation && (
                      <div className="absolute bottom-0 w-full bg-black/50 p-2 text-white">
                        {image.observation}
                      </div>
                    )}
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
                    <Image
                      src={process.env.BUCKET_URL + image.image}
                      className="h-full w-full object-fill"
                      width={96}
                      height={96}
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
