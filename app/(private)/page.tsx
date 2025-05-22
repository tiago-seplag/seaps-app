import { getCountByRange, getOrganizationsIGM } from "@/models/dashboard";
import { BarComponent } from "./(dashboard)/bar-card";
import { IRMBarComponent } from "./(dashboard)/irm-chart";

export default async function Page() {
  const ranges = await getCountByRange();

  const irm = await getOrganizationsIGM();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      <BarComponent data={ranges} />
      <IRMBarComponent data={irm} />
    </div>
  );
}
