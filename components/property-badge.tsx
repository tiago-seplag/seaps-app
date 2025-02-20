import { Badge, BadgeProps } from "./ui/badge";

const ENUM = {
  OWN: {
    label: "PRÓPRIO",
    style: "",
  },
  RENTED: {
    label: "ALUGADO",
    style: "bg-yellow-600 hover:bg-yellow/80",
  },
  GRANT: {
    label: "CONCESSÃO",
    style: "bg-red-600 hover:bg-red/80",
  },
};

export type ENUM_PROPERTY = "GRANT" | "RENTED" | "OWN";

interface PropertyBadgeProps extends BadgeProps {
  type: ENUM_PROPERTY;
}

export const PropertyBadge = ({ type, ...props }: PropertyBadgeProps) => {
  return (
    <Badge className={ENUM[type].style} {...props}>
      {ENUM[type].label}
    </Badge>
  );
};
