import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function idFormat(id: string) {
  const customId = id
    .split(".")
    .map((n) => Number(n) + 1)
    .toString()
    .replaceAll(",", ".");

  if (customId.split(".").length === 1) {
    return customId + ".0.0";
  }
  if (customId.split(".").length === 2) {
    return customId + ".0";
  }
  return customId;
}
