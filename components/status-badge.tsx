import { Badge } from "./ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const badge = {
    label: "",
    style: "",
  };

  switch (status) {
    case "OPEN":
      badge.label = "ABERTO";
      badge.style = "border-blue-800 bg-blue-500 hover:bg-blue-500/80";
      break;
    case "CLOSED":
      badge.label = "FECHADO";
      badge.style = "border-yellow-800 bg-yellow-500 hover:bg-yellow-500/80";
      break;
    case "REJECTED":
      badge.label = "REJEITADO";
      badge.style = "border-red-800 bg-red-500 hover:bg-red-500/80";
      break;
    case "APPROVED":
      badge.label = "APROVADO";
      badge.style = "border-green-800 bg-green-500 hover:bg-green-500/80";
      break;
    default:
      badge.label = "ABERTO";
      badge.style = "border-blue-800 bg-blue-500 hover:bg-blue-500/80";
  }

  return <Badge className={badge.style}>{badge.label}</Badge>;
};
