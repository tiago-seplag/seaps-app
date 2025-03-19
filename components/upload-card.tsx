"use client";

import { $Enums } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploader } from "./file-uploader";

export const UploadCard = ({
  status,
  checklistItemId,
  maxFileCount,
}: {
  status: $Enums.Status;
  checklistItemId: string;
  maxFileCount: number;
}) => {
  return (
    <Card>
      <CardContent className="h-full min-h-[314px] py-6">
        <FileUploader
          id={checklistItemId}
          disabled={status === "CLOSED"}
          maxFileCount={maxFileCount}
          accept={{ "image/*": [] }}
          maxSize={1024 * 1024 * 1024 * 2}
        />
      </CardContent>
    </Card>
  );
};
