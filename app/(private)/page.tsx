import { AreaComponent } from "./(dashboard)/area-card";
import { BarComponent } from "./(dashboard)/bar-card";
import { HorizontalBarComponent } from "./(dashboard)/horizontal-bar-card";
import { PieComponent } from "./(dashboard)/pie-card";

export default async function Page() {
  return (
    <div className="grid grid-cols-3">
      <BarComponent />
      <PieComponent />
      <HorizontalBarComponent />
      <AreaComponent />
    </div>
  );
}
