// components/ui/data-table.tsx
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tableVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered: "border border-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface DataTableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableVariants> {
  asChild?: boolean;
}

const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(tableVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
DataTable.displayName = "DataTable";

const DataTableHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky top-0 z-10 bg-background border-b border-gray-200",
      className
    )}
    {...props}
  />
));
DataTableHeader.displayName = "DataTableHeader";

const DataTableBody = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("overflow-y-auto", className)} {...props} />
));
DataTableBody.displayName = "DataTableBody";

const DataTableRow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-b border-gray-200 hover:bg-gray-50 transition-colors",
      className
    )}
    {...props}
  />
));
DataTableRow.displayName = "DataTableRow";

const DataTableCell = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 px-4 py-3 text-sm max-w-max]", className)}
    {...props}
  />
));
DataTableCell.displayName = "DataTableCell";

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
};
