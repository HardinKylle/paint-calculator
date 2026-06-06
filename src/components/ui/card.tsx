import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-stone-200 bg-white shadow-xs",
          hoverable && "transition-all duration-300 hover:border-rose-200 hover:shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
