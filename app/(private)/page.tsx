import { getCountByRange } from "@/models/dashboard";
import { BarComponent } from "./(dashboard)/bar-card";

export default async function Page() {
  const ranges = await getCountByRange();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      <BarComponent data={ranges} />
      {/* <PieComponent />
      <HorizontalBarComponent />
      <AreaComponent /> */}
    </div>
  );
}
