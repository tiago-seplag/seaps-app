import { Badge } from "./ui/badge";

export const ScoreBadge = ({ status }: { status: string }) => {
  const ScoreMap: Record<string, string> = {
    "3": "Bom",
    "1": "Regular",
    "-2": "Ruim",
    "0": "Não se aplica",
  };

  const ScoreColor: Record<string, string> = {
    "3": "green",
    "1": "yellow",
    "-2": "red",
    "0": "primary",
  };

  return (
    <Badge
      variant={
        ScoreColor[status] as
          | "green"
          | "default"
          | "destructive"
          | "secondary"
          | "outline"
          | "red"
      }
    >
      {ScoreMap[status] || "--"}
    </Badge>
  );
};
