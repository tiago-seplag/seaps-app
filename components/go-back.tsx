"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBack = ({ href }: { href?: string }) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => (href ? router.replace(href) : router.back())}
      variant={"outline"}
      className="min-w-9"
      size="icon"
    >
      <ArrowLeft />
    </Button>
  );
};
