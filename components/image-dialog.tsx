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
import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";

interface ObservationDialogProps extends DialogProps {
  item: ChecklistItems & {
    item: {
      name: string;
    };
  };
  slides?: any;
  config?: any;
}
const SLIDES = Array.from(Array(10).keys());

export function ImageDialog({
  slides = SLIDES,
  ...props
}: ObservationDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainApi, setApi] = useState<CarouselApi>();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    if (!emblaMainApi) {
      return;
    }

    emblaMainApi.on("select", () => {
      setSelectedIndex(emblaMainApi.selectedScrollSnap() + 1);
    });
  }, [emblaMainApi]);

  return (
    <Dialog {...props}>
      <DialogContent className="flex h-full w-full flex-col border-none bg-transparent">
        <DialogHeader>
          <DialogTitle hidden>Imagens</DialogTitle>
        </DialogHeader>
        <Carousel className="max-w-lg" setApi={setApi}>
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="embla-thumbs">
          <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
            <div className="embla-thumbs__container">
              {slides.map((index: number) => (
                <Thumb
                  key={index}
                  onClick={() => emblaMainApi?.scrollTo(index)}
                  selected={index === selectedIndex}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const Thumb = (props: any) => {
  const { selected, onClick } = props;

  return (
    <div
      className={"embla-thumbs__slide".concat(
        selected ? "embla-thumbs__slide--selected" : "",
      )}
    >
      <button onClick={onClick} type="button" className="">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRawvj3AK7RB1XwVOeoYT79xjgejLyE7SGvIA&s"
          className="w-24 object-cover"
          alt=""
        />
      </button>
    </div>
  );
};
