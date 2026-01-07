import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-600 text-white hover:bg-primary-700",
                secondary:
                    "bg-accent-500 text-gray-900 hover:bg-accent-600",
                success:
                    "bg-green-100 text-green-700 hover:bg-green-200",
                warning:
                    "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                danger:
                    "bg-red-100 text-red-700 hover:bg-red-200",
                outline:
                    "border border-gray-300 text-gray-700 hover:bg-gray-100",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
