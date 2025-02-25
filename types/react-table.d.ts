import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    headerClassName?: HTMLAttributes<HTMLTableHeaderCellElement>["className"];
    cellClassName?: HTMLAttributes<HTMLTableDataCellElement>["className"];
  }
}
