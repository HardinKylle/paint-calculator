import React from "react";
import { Paintbrush, Clock, HelpCircle } from "lucide-react";
import type { ProjectEstimate } from "@/types/estimate";
import { Card, Button } from "@/components/ui";
import {
  formatCurrency,
  formatArea,
  formatLitres,
  formatHours,
  formatTinRecommendation,
} from "@/lib/formatting";

interface EstimatePanelProps {
  estimate: ProjectEstimate;
  compact?: boolean;
}

export const EstimatePanel: React.FC<EstimatePanelProps> = ({ estimate, compact = false }) => {
  const paintCost = estimate.totalPaintCostAud;
  const labourCost = estimate.totalLabourCostAud;
  const totalCost = estimate.totalProjectCostAud;
  const paintPercent = totalCost > 0 ? (paintCost / totalCost) * 100 : 0;
  const labourPercent = totalCost > 0 ? (labourCost / totalCost) * 100 : 0;

  const wallArea = estimate.totalWallAreaM2;
  const ceilingArea = estimate.totalCeilingAreaM2;
  const totalArea = wallArea + ceilingArea;
  const wallPercent = totalArea > 0 ? (wallArea / totalArea) * 100 : 0;
  const ceilingPercent = totalArea > 0 ? (ceilingArea / totalArea) * 100 : 0;
  if (compact) {
    return (
      <Card className="p-4 border-stone-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Total Project Cost
            </span>
            <span className="text-2xl font-black text-stone-900">
              {formatCurrency(estimate.totalProjectCostAud)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-stone-500 justify-center sm:justify-start">
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="block text-[9px] uppercase font-bold tracking-wide text-stone-400">Area</span>
              <strong className="text-stone-900">{formatArea(estimate.totalPaintableAreaM2)}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="block text-[9px] uppercase font-bold tracking-wide text-stone-400">Paint</span>
              <strong className="text-stone-900">
                {formatLitres(estimate.totalWallPaintLitresPurchased + estimate.totalCeilingPaintLitresPurchased)}
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200/60">
              <span className="block text-[9px] uppercase font-bold tracking-wide text-stone-400">Labour</span>
              <strong className="text-stone-900">{formatHours(estimate.totalLabourHours)}</strong>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-stone-900 p-6 text-white text-center relative overflow-hidden rounded-t-xl">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Total Project Estimate
        </p>
        <h3 className="text-4xl font-extrabold mt-1.5 text-white">
          {formatCurrency(estimate.totalProjectCostAud)}
        </h3>
        <p className="text-[11px] text-stone-400 mt-1 font-medium">
          Includes bulk-optimized paint & labour (Excl. GST)
        </p>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-200/60">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-500 mb-0.5">
              Wall Area
            </span>
            <span className="text-sm font-bold text-stone-900">
              {formatArea(estimate.totalWallAreaM2)}
            </span>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-200/60">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-500 mb-0.5">
              Ceiling Area
            </span>
            <span className="text-sm font-bold text-stone-900">
              {formatArea(estimate.totalCeilingAreaM2)}
            </span>
          </div>
          <div className="rounded-lg bg-stone-50 p-3 text-center border border-stone-200/60">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-stone-500 mb-0.5">
              Paintable Area
            </span>
            <span className="text-sm font-bold text-stone-900" title="Includes coat multipliers">
              {formatArea(estimate.totalPaintableAreaM2)}
            </span>
          </div>
        </div>

        <div className="bg-stone-50/50 border border-stone-200/60 rounded-xl p-4 flex flex-col gap-4 shadow-2xs">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-bold text-stone-700">
              <span>Cost Allocation</span>
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Paint vs. Labour</span>
            </div>
            <div className="w-full h-2 bg-stone-105 rounded-full overflow-hidden flex">
              {paintPercent > 0 && (
                <div 
                  style={{ width: `${paintPercent}%` }} 
                  className="h-full bg-stone-400 transition-all duration-350" 
                  title={`Paint Materials: ${paintPercent.toFixed(0)}%`}
                />
              )}
              {labourPercent > 0 && (
                <div 
                  style={{ width: `${labourPercent}%` }} 
                  className="h-full bg-stone-700 transition-all duration-355" 
                  title={`Labour: ${labourPercent.toFixed(0)}%`}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 font-medium px-0.5">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                Paint: {paintPercent.toFixed(0)}% ({formatCurrency(paintCost)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-700" />
                Labour: {labourPercent.toFixed(0)}% ({formatCurrency(labourCost)})
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-stone-200/60 pt-4">
            <div className="flex justify-between items-center text-[11px] font-bold text-stone-700">
              <span>Surface Allocation</span>
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Walls vs. Ceilings</span>
            </div>
            <div className="w-full h-2 bg-stone-105 rounded-full overflow-hidden flex">
              {wallPercent > 0 && (
                <div 
                  style={{ width: `${wallPercent}%` }} 
                  className="h-full bg-stone-500 transition-all duration-350" 
                  title={`Walls: ${wallPercent.toFixed(0)}%`}
                />
              )}
              {ceilingPercent > 0 && (
                <div 
                  style={{ width: `${ceilingPercent}%` }} 
                  className="h-full bg-stone-300 transition-all duration-355" 
                  title={`Ceilings: ${ceilingPercent.toFixed(0)}%`}
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 font-medium px-0.5">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />
                Walls: {wallPercent.toFixed(0)}% ({formatArea(wallArea)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                Ceilings: {ceilingPercent.toFixed(0)}% ({formatArea(ceilingArea)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="border-stone-100 bg-stone-50/30 p-4">
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
          </Card>

          <Card className="border-stone-100 bg-stone-50/30 p-4">
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
          </Card>
        </div>

        {/* Minimalist export action */}
        <div className="border-t border-stone-200/80 pt-4 mt-2">
          <Button
            onClick={() => window.print()}
            variant="secondary"
            className="w-full py-2 bg-stone-50 border border-stone-250 text-stone-800 hover:bg-stone-100 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            Print Estimate
          </Button>
        </div>
      </div>
    </Card>
  );
};
