/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { $Enums } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploader } from "./file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const UploadCard = ({
  status,
  checklistItemId,
  maxFileCount,
}: {
  status: $Enums.Status;
  checklistItemId: string;
  maxFileCount: number;
}) => {
  const { onUpload, progresses, isUploading, uploadedFiles } = useUploadFile(
    "/api/upload/",
    {
      defaultUploadedFiles: [],
    },
    "photos",
  );
  const router = useRouter();

  useEffect(() => {
    const onFinishUpload = (files: any[]) => {
      fetch("/api/checklist-item/" + checklistItemId + "/images", {
        body: JSON.stringify({ images: files.map((image) => image.url) }),
        method: "PUT",
      })
        .then(() => router.refresh())
        .catch(async () => toast.error("Opa! Algo deu errado!"));
    };

    if (uploadedFiles.length > 0) {
      onFinishUpload(uploadedFiles[uploadedFiles.length - 1].files);
    }
  }, [checklistItemId, router, uploadedFiles]);

  return (
    <Card>
      <CardContent className="h-full min-h-[314px] py-6">
        <FileUploader
          disabled={status === "CLOSED" || isUploading}
          maxFileCount={maxFileCount}
          progresses={progresses}
          onUpload={onUpload}
          accept={{ "image/*": [] }}
          maxSize={1024 * 1024 * 1024 * 2}
        />
      </CardContent>
    </Card>
  );
};
