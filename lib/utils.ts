import { clsx, type ClassValue } from "clsx";
import { ChangeEvent } from "react";
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

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const getFirstAndLastName = (name: string) => {
  const names = name.trim().split(/\s+/); // Remove espaços extras e divide por espaços
  if (names.length === 1) return names[0];

  const firstName = names[0];
  const lastName = names[names.length - 1];

  return `${firstName} ${lastName}`;
};

export const toUpperCase = (e: ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.toUpperCase();

  return e;
};

export const formatPhone = (value?: string | null) => {
  if (!value) {
    return "--";
  }

  const str = value.replace(/\D/g, ""); // remove caracteres não numéricos

  return str.length <= 10
    ? str.replace(/(\d{2})(\d)/, "\($1\) $2").replace(/(\d{4})(\d)/, "$1-$2")
    : str
        .replace(/(\d{2})(\d)/, "\($1\) $2")
        .replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3")
        .slice(0, 16);
};
