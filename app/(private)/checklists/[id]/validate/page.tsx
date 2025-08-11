import { Suspense } from "react";
import { ValidatePage } from "./validate";
import Loading from "../loading";

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ValidatePage />
    </Suspense>
  );
}
