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

export const getFirstAndLastName = (name?: string) => {
  if (!name) {
    return "--";
  }
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

export const formatCEP = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 5) {
    e.target.value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
  } else {
    e.target.value = value;
  }
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

export const states = [
  {
    acronym: "AC",
    name: "Acre",
  },
  {
    acronym: "AL",
    name: "Alagoas",
  },
  {
    acronym: "AP",
    name: "Amapá",
  },
  {
    acronym: "AM",
    name: "Amazonas",
  },
  {
    acronym: "BA",
    name: "Bahia",
  },
  {
    acronym: "CE",
    name: "Ceará",
  },
  {
    acronym: "DF",
    name: "Distrito Federal",
  },
  {
    acronym: "ES",
    name: "Espírito Santo",
  },
  {
    acronym: "GO",
    name: "Goiás",
  },
  {
    acronym: "MA",
    name: "Maranhão",
  },
  {
    acronym: "MT",
    name: "Mato Grosso",
  },
  {
    acronym: "MS",
    name: "Mato Grosso do Sul",
  },
  {
    acronym: "MG",
    name: "Minas Gerais",
  },
  {
    acronym: "PR",
    name: "Paraná",
  },
  {
    acronym: "PB",
    name: "Paraíba",
  },
  {
    acronym: "PA",
    name: "Pará",
  },
  {
    acronym: "PE",
    name: "Pernambuco",
  },
  {
    acronym: "PI",
    name: "Piauí",
  },
  {
    acronym: "RJ",
    name: "Rio de Janeiro",
  },
  {
    acronym: "RN",
    name: "Rio Grande do Norte",
  },
  {
    acronym: "RS",
    name: "Rio Grande do Sul",
  },
  {
    acronym: "RO",
    name: "Rondônia",
  },
  {
    acronym: "RR",
    name: "Roraima",
  },
  {
    acronym: "SC",
    name: "Santa Catarina",
  },
  {
    acronym: "SE",
    name: "Sergipe",
  },
  {
    acronym: "SP",
    name: "São Paulo",
  },
  {
    acronym: "TO",
    name: "Tocantins",
  },
];
