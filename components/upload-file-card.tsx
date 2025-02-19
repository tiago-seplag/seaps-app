/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyCard } from "@/components/empty-card";
import Image from "next/image";
import React from "react";
import { FileText } from "lucide-react";

interface UploadedFilesCardProps {
  uploadedFiles: any[];
}

export function UploadedFilesCard({ uploadedFiles }: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded file</CardTitle>
        <CardDescription>View the uploaded file here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="flex w-max space-x-2.5">
              {uploadedFiles.map((file) => (
                <FilePreview
                  key={file.filename}
                  {...file}
                  className="relative aspect-video w-64"
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}

interface FilePreviewProps {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export function FilePreview(file: FilePreviewProps) {
  if (file.mimetype.startsWith("image/")) {
    return (
      <Image
        src={"http://127.0.0.1:3333/images/videos/" + file.filename}
        alt={file.filename}
        width={128}
        height={128}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  if (file.mimetype.startsWith("video/")) {
    return (
      <video
        src={
          "http://127.0.0.1:3333/stream/videos/" + file.filename.slice(0, -4)
        }
        playsInline
        preload="metadata"
        controls={false}
        className="inset-0 h-32 w-32 rounded-md object-cover"
        onLoadedData={(e: any) => (e.target.currentTime = 20)}
      />
    );
  }

  return (
    <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
  );
}
