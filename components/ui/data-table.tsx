// components/ui/data-table.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { height?: string }
>(({ className, height = "500px", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full overflow-auto rounded-lg border shadow-sm",
      className
    )}
    style={{ height }}
    {...props}
  />
));
TableContainer.displayName = "TableContainer";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm border-collapse", className)}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("sticky top-0 z-10 bg-gray-50 dark:bg-gray-800", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isExpandable?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { className, isExpandable = false, isExpanded = false, onExpand, ...props },
    ref
  ) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors",
        isExpandable && "cursor-pointer hover:bg-gray-50",
        isExpanded && "bg-gray-50",
        className
      )}
      onClick={isExpandable ? onExpand : undefined}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { width?: string }
>(({ className, width, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 border-b",
      className
    )}
    style={{ width }}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { width?: string }
>(({ className, width, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-2 align-middle border-b", className)}
    style={{ width }}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const ExpandableTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    colSpan={100}
    className={cn("p-0 bg-gray-50", className)}
    {...props}
  >
    <div className="p-4 border-b">{children}</div>
  </td>
));
ExpandableTableCell.displayName = "ExpandableTableCell";

const AttendanceRecordsTable = ({
  records,
}: {
  records: Array<{
    timestamp: string;
    punchIn: string;
    punchOut: string;
  }>;
}) => {
  return (
    <div className="ml-12 border rounded-lg overflow-hidden w-[calc(100%-3rem)]">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left font-medium border-b">Timestamp</th>
            <th className="p-3 text-left font-medium border-b">Punch In</th>
            <th className="p-3 text-left font-medium border-b">Punch Out</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{record.timestamp}</td>
              <td className="p-3">{record.punchIn}</td>
              <td className="p-3">{record.punchOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ExpandableTableCell,
  AttendanceRecordsTable,
};
