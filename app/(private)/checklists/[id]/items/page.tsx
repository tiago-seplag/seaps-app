import { Suspense } from "react";
import { ItemsPage } from "./items-page";
import Loading from "../loading";

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ItemsPage />
    </Suspense>
  );
}
