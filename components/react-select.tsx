"use client";

import * as React from "react";
import Select, {
  components,
  type GroupBase,
  type Props as ReactSelectProps,
  DropdownIndicatorProps,
  createFilter,
  ClearIndicatorProps,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import { ChevronDown, X } from "lucide-react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export type RSOption = { name: string; id: string };
export type RSSelectSize = "sm" | "md" | "lg";

export interface RSSelectBaseProps<
  Option extends RSOption = RSOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<
    ReactSelectProps<Option, IsMulti, Group>,
    "styles" | "classNames"
  > {
  label?: string;
  description?: string;
  error?: string;
  size?: RSSelectSize;
  className?: string;
}

const sizeHeights: Record<RSSelectSize, string> = {
  sm: "!min-h-9",
  md: "!min-h-10",
  lg: "!min-h-11",
};

const valuePaddings: Record<RSSelectSize, string> = {
  sm: "py-1.5 px-3",
  md: "py-2 px-3",
  lg: "py-2.5 px-3.5",
};

const optionPaddings: Record<RSSelectSize, string> = {
  sm: "py-1.5 px-2",
  md: "py-2 px-2.5",
  lg: "py-2.5 px-3",
};

function buildClassNames(size: RSSelectSize, invalid: boolean) {
  const controlBase = cn(
    "w-full rounded-md border text-sm shadow-sm",
    "border-input focus-within:ring-1 focus-within:ring-ring",
    "transition-colors",
    sizeHeights[size],
    invalid && "border-destructive focus-within:ring-destructive",
  );

  return {
    control: ({ isDisabled }) =>
      cn(controlBase, isDisabled && "opacity-50 cursor-not-allowed bg-muted"),
    valueContainer: () => cn("gap-1", valuePaddings[size]),
    placeholder: () => "text-muted-foreground text-nowrap",
    input: () => "text-foreground",
    singleValue: () => "text-foreground",
    indicatorsContainer: () => "gap-1 pr-2",
    indicatorSeparator: () => "hidden",
    clearIndicator: () =>
      cn(
        "rounded-md p-1 hover:bg-accent hover:text-accent-foreground",
        "active:scale-95",
      ),
    dropdownIndicator: () =>
      cn(
        "rounded-md p-1 hover:bg-accent hover:text-accent-foreground",
        "active:scale-95",
      ),
    multiValue: () =>
      cn(
        "rounded-md bg-secondary text-secondary-foreground border border-transparent",
        "hover:border-border",
      ),
    multiValueLabel: () => "px-2",
    multiValueRemove: () =>
      cn(
        "rounded-r-md px-1 hover:bg-destructive hover:text-destructive-foreground",
      ),
    menu: () =>
      cn(
        "mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
      ),
    menuList: () => "max-h-64 overflow-y-auto p-1",
    option: ({ isFocused, isSelected }) =>
      cn(
        "cursor-default select-none rounded-sm text-xs",
        optionPaddings["md"],
        isSelected && "bg-accent text-accent-foreground",
        !isSelected && isFocused && "bg-muted",
      ),
    noOptionsMessage: () => "text-muted-foreground p-2",
    loadingMessage: () => "text-muted-foreground p-2",
  } as ReactSelectProps["classNames"];
}

const DropdownIndicator = (props: DropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown className="h-4 w-4" />
  </components.DropdownIndicator>
);

const ClearIndicator = (props: ClearIndicatorProps) => (
  <components.ClearIndicator {...props}>
    <X className="h-4 w-4" />
  </components.ClearIndicator>
);

function BaseWrapper<
  Option extends RSOption,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: RSSelectBaseProps<Option, IsMulti, Group> & {
    selectKind: "default" | "creatable" | "async";
  },
) {
  const {
    label,
    description,
    error,
    size = "sm",
    className,
    selectKind,
    ...selectProps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = props as any;

  const classNames = React.useMemo(
    () => buildClassNames(size, Boolean(error)),
    [size, error],
  );

  const [portalTarget, setPortalTarget] = React.useState<
    HTMLElement | undefined
  >(undefined);
  React.useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const commonProps = {
    unstyled: true,
    components: {
      DropdownIndicator,
      ClearIndicator,
    },
    noOptionsMessage: () => "Nenhuma opção encontrada",
    menuPortalTarget: portalTarget,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 50 }),
      control: (base) => ({ ...base, cursor: "pointer" }),
    },
    filterOption: createFilter({ matchFrom: "start" }),
    isClearable: true,
    classNames,
    getOptionValue: (option: { id: string }) => `${option["id"]}`,
    getOptionLabel: (option: { name: string }) => option["name"],
  } as ReactSelectProps;

  const Control =
    selectKind === "creatable" ? (
      <CreatableSelect {...selectProps} {...commonProps} />
    ) : selectKind === "async" ? (
      <AsyncSelect {...selectProps} {...commonProps} />
    ) : (
      <Select {...selectProps} {...commonProps} />
    );

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      {Control}
      {description && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function RSSelect<
  Option extends RSOption = RSOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: RSSelectBaseProps<Option, IsMulti, Group>) {
  return <BaseWrapper {...props} selectKind="default" />;
}

export function RSCreatable<
  Option extends RSOption = RSOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: RSSelectBaseProps<Option, IsMulti, Group>) {
  return <BaseWrapper {...props} selectKind="creatable" />;
}

export function RSAsync<
  Option extends RSOption = RSOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: RSSelectBaseProps<Option, IsMulti, Group>) {
  return <BaseWrapper {...props} selectKind="async" />;
}
