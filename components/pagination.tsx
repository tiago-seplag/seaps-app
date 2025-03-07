"use client";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { HTMLAttributes } from "react";

interface IPaginationComponent {
  className?: HTMLAttributes<"nav">["className"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}

export function Pagination({ className, meta }: IPaginationComponent) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const LE = "-3";
  const RE = "+3";

  const generatePages = () => {
    const current = Math.min(meta?.current_page || 1, meta?.current_page || 1);
    const total = Math.max(1, meta?.last_page || 1);

    if (total <= 7) {
      return Array.from({ length: total }).map((_, i) => i + 1);
    }

    if (current < 3) {
      return [1, 2, 3, RE, total - 1, total];
    }

    if (current === 3) {
      return [1, 2, 3, 4, RE, total - 1, total];
    }

    if (current > total - 2) {
      return [1, 2, LE, total - 2, total - 1, total];
    }

    if (current === total - 2) {
      return [1, 2, LE, total - 3, total - 2, total - 1, total];
    }

    return [1, LE, current - 1, current, current + 1, RE, total];
  };

  function generateUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    const url = pathName + "?" + params.toString();

    return url;
  }

  return (
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem className="hidden sm:block">
          <PaginationPrevious
            disabled={!meta?.prev_page}
            scroll={false}
            href={generateUrl(meta?.current_page ? meta?.current_page - 1 : 0)}
          />
        </PaginationItem>
        {generatePages().map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  // scroll={false}
                  href={generateUrl(meta?.current_page + Number(item))}
                  // isActive={item === meta?.current_page}
                >
                  <PaginationEllipsis />
                </PaginationLink>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={index}>
              <PaginationLink
                // scroll={false}
                href={generateUrl(item)}
                isActive={item === meta?.current_page}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem className="hidden sm:block">
          <PaginationNext
            disabled={!meta?.next_page}
            scroll={false}
            href={generateUrl(meta?.current_page ? meta?.current_page + 1 : 0)}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
