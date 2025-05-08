import {
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  
  export default async function BreadcrumbSlot() {
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Responsáveis</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Editar Responsável</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  }
  