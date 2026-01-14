import React from "react";
import { cn } from "@/lib/utils";

// Componente Table Root
const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

// Table Header
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        className={cn(
            "bg-linear-to-r from-primary-600 to-primary-700 text-white",
            className
        )}
        {...props}
    />
));
TableHeader.displayName = "TableHeader";

// Table Body
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

// Table Footer
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-gray-50 font-medium",
            className
        )}
        {...props}
    />
));
TableFooter.displayName = "TableFooter";

// Table Row
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-accent-50",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

// Table Head (th)
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-semibold text-white [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
));
TableHead.displayName = "TableHead";

// Table Cell (td)
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            "p-4 align-middle [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
));
TableCell.displayName = "TableCell";

// Table Caption
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-gray-500", className)}
        {...props}
    />
));
TableCaption.displayName = "TableCaption";

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
};
