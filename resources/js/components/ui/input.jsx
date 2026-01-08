import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
    "flex w-full text-base placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
    {
        variants: {
            variant: {
                underline:
                    "h-12 border-0 border-b border-gray-300 bg-transparent px-0 py-3 focus:border-primary-600 relative",
                outlined:
                    "h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 hover:border-gray-300",
            },
        },
        defaultVariants: {
            variant: "underline",
        },
    }
);

const Input = React.forwardRef(
    ({ className, type, variant, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className="relative w-full">
                <input
                    type={type}
                    className={cn(inputVariants({ variant }), className)}
                    ref={ref}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
                {variant === "underline" && (
                    <span
                        className={cn(
                            "absolute bottom-0 left-0 h-[2px] w-full bg-primary-600 origin-left transition-transform duration-300 ease-out",
                            isFocused ? "scale-x-100" : "scale-x-0"
                        )}
                    />
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input, inputVariants };
