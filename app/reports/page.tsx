"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../(private)/loading";

const Report = dynamic(
  () => import("./_components/report").then((component) => component.Report),
  { ssr: false },
);

export default function Page() {
  const searchParams = useSearchParams();

  const [checklist, setChecklist] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/checklists/" + searchParams.get("id"))
      .then((response) => response.json())
      .then((data) => setChecklist(data));
    setLoading(false);
  }, [searchParams]);

  if (loading || !checklist) {
    return <Loading />;
  }

  return <Report checklist={checklist} />;
}
