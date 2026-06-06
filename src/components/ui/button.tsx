import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "dashed" | "toggle" | "icon-trash" | "icon-add";
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", active, size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg transition-all duration-200 font-medium cursor-pointer",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 shadow-xs border-0 font-semibold",
          variant === "secondary" &&
            "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors",
          variant === "destructive" &&
            "border border-stone-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors",
          variant === "dashed" &&
            "w-full py-3 border-2 border-dashed border-stone-200 hover:border-rose-300 hover:bg-rose-50/10 text-stone-500 hover:text-rose-600 bg-transparent font-semibold text-xs rounded-xl",
          variant === "toggle" &&
            cn(
              "flex-1 text-xs py-1.5 border",
              active
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-stone-50 border-stone-200 text-stone-400"
            ),
          variant === "icon-trash" &&
            "p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg",
          variant === "icon-add" &&
            "h-6 w-6 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors",
          
          // Sizes (applicable only to buttons that are not dashed, toggle, or icon variants)
          variant !== "dashed" && variant !== "toggle" && variant !== "icon-trash" && variant !== "icon-add" && cn(
            size === "sm" && "py-1 px-2.5 text-[11px]",
            size === "md" && "py-1.5 px-3 text-xs",
            size === "lg" && "py-2 px-4 text-xs font-semibold"
          ),
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
