"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBack = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant={"outline"} size="icon">
      <ArrowLeft />
    </Button>
  );
};
