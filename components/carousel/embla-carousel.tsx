import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselButton } from "./carousel-button";
import { ChecklistItemImages } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PropType = {
  slides: ChecklistItemImages[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());

    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      setSelectedIndex(index);
      onSelect();
    },
    [emblaMainApi, emblaThumbsApi, onSelect],
  );

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = React.useCallback(() => {
    emblaMainApi?.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = React.useCallback(() => {
    emblaMainApi?.scrollNext();
  }, [emblaMainApi]);

  return (
    <div className="embla relative">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {slides.map((item) => (
            <div className="embla__slide" key={item.id}>
              <Image
                src={process.env.BUCKET_URL + item.image}
                className="h-96 w-full rounded object-contain"
                width={512}
                height={512}
                alt={item.observation || ""}
              />
            </div>
          ))}
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className={cn(
            "absolute -right-12 top-[40%] hidden h-8 w-8 -translate-y-1/2 rounded-full disabled:pointer-events-auto sm:flex",
          )}
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          className={cn(
            "absolute -left-12 top-[40%] hidden h-8 w-8 -translate-y-1/2 rounded-full disabled:pointer-events-auto sm:flex",
          )}
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((item, index) => (
              <CarouselButton
                key={item.id}
                image={item}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
