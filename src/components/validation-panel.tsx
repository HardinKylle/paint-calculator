import React from "react";
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { VALIDATION_EXAMPLES } from "@/lib/validation-examples";
import { calculateRoomEstimate } from "@/lib/calculator";
import { DEFAULT_ASSUMPTIONS } from "@/lib/defaults";
import { formatCurrency, formatArea, formatLitres, formatHours } from "@/lib/formatting";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MatchBadgeProps {
  expected: number;
  actual: number;
  formattedExpected: string;
  formattedActual: string;
  borderless?: boolean;
}

const checkMatch = (val1: number, val2: number) => {
  return Math.abs(val1 - val2) < 0.02;
};

const MatchBadge: React.FC<MatchBadgeProps> = ({
  expected,
  actual,
  formattedExpected,
  formattedActual,
  borderless = false,
}) => {
  const matches = checkMatch(expected, actual);
  return (
    <div className={cn("grid grid-cols-12 items-center py-1.5 text-[11px] gap-2", borderless ? "" : "border-b border-stone-100")}>
      <span className="col-span-5 text-stone-500">
        Expected: <strong className="text-stone-700">{formattedExpected}</strong>
      </span>
      <span className="col-span-5 text-stone-500">
        Calculated: <strong className="text-stone-700">{formattedActual}</strong>
      </span>
      <div className="col-span-2 flex justify-end">
        <span className={cn(
          "inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border",
          matches
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        )}>
          {matches ? "MATCH" : "DIFF"}
        </span>
      </div>
    </div>
  );
};

const getComparisonRows = (
  example: typeof VALIDATION_EXAMPLES[number],
  liveEst: ReturnType<typeof calculateRoomEstimate>
) => [
  {
    label: "Wall Area",
    expected: example.expected.wallAreaM2,
    actual: liveEst.wallAreaM2,
    formattedExpected: formatArea(example.expected.wallAreaM2),
    formattedActual: formatArea(liveEst.wallAreaM2),
  },
  {
    label: "Ceiling Area",
    expected: example.expected.ceilingAreaM2,
    actual: liveEst.ceilingAreaM2,
    formattedExpected: formatArea(example.expected.ceilingAreaM2),
    formattedActual: formatArea(liveEst.ceilingAreaM2),
  },
  {
    label: "Total Paintable Area (Coats x Area)",
    expected: example.expected.paintableAreaM2,
    actual: liveEst.paintableWallAreaM2 + liveEst.paintableCeilingAreaM2,
    formattedExpected: formatArea(example.expected.paintableAreaM2),
    formattedActual: formatArea(liveEst.paintableWallAreaM2 + liveEst.paintableCeilingAreaM2),
  },
  {
    label: "Purchased Paint Litres",
    expected: example.expected.totalPaintLitresPurchased,
    actual: liveEst.wallPaintLitresPurchased + liveEst.ceilingPaintLitresPurchased,
    formattedExpected: formatLitres(example.expected.totalPaintLitresPurchased),
    formattedActual: formatLitres(liveEst.wallPaintLitresPurchased + liveEst.ceilingPaintLitresPurchased),
  },
  {
    label: "Estimated Paint Cost",
    expected: example.expected.totalPaintCostAud,
    actual: liveEst.totalPaintCostAud,
    formattedExpected: formatCurrency(example.expected.totalPaintCostAud),
    formattedActual: formatCurrency(liveEst.totalPaintCostAud),
  },
  {
    label: "Labour Hours",
    expected: example.expected.totalLabourHours,
    actual: liveEst.totalLabourHours,
    formattedExpected: formatHours(example.expected.totalLabourHours),
    formattedActual: formatHours(liveEst.totalLabourHours),
  },
  {
    label: "Labour Cost",
    expected: example.expected.totalLabourCostAud,
    actual: liveEst.totalLabourCostAud,
    formattedExpected: formatCurrency(example.expected.totalLabourCostAud),
    formattedActual: formatCurrency(liveEst.totalLabourCostAud),
  },
];

export const ValidationPanel: React.FC = () => {
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

  const allMatch = checkAllCasesMatch();

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
        
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold",
          allMatch
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          {allMatch ? (
            <>
              <CheckCircle2 size={14} className="text-green-600" />
              Status: Verified (All Match)
            </>
          ) : (
            <>
              <AlertCircle size={14} className="text-red-600" />
              Status: Discrepancy Found
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VALIDATION_EXAMPLES.map((example) => {
          // Compute the live estimate for this validation room
          const liveEst = calculateRoomEstimate(example.input, DEFAULT_ASSUMPTIONS);
          
          return (
            <Card key={example.id} className="p-4 flex flex-col gap-3">
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
                {getComparisonRows(example, liveEst).map((row) => (
                  <div key={row.label}>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-2">
                      {row.label}
                    </span>
                    <MatchBadge
                      expected={row.expected}
                      actual={row.actual}
                      formattedExpected={row.formattedExpected}
                      formattedActual={row.formattedActual}
                    />
                  </div>
                ))}

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
            </Card>
          );
        })}
      </div>
    </div>
  );
};


