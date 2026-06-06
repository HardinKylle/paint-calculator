import React, { useState } from "react";
import { Calculator, Paintbrush, Clock, DollarSign, Layers } from "lucide-react";
import type { RoomInput, RoomEstimate } from "@/types/estimate";
import {
  formatCurrency,
  formatTinRecommendation,
} from "@/lib/formatting";
import { calculateRoomEstimate } from "@/lib/calculator";
import { DEFAULT_ASSUMPTIONS } from "@/lib/defaults";

interface CalculationPanelProps {
  rooms: RoomInput[];
  estimates: RoomEstimate[];
}

const SAMPLE_ROOM_INPUT: RoomInput = {
  id: "sample-room",
  name: "Sample Room",
  length: 5.0,
  width: 4.0,
  ceilingHeight: 2.4,
  paintWalls: true,
  paintCeilings: true,
  coats: 2,
  paintQuality: "premium",
};

const SAMPLE_ESTIMATE = calculateRoomEstimate(SAMPLE_ROOM_INPUT, DEFAULT_ASSUMPTIONS);

export const CalculationPanel: React.FC<CalculationPanelProps> = ({ rooms = [], estimates = [] }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  // Determine active room input and estimate
  let activeRoom = rooms.find((r) => r.id === selectedRoomId);
  let activeEstimate = estimates.find((e) => e.roomId === selectedRoomId);

  // If no room is selected or active, fall back to first room or sample
  if (!activeRoom || !activeEstimate) {
    if (rooms.length > 0 && estimates.length > 0) {
      activeRoom = rooms[0];
      activeEstimate = estimates[0];
    } else {
      activeRoom = SAMPLE_ROOM_INPUT;
      activeEstimate = SAMPLE_ESTIMATE;
    }
  }

  const length = activeRoom.length;
  const width = activeRoom.width;
  const height = activeRoom.ceilingHeight;
  const coats = activeRoom.coats;
  const quality = activeRoom.paintQuality;

  // Derive intermediate calculation variables directly from activeEstimate props (DRY)
  const wallGrossArea = activeEstimate.wallAreaM2;
  const ceilingGrossArea = activeEstimate.ceilingAreaM2;

  const paintableWallArea = activeEstimate.paintableWallAreaM2;
  const paintableCeilingArea = activeEstimate.paintableCeilingAreaM2;

  const wallPaintLitresRaw = activeEstimate.wallPaintLitresRaw;
  const ceilingPaintLitresRaw = activeEstimate.ceilingPaintLitresRaw;

  const wallPaintLitresPurchased = activeEstimate.wallPaintLitresPurchased;
  const ceilingPaintLitresPurchased = activeEstimate.ceilingPaintLitresPurchased;

  const wallLabourHours = activeEstimate.wallLabourHours;
  const ceilingLabourHours = activeEstimate.ceilingLabourHours;
  const totalLabourHours = activeEstimate.totalLabourHours;
  const totalLabourCost = activeEstimate.totalLabourCostAud;

  const pricePerLitre = DEFAULT_ASSUMPTIONS.paintPricesAudPerLitre[quality];
  const wallPaintCost = activeEstimate.wallPaintCostAud;
  const ceilingPaintCost = activeEstimate.ceilingPaintCostAud;
  const totalPaintCost = activeEstimate.totalPaintCostAud;
  const totalCost = activeEstimate.totalCostAud;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-1.5">
            <Calculator size={18} className="text-stone-700" />
            Room Calculation Walkthrough
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            This shows exactly how the system calculates estimates using your selected room dimensions.
          </p>
        </div>

        {rooms.length > 0 && (
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs">
            <label htmlFor="walkthrough-room-select" className="font-semibold text-stone-600">
              Walkthrough:
            </label>
            <select
              id="walkthrough-room-select"
              value={activeRoom.id}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="rounded-lg border border-stone-200 bg-white py-0.5 px-2.5 text-stone-800 font-semibold cursor-pointer focus:border-stone-900 focus:outline-hidden transition-all duration-200"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || "Unnamed Room"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Assumptions Context */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs">
        <h4 className="font-semibold text-stone-800 mb-2.5">Walkthrough Input Parameters ({activeRoom.name || (activeRoom.id === "sample-room" ? "Sample Room" : "Unnamed Room")}):</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-600">
          <div>
            <span className="block text-[9px] uppercase font-bold text-stone-400">Dimensions</span>
            <span className="font-semibold text-stone-800 block mt-0.5">{length.toFixed(1)}m × {width.toFixed(1)}m</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-stone-400">Ceiling Height</span>
            <span className="font-semibold text-stone-800 block mt-0.5">{height.toFixed(1)}m</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-stone-400">Coats / Quality</span>
            <span className="font-semibold text-stone-800 block mt-0.5">{coats} Coats / {quality.charAt(0).toUpperCase() + quality.slice(1)}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-stone-400">Paint Coverage Rate</span>
            <span className="font-semibold text-stone-800 block mt-0.5">{DEFAULT_ASSUMPTIONS.coverageRateM2PerLitre} m²/L</span>
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 font-bold text-sm">
            1
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Layers size={13} className="text-stone-400" />
              Gross Areas & Paintable Surfaces
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Find the total surface area to paint, then multiply by the number of coats.
            </p>
            
            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/40 border border-rose-100/60 rounded px-2.5 py-1.5 text-rose-900 space-y-0.5 font-medium">
              <div><strong className="font-semibold text-rose-950">Wall Area Formula:</strong> 2 × (Length + Width) × Height</div>
              <div><strong className="font-semibold text-rose-950">Ceiling Area Formula:</strong> Length × Width</div>
              <div><strong className="font-semibold text-rose-950">Paintable Area Formula:</strong> Gross Area × Coats</div>
            </div>

            <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono text-stone-750 space-y-2 shadow-2xs">
              <div>
                <span className="text-stone-450 font-sans">Wall Gross Area:</span> 2 × ({length.toFixed(1)}m + {width.toFixed(1)}m) × {height.toFixed(1)}m = <strong className="text-stone-900">{wallGrossArea.toFixed(2)} m²</strong>
              </div>
              <div>
                <span className="text-stone-450 font-sans">Ceiling Gross Area:</span> {length.toFixed(1)}m × {width.toFixed(1)}m = <strong className="text-stone-900">{ceilingGrossArea.toFixed(2)} m²</strong>
              </div>
              <div className="border-t border-stone-200/80 pt-2">
                <span className="text-stone-450 font-sans">Paintable Wall Surface ({coats} coats):</span>{" "}
                {activeRoom.paintWalls ? (
                  <>
                    {wallGrossArea.toFixed(2)} m² × {coats} = <strong className="text-stone-900">{paintableWallArea.toFixed(2)} m²</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 m²)</span>
                )}
              </div>
              <div>
                <span className="text-stone-450 font-sans">Paintable Ceiling Surface ({coats} coats):</span>{" "}
                {activeRoom.paintCeilings ? (
                  <>
                    {ceilingGrossArea.toFixed(2)} m² × {coats} = <strong className="text-stone-900">{paintableCeilingArea.toFixed(2)} m²</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 m²)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 font-bold text-sm">
            2
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Paintbrush size={13} className="text-stone-400" />
              Raw Paint Volume Required
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Divide total paintable surface area by the standard trade coverage rate of <span className="font-semibold text-stone-700">{DEFAULT_ASSUMPTIONS.coverageRateM2PerLitre} m²/L</span>.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/40 border border-rose-100/60 rounded px-2.5 py-1.5 text-rose-900 font-medium">
              <strong className="font-semibold text-rose-950">Raw Paint Formula:</strong> Paintable Area / Coverage Rate
            </div>

            <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono text-stone-755 space-y-2 shadow-2xs">
              <div>
                <span className="text-stone-450 font-sans">Raw Wall Paint:</span>{" "}
                {activeRoom.paintWalls ? (
                  <>
                    {paintableWallArea.toFixed(2)} m² / {DEFAULT_ASSUMPTIONS.coverageRateM2PerLitre} m²/L = <strong className="text-stone-900">{wallPaintLitresRaw.toFixed(2)} Litres</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 Litres)</span>
                )}
              </div>
              <div>
                <span className="text-stone-450 font-sans">Raw Ceiling Paint:</span>{" "}
                {activeRoom.paintCeilings ? (
                  <>
                    {paintableCeilingArea.toFixed(2)} m² / {DEFAULT_ASSUMPTIONS.coverageRateM2PerLitre} m²/L = <strong className="text-stone-900">{ceilingPaintLitresRaw.toFixed(2)} Litres</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 Litres)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 font-bold text-sm">
            3
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Calculator size={13} className="text-stone-400" />
              Tin Size Recommendation & Touch-up Reserve
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              To minimize waste and avoid extra costs, the algorithm chooses from standard sizes (<span className="font-semibold text-stone-750">15L, 10L, 4L, 2L, 1L</span>) to buy exactly what is needed.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/40 border border-rose-100/60 rounded px-2.5 py-1.5 text-rose-900 space-y-0.5 font-medium">
              <div><strong className="font-semibold text-rose-950">Optimization Rule:</strong> Minimize total purchased volume while keeping purchased volume ≥ raw volume.</div>
              <div><strong className="font-semibold text-rose-950">Touch-up Reserve (Surplus) Formula:</strong> Purchased Litres - Raw Litres</div>
            </div>

            <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono text-stone-755 space-y-2.5 shadow-2xs">
              <div>
                <span className="text-stone-450 font-sans block">Walls (Needs {wallPaintLitresRaw.toFixed(2)} L):</span>
                {activeRoom.paintWalls ? (
                  <>
                    <span>Optimized combination: <strong className="text-stone-900">{formatTinRecommendation(activeEstimate.wallTins)} = {wallPaintLitresPurchased} Litres</strong></span>
                    <span className="block text-[10px] text-stone-400 font-sans mt-0.5">Leftover touch-up reserve: {wallPaintLitresPurchased}L - {wallPaintLitresRaw.toFixed(2)}L = {(wallPaintLitresPurchased - wallPaintLitresRaw).toFixed(2)} Litres</span>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (No paint required)</span>
                )}
              </div>
              <div className="border-t border-stone-200/80 pt-2.5">
                <span className="text-stone-450 font-sans block">Ceiling (Needs {ceilingPaintLitresRaw.toFixed(2)} L):</span>
                {activeRoom.paintCeilings ? (
                  <>
                    <span>Optimized combination: <strong className="text-stone-900">{formatTinRecommendation(activeEstimate.ceilingTins)} = {ceilingPaintLitresPurchased} Litres</strong></span>
                    <span className="block text-[10px] text-stone-400 font-sans mt-0.5">Leftover touch-up reserve: {ceilingPaintLitresPurchased}L - {ceilingPaintLitresRaw.toFixed(2)}L = {(ceilingPaintLitresPurchased - ceilingPaintLitresRaw).toFixed(2)} Litres</span>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (No paint required)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 font-bold text-sm">
            4
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Clock size={13} className="text-stone-400" />
              Painter Labour Hours & Labour Cost
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Calculate labor based on active painted surfaces: wall productivity is <span className="font-semibold text-stone-700">{DEFAULT_ASSUMPTIONS.wallLabourProductivityM2PerHour} m²/hr</span>, ceiling is <span className="font-semibold text-stone-700">{DEFAULT_ASSUMPTIONS.ceilingLabourProductivityM2PerHour} m²/hr</span>. Painters charge <span className="font-semibold text-stone-700">${DEFAULT_ASSUMPTIONS.labourHourlyRateAud.toFixed(2)}/hr</span>.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/40 border border-rose-100/60 rounded px-2.5 py-1.5 text-rose-900 space-y-0.5 font-medium">
              <div><strong className="font-semibold text-rose-950">Labour Hours Formula:</strong> Paintable Area / Productivity Rate</div>
              <div><strong className="font-semibold text-rose-950">Labour Cost Formula:</strong> Total Labour Hours × Painter Hourly Rate</div>
            </div>

            <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono text-stone-755 space-y-2 shadow-2xs">
              <div>
                <span className="text-stone-450 font-sans">Wall Labour Hours:</span>{" "}
                {activeRoom.paintWalls ? (
                  <>
                    {paintableWallArea.toFixed(2)} m² / {DEFAULT_ASSUMPTIONS.wallLabourProductivityM2PerHour} m²/hr = <strong className="text-stone-900">{wallLabourHours.toFixed(2)} hours</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 hours)</span>
                )}
              </div>
              <div>
                <span className="text-stone-450 font-sans">Ceiling Labour Hours:</span>{" "}
                {activeRoom.paintCeilings ? (
                  <>
                    {paintableCeilingArea.toFixed(2)} m² / {DEFAULT_ASSUMPTIONS.ceilingLabourProductivityM2PerHour} m²/hr = <strong className="text-stone-900">{ceilingLabourHours.toFixed(2)} hours</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded (0.00 hours)</span>
                )}
              </div>
              <div className="border-t border-stone-200/80 pt-2">
                <span className="text-stone-450 font-sans">Total Painter Time:</span> {wallLabourHours.toFixed(2)} hr + {ceilingLabourHours.toFixed(2)} hr = <strong className="text-stone-900">{totalLabourHours.toFixed(2)} hours</strong>
              </div>
              <div>
                <span className="text-stone-450 font-sans">Labour Cost:</span> {totalLabourHours.toFixed(2)} hours × ${DEFAULT_ASSUMPTIONS.labourHourlyRateAud}/hr = <strong className="text-stone-900">{formatCurrency(totalLabourCost)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 font-bold text-sm">
            5
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <DollarSign size={13} className="text-stone-400" />
              Paint Cost & Total Room Estimate
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Calculate paint cost based on total purchased tins of {quality.charAt(0).toUpperCase() + quality.slice(1)} quality (<span className="font-semibold text-stone-700">${pricePerLitre.toFixed(2)}/L</span>), then add the labour cost.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/40 border border-rose-100/60 rounded px-2.5 py-1.5 text-rose-900 space-y-0.5 font-medium">
              <div><strong className="font-semibold text-rose-950">Paint Cost Formula:</strong> Purchased Litres × Paint Cost per Litre</div>
              <div><strong className="font-semibold text-rose-950">Total Cost Formula:</strong> Paint Cost + Labour Cost</div>
            </div>

            <div className="mt-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono text-stone-755 space-y-2 shadow-2xs">
              <div>
                <span className="text-stone-450 font-sans">Wall Paint Cost:</span>{" "}
                {activeRoom.paintWalls ? (
                  <>
                    {wallPaintLitresPurchased} Litres × ${pricePerLitre.toFixed(2)}/L = <strong className="text-stone-900">{formatCurrency(wallPaintCost)}</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded ({formatCurrency(0)})</span>
                )}
              </div>
              <div>
                <span className="text-stone-450 font-sans">Ceiling Paint Cost:</span>{" "}
                {activeRoom.paintCeilings ? (
                  <>
                    {ceilingPaintLitresPurchased} Litres × ${pricePerLitre.toFixed(2)}/L = <strong className="text-stone-900">{formatCurrency(ceilingPaintCost)}</strong>
                  </>
                ) : (
                  <span className="text-stone-400 italic">Excluded ({formatCurrency(0)})</span>
                )}
              </div>
              <div className="border-t border-stone-200/80 pt-2">
                <span className="text-stone-450 font-sans">Total Paint Cost:</span> {formatCurrency(wallPaintCost)} + {formatCurrency(ceilingPaintCost)} = <strong className="text-stone-900">{formatCurrency(totalPaintCost)}</strong>
              </div>
              <div>
                <span className="text-stone-450 font-sans font-bold">Total Estimate:</span> {formatCurrency(totalPaintCost)} + {formatCurrency(totalLabourCost)} = <strong className="text-stone-900 font-bold">{formatCurrency(totalCost)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
