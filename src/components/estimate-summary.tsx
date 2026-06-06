import React from "react";
import { Paintbrush, Clock, HelpCircle } from "lucide-react";
import type { ProjectEstimate } from "../types/estimate";
import {
  formatCurrency,
  formatArea,
  formatLitres,
  formatHours,
  formatTinRecommendation,
} from "../lib/formatting";

interface EstimateSummaryProps {
  estimate: ProjectEstimate;
  compact?: boolean;
}

export const EstimateSummary: React.FC<EstimateSummaryProps> = ({ estimate, compact = false }) => {
  if (compact) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Total Project Cost
            </span>
            <span className="text-2xl font-black text-rose-800">
              {formatCurrency(estimate.totalProjectCostAud)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-stone-500 justify-center sm:justify-start">
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="block text-[9px] uppercase tracking-wide text-stone-400">Area</span>
              <strong className="text-stone-900">{formatArea(estimate.totalPaintableAreaM2)}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="block text-[9px] uppercase tracking-wide text-stone-400">Paint</span>
              <strong className="text-stone-900">
                {formatLitres(estimate.totalWallPaintLitresPurchased + estimate.totalCeilingPaintLitresPurchased)}
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
              <span className="block text-[9px] uppercase tracking-wide text-stone-400">Labour</span>
              <strong className="text-stone-900">{formatHours(estimate.totalLabourHours)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden">
      {/* Top Banner: Prominent Total Cost */}
      <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
        {/* Subtle decorative background gradient representing modern slate architectural tone */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-slate-800/40 to-slate-900 pointer-events-none" />
        
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300 relative z-10">
          Estimated Project Cost
        </p>
        <h3 className="text-4xl font-bold mt-1.5 relative z-10">
          {formatCurrency(estimate.totalProjectCostAud)}
        </h3>
        <p className="text-[11px] text-rose-300/80 mt-1 relative z-10">
          Includes bulk-optimized paint purchase & labour (Excl. GST)
        </p>
      </div>

      {/* Main Breakdown Section */}
      <div className="p-6 flex flex-col gap-6">
        {/* Row 1: Areas and Labour Hours */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-100">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-stone-500 mb-0.5">
              Wall Area
            </span>
            <span className="text-sm font-semibold text-stone-900">
              {formatArea(estimate.totalWallAreaM2)}
            </span>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-100">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-stone-500 mb-0.5">
              Ceiling Area
            </span>
            <span className="text-sm font-semibold text-stone-900">
              {formatArea(estimate.totalCeilingAreaM2)}
            </span>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-100">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-stone-500 mb-0.5">
              Paintable Area
            </span>
            <span className="text-sm font-semibold text-stone-900" title="Includes coat multipliers">
              {formatArea(estimate.totalPaintableAreaM2)}
            </span>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="flex flex-col gap-4">
          {/* Section: Paint Materials */}
          <div className="rounded-xl border border-stone-100 bg-stone-50/30 p-4">
            <div className="flex items-center gap-2 mb-3 text-stone-800 font-semibold text-sm">
              <Paintbrush size={16} className="text-rose-600" />
              <span>Paint Materials Estimate</span>
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-stone-600">
              <div className="flex justify-between items-center">
                <span>Raw Litres Required:</span>
                <span className="font-medium text-stone-950">
                  Walls: {formatLitres(estimate.totalWallPaintLitresRaw)} | Ceilings: {formatLitres(estimate.totalCeilingPaintLitresRaw)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Purchased Litres:</span>
                <span className="font-medium text-stone-950">
                  Walls: {formatLitres(estimate.totalWallPaintLitresPurchased)} | Ceilings: {formatLitres(estimate.totalCeilingPaintLitresPurchased)}
                </span>
              </div>

              <div className="flex flex-col border-t border-stone-100/70 pt-2 gap-1.5">
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase font-medium tracking-wide">
                    Wall Paint Recommendation:
                  </span>
                  <span className="font-semibold text-stone-900 block mt-0.5">
                    {formatTinRecommendation(estimate.totalWallTins)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="block text-[10px] text-stone-400 uppercase font-medium tracking-wide">
                    Ceiling Paint Recommendation:
                  </span>
                  <span className="font-semibold text-stone-900 block mt-0.5">
                    {formatTinRecommendation(estimate.totalCeilingTins)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-stone-100/70 pt-2">
                <span className="flex items-center gap-1">
                  Touch-up Reserve (Surplus):
                  <span title="Leftover paint from rounded tin recommendations, useful for future patch-ups.">
                    <HelpCircle size={12} className="text-stone-400 cursor-help" />
                  </span>
                </span>
                <span className="font-medium text-rose-800">
                  Walls: {formatLitres(estimate.totalTouchUpReserveWallL)} | Ceilings: {formatLitres(estimate.totalTouchUpReserveCeilingL)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-stone-100/70 pt-2">
                <span>Purchased Paint Cost:</span>
                <span className="font-medium text-stone-950">
                  Walls: {formatCurrency(estimate.totalWallPaintCostAud)} | Ceilings: {formatCurrency(estimate.totalCeilingPaintCostAud)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-rose-100/30 pt-2 text-stone-800 font-medium bg-rose-50/20 -mx-4 -mb-4 p-4 rounded-b-xl">
                <span>Total Paint Cost:</span>
                <span className="font-bold text-rose-950">
                  {formatCurrency(estimate.totalPaintCostAud)}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Labour */}
          <div className="rounded-xl border border-stone-100 bg-stone-50/30 p-4">
            <div className="flex items-center gap-2 mb-3 text-stone-800 font-semibold text-sm">
              <Clock size={16} className="text-rose-600" />
              <span>Labour Estimate</span>
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-stone-600">
              <div className="flex justify-between items-center">
                <span>Estimated Labour Hours:</span>
                <span className="font-medium text-stone-950">
                  Walls: {formatHours(estimate.totalWallLabourHours)} | Ceilings: {formatHours(estimate.totalCeilingLabourHours)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Hours:</span>
                <span className="font-semibold text-stone-950">
                  {formatHours(estimate.totalLabourHours)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-rose-100/30 pt-2 text-stone-800 font-medium bg-rose-50/20 -mx-4 -mb-4 p-4 rounded-b-xl">
                <span>Total Labour Cost:</span>
                <span className="font-bold text-rose-950">
                  {formatCurrency(estimate.totalLabourCostAud)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
