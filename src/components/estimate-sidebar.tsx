"use client";

import React from "react";
import type { ProjectEstimate } from "@/types/estimate";
import { EstimatePanel } from "@/components/panels";

interface EstimateSidebarProps {
  estimate: ProjectEstimate;
}

export const EstimateSidebar: React.FC<EstimateSidebarProps> = ({ estimate }) => {
  return (
    <aside className="w-full lg:col-span-5 order-first lg:order-none lg:sticky lg:top-20 space-y-6">
      {/* Mobile Top Summary & Collapsible Detailed Breakdown */}
      <div className="block lg:hidden space-y-3">
        <EstimatePanel estimate={estimate} compact={true} />

        <details className="group">
          <summary className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-600 hover:text-stone-800 cursor-pointer select-none transition-colors list-none [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show Detailed Breakdown</span>
            <span className="hidden group-open:inline">Hide Detailed Breakdown</span>
          </summary>
          <div className="mt-3">
            <EstimatePanel estimate={estimate} />
          </div>
        </details>
      </div>

      {/* Desktop Sidebar (Only visible on lg screens) */}
      <div className="hidden lg:block">
        <EstimatePanel estimate={estimate} />
      </div>
    </aside>
  );
};
