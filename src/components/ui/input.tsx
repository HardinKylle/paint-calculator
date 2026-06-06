import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "seamless";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "focus:outline-hidden transition-all duration-200",
          variant === "default" &&
            "w-full rounded-lg border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-sm text-stone-900 focus:border-rose-500 focus:bg-white",
          variant === "seamless" &&
            "font-semibold text-lg text-stone-900 border-b border-transparent hover:border-stone-300 focus:border-rose-500 py-0.5 px-1 rounded-sm w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
