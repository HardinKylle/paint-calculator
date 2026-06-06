import * as React from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsiblePanelProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const CollapsiblePanel = React.forwardRef<HTMLDetailsElement, CollapsiblePanelProps>(
  ({ className, label, icon: Icon, children, ...props }, ref) => {
    return (
      <details
        ref={ref}
        className={cn(
          "group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs",
          className
        )}
        {...props}
      >
        <summary className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50/50 hover:bg-stone-50 list-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1.5">
            {Icon && <Icon size={14} className="text-stone-400" />}
            {label}
          </span>
          <ChevronDown
            size={14}
            className="text-stone-400 group-open:rotate-180 transition-transform duration-200"
          />
        </summary>
        <div className="p-4 border-t border-stone-200 bg-stone-50/20">{children}</div>
      </details>
    );
  }
);

CollapsiblePanel.displayName = "CollapsiblePanel";
