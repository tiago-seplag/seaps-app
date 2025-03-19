/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { ChecklistItemImages } from "@prisma/client";
import React from "react";

type PropType = {
  selected: boolean;
  index: number;
  image: ChecklistItemImages;
  onClick: () => void;
};

export const CarouselButton: React.FC<PropType> = (props) => {
  const { selected, onClick } = props;

  return (
    <div className={"embla-thumbs__slide"}>
      <button
        onClick={onClick}
        type="button"
        className={cn(
          "embla-thumbs__slide__number overflow-hidden rounded-sm",
          selected && "border-2 border-sky-400",
        )}
      >
        <img
          src={process.env.BUCKET_URL + props.image.image}
          alt="image"
          className="aspect-square h-full w-full object-cover"
        />
      </button>
    </div>
  );
};
