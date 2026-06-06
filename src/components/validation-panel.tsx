import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { VALIDATION_EXAMPLES } from "../lib/validation-examples";
import { calculateRoomEstimate } from "../lib/calculator";
import { DEFAULT_ASSUMPTIONS } from "../lib/defaults";
import { formatCurrency, formatArea, formatLitres, formatHours } from "../lib/formatting";

export const ValidationPanel: React.FC = () => {
  const checkMatch = (val1: number, val2: number) => {
    return Math.abs(val1 - val2) < 0.02;
  };

  const checkAllCasesMatch = () => {
    return VALIDATION_EXAMPLES.every((example) => {
      const liveEst = calculateRoomEstimate(example.input, DEFAULT_ASSUMPTIONS);
      return (
        checkMatch(example.expected.wallAreaM2, liveEst.wallAreaM2) &&
        checkMatch(example.expected.ceilingAreaM2, liveEst.ceilingAreaM2) &&
        checkMatch(example.expected.paintableAreaM2, liveEst.paintableWallAreaM2 + liveEst.paintableCeilingAreaM2) &&
        checkMatch(example.expected.totalPaintLitresPurchased, liveEst.wallPaintLitresPurchased + liveEst.ceilingPaintLitresPurchased) &&
        checkMatch(example.expected.totalPaintCostAud, liveEst.totalPaintCostAud) &&
        checkMatch(example.expected.totalLabourHours, liveEst.totalLabourHours) &&
        checkMatch(example.expected.totalLabourCostAud, liveEst.totalLabourCostAud) &&
        checkMatch(example.expected.totalProjectCostAud, liveEst.totalCostAud)
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck size={18} className="text-green-600" />
            Calculation Engine Validation
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare manual mathematical estimates against live calculations to ensure engine accuracy.
          </p>
        </div>
        
        {checkAllCasesMatch() ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
            <CheckCircle2 size={14} className="text-green-600" />
            Status: Verified (All Match)
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            <AlertCircle size={14} className="text-red-600" />
            Status: Discrepancy Found
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VALIDATION_EXAMPLES.map((example) => {
          // Compute the live estimate for this validation room
          const liveEst = calculateRoomEstimate(example.input, DEFAULT_ASSUMPTIONS);
          
          // Helper to check match and return appropriate badge
          const MatchBadge = ({
            expected,
            actual,
            formattedExpected,
            formattedActual,
            borderless = false,
          }: {
            expected: number;
            actual: number;
            formattedExpected: string;
            formattedActual: string;
            borderless?: boolean;
          }) => {
            const matches = checkMatch(expected, actual);
            return (
              <div className={`grid grid-cols-12 items-center py-1.5 text-[11px] gap-2 ${borderless ? "" : "border-b border-stone-100"}`}>
                <span className="col-span-5 text-stone-500">
                  Expected: <strong className="text-stone-700">{formattedExpected}</strong>
                </span>
                <span className="col-span-5 text-stone-500">
                  Calculated: <strong className="text-stone-700">{formattedActual}</strong>
                </span>
                <div className="col-span-2 flex justify-end">
                  {matches ? (
                    <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                      MATCH
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      DIFF
                    </span>
                  )}
                </div>
              </div>
            );
          };

          return (
            <div key={example.id} className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs flex flex-col gap-3">
              <div>
                <h4 className="text-xs font-bold text-stone-900">{example.name}</h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-normal">
                  {example.description}
                </p>
              </div>

              {/* Specs Badge */}
              <div className="flex flex-wrap gap-2 text-[10px] bg-stone-50 border border-stone-100 p-2 rounded-lg font-medium text-stone-600">
                <span>L: {example.input.length}m</span>
                <span className="text-stone-300">|</span>
                <span>W: {example.input.width}m</span>
                <span className="text-stone-300">|</span>
                <span>H: {example.input.ceilingHeight}m</span>
                <span className="text-stone-300">|</span>
                <span>Quality: {example.input.paintQuality}</span>
                <span className="text-stone-300">|</span>
                <span>Coats: {example.input.coats}</span>
              </div>

              {/* Side by side stats */}
              <div className="flex flex-col text-xs mt-1">
                {/* Wall Area */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Wall Area</span>
                  <MatchBadge 
                    expected={example.expected.wallAreaM2} 
                    actual={liveEst.wallAreaM2} 
                    formattedExpected={formatArea(example.expected.wallAreaM2)}
                    formattedActual={formatArea(liveEst.wallAreaM2)} 
                  />
                </div>

                {/* Ceiling Area */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Ceiling Area</span>
                  <MatchBadge 
                    expected={example.expected.ceilingAreaM2} 
                    actual={liveEst.ceilingAreaM2} 
                    formattedExpected={formatArea(example.expected.ceilingAreaM2)}
                    formattedActual={formatArea(liveEst.ceilingAreaM2)} 
                  />
                </div>

                {/* Total Paintable Area */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Total Paintable Area (Coats x Area)</span>
                  <MatchBadge 
                    expected={example.expected.paintableAreaM2} 
                    actual={liveEst.paintableWallAreaM2 + liveEst.paintableCeilingAreaM2} 
                    formattedExpected={formatArea(example.expected.paintableAreaM2)}
                    formattedActual={formatArea(liveEst.paintableWallAreaM2 + liveEst.paintableCeilingAreaM2)} 
                  />
                </div>

                {/* Paint Purchased Litres */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Purchased Paint Litres</span>
                  <MatchBadge 
                    expected={example.expected.totalPaintLitresPurchased} 
                    actual={liveEst.wallPaintLitresPurchased + liveEst.ceilingPaintLitresPurchased} 
                    formattedExpected={formatLitres(example.expected.totalPaintLitresPurchased)}
                    formattedActual={formatLitres(liveEst.wallPaintLitresPurchased + liveEst.ceilingPaintLitresPurchased)} 
                  />
                </div>

                {/* Paint Cost */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Estimated Paint Cost</span>
                  <MatchBadge 
                    expected={example.expected.totalPaintCostAud} 
                    actual={liveEst.totalPaintCostAud} 
                    formattedExpected={formatCurrency(example.expected.totalPaintCostAud)}
                    formattedActual={formatCurrency(liveEst.totalPaintCostAud)} 
                  />
                </div>

                {/* Labour Hours */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Labour Hours</span>
                  <MatchBadge 
                    expected={example.expected.totalLabourHours} 
                    actual={liveEst.totalLabourHours} 
                    formattedExpected={formatHours(example.expected.totalLabourHours)}
                    formattedActual={formatHours(liveEst.totalLabourHours)} 
                  />
                </div>

                {/* Labour Cost */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-1">Labour Cost</span>
                  <MatchBadge 
                    expected={example.expected.totalLabourCostAud} 
                    actual={liveEst.totalLabourCostAud} 
                    formattedExpected={formatCurrency(example.expected.totalLabourCostAud)}
                    formattedActual={formatCurrency(liveEst.totalLabourCostAud)} 
                  />
                </div>

                {/* Total Cost */}
                <div className="mt-4 bg-stone-50/50 border-t border-stone-100 p-4 -mx-4 -mb-4 rounded-b-xl">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">Total Estimate</span>
                  <MatchBadge 
                    expected={example.expected.totalProjectCostAud} 
                    actual={liveEst.totalCostAud} 
                    formattedExpected={formatCurrency(example.expected.totalProjectCostAud)}
                    formattedActual={formatCurrency(liveEst.totalCostAud)} 
                    borderless={true}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
