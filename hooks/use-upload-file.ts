/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import axios from "axios";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";

export function useUploadFile(
  endpoint: string,
  { defaultUploadedFiles = [] }: any,
  folder: string,
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<any[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);

    const data = new FormData();
    data.append("folder", folder);

    files.forEach((img) => {
      data.append("file", img);
    });

    try {
      const res = await axios.post(endpoint, data, {
        onUploadProgress: (progressEvent: any) => {
          const progress = (progressEvent.loaded * 100) / progressEvent.total;
          setProgresses((prev) => {
            return {
              ...prev,
              [files[0].name]: Number(progress.toPrecision(4)),
            };
          });
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, res.data] : [res.data]));
      return res.data;
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      // setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
