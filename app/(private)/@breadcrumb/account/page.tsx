import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default async function BreadcrumbSlot() {
  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbPage>Conta</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
