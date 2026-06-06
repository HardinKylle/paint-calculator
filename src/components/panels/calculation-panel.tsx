import React from "react";
import { Calculator, Paintbrush, Clock, DollarSign, Layers } from "lucide-react";

export const CalculationPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900 flex items-center gap-1.5">
          <Calculator size={18} className="text-rose-600" />
          Sample Calculation Walkthrough
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          This shows exactly how the system calculates estimates using a standard room example.
        </p>
      </div>

      {/* Assumptions Context */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs">
        <h4 className="font-semibold text-stone-800 mb-2">Example Parameters:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-600">
          <div>
            <span className="block text-[10px] uppercase font-bold text-stone-400">Room Size</span>
            <span className="font-semibold text-stone-700">5.0m × 4.0m</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-stone-400">Ceiling Height</span>
            <span className="font-semibold text-stone-700">2.4m</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-stone-400">Coats / Quality</span>
            <span className="font-semibold text-stone-700">2 Coats / Premium</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-stone-400">Rates Used</span>
            <span className="font-semibold text-stone-700">14m²/L, $65/hr</span>
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-sm">
            1
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <h5 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Layers size={13} className="text-stone-400" />
                Gross Areas & Paintable Surfaces
              </h5>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Find the total surface area to paint, then multiply by the number of coats.
            </p>
            
            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/30 border border-rose-100 rounded px-2.5 py-1.5 text-rose-800 space-y-0.5">
              <div><strong className="font-semibold">Wall Area Formula:</strong> 2 × (Length + Width) × Height</div>
              <div><strong className="font-semibold">Ceiling Area Formula:</strong> Length × Width</div>
              <div><strong className="font-semibold">Paintable Area Formula:</strong> Gross Area × Coats</div>
            </div>

            <div className="mt-2.5 p-2 bg-stone-50/50 rounded-lg border border-stone-100 text-[11px] font-mono text-stone-600 space-y-1.5">
              <div>
                <span className="text-stone-400 font-sans">Wall Gross Area:</span> 2 × (5.0m + 4.0m) × 2.4m = <strong className="text-stone-850">43.2 m²</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Ceiling Gross Area:</span> 5.0m × 4.0m = <strong className="text-stone-850">20.0 m²</strong>
              </div>
              <div className="border-t border-stone-200/60 pt-1.5">
                <span className="text-stone-400 font-sans">Paintable Wall Surface (2 coats):</span> 43.2 m² × 2 = <strong className="text-rose-700">86.4 m²</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Paintable Ceiling Surface (2 coats):</span> 20.0 m² × 2 = <strong className="text-rose-700">40.0 m²</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-sm">
            2
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Paintbrush size={13} className="text-stone-400" />
              Raw Paint Volume Required
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Divide total paintable surface area by the standard trade coverage rate of <span className="font-semibold text-stone-700">14 m²/L</span> per coat.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/30 border border-rose-100 rounded px-2.5 py-1.5 text-rose-800">
              <strong className="font-semibold">Raw Paint Formula:</strong> Paintable Area / Coverage Rate
            </div>

            <div className="mt-2.5 p-2 bg-stone-50/50 rounded-lg border border-stone-100 text-[11px] font-mono text-stone-600 space-y-1.5">
              <div>
                <span className="text-stone-400 font-sans">Raw Wall Paint:</span> 86.4 m² / 14 m²/L = <strong className="text-stone-850">6.17 Litres</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Raw Ceiling Paint:</span> 40.0 m² / 14 m²/L = <strong className="text-stone-850">2.86 Litres</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-sm">
            3
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Calculator size={13} className="text-stone-400" />
              Tin Size Recommendation & Touch-up Reserve
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              To minimize waste and avoid extra costs, the algorithm chooses from standard sizes (<span className="font-semibold text-stone-700">15L, 10L, 4L, 2L, 1L</span>) to buy exactly what is needed.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/30 border border-rose-100 rounded px-2.5 py-1.5 text-rose-800 space-y-0.5">
              <div><strong className="font-semibold">Optimization Rule:</strong> Minimize total purchased volume while keeping purchased volume ≥ raw volume.</div>
              <div><strong className="font-semibold">Touch-up Reserve (Surplus) Formula:</strong> Purchased Litres - Raw Litres</div>
            </div>

            <div className="mt-2.5 p-2 bg-stone-50/50 rounded-lg border border-stone-100 text-[11px] font-mono text-stone-600 space-y-2">
              <div>
                <span className="text-stone-400 font-sans block">Walls (Needs 6.17 L):</span>
                <span>Optimized combination: <strong className="text-stone-850">1×4L + 1×2L + 1×1L = 7 Litres</strong></span>
                <span className="block text-[10px] text-stone-400 font-sans">Leftover touch-up reserve: 7.00L - 6.17L = 0.83 Litres</span>
              </div>
              <div className="border-t border-stone-200/60 pt-2">
                <span className="text-stone-400 font-sans block">Ceiling (Needs 2.86 L):</span>
                <span>Optimized combination: <strong className="text-stone-850">1×2L + 1×1L = 3 Litres</strong></span>
                <span className="block text-[10px] text-stone-400 font-sans">Leftover touch-up reserve: 3.00L - 2.86L = 0.14 Litres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-sm">
            4
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Clock size={13} className="text-stone-400" />
              Painter Labour Hours & Labour Cost
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Calculate labor based on active painted surfaces: wall productivity is <span className="font-semibold text-stone-700">10 m²/hr</span>, ceiling is <span className="font-semibold text-stone-700">7 m²/hr</span>. Painters charge <span className="font-semibold text-stone-700">$65.00/hr</span>.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/30 border border-rose-100 rounded px-2.5 py-1.5 text-rose-800 space-y-0.5">
              <div><strong className="font-semibold">Labour Hours Formula:</strong> Paintable Area / Productivity Rate</div>
              <div><strong className="font-semibold">Labour Cost Formula:</strong> Total Labour Hours × Painter Hourly Rate</div>
            </div>

            <div className="mt-2.5 p-2 bg-stone-50/50 rounded-lg border border-stone-100 text-[11px] font-mono text-stone-600 space-y-1.5">
              <div>
                <span className="text-stone-400 font-sans">Wall Labour Hours:</span> 86.4 m² / 10 m²/hr = <strong className="text-stone-850">8.64 hours</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Ceiling Labour Hours:</span> 40.0 m² / 7 m²/hr = <strong className="text-stone-850">5.71 hours</strong>
              </div>
              <div className="border-t border-stone-200/60 pt-1.5">
                <span className="text-stone-400 font-sans">Total Painter Time:</span> 8.64 hr + 5.71 hr = <strong className="text-stone-850">14.35 hours</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Labour Cost:</span> 14.35 hours × $65.00/hr = <strong className="text-rose-700">$933.00 AUD</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 font-bold text-sm">
            5
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <DollarSign size={13} className="text-stone-400" />
              Paint Cost & Total Room Estimate
            </h5>
            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
              Calculate paint cost based on total purchased tins of Premium quality (<span className="font-semibold text-stone-700">$40.00/L</span>), then add the labour cost.
            </p>

            {/* Formulas Box */}
            <div className="mt-2 text-[10px] bg-rose-50/30 border border-rose-100 rounded px-2.5 py-1.5 text-rose-800 space-y-0.5">
              <div><strong className="font-semibold">Paint Cost Formula:</strong> Purchased Litres × Paint Cost per Litre</div>
              <div><strong className="font-semibold">Total Cost Formula:</strong> Paint Cost + Labour Cost</div>
            </div>

            <div className="mt-2.5 p-2 bg-stone-50/50 rounded-lg border border-stone-100 text-[11px] font-mono text-stone-600 space-y-1.5">
              <div>
                <span className="text-stone-400 font-sans">Wall Paint Cost:</span> 7.00 Litres × $40.00/L = <strong className="text-stone-850">$280.00 AUD</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans">Ceiling Paint Cost:</span> 3.00 Litres × $40.00/L = <strong className="text-stone-850">$120.00 AUD</strong>
              </div>
              <div className="border-t border-stone-200/60 pt-1.5">
                <span className="text-stone-400 font-sans">Total Paint Cost:</span> $280.00 + $120.00 = <strong className="text-stone-850">$400.00 AUD</strong>
              </div>
              <div>
                <span className="text-stone-400 font-sans font-bold">Total Estimate:</span> $400.00 + $933.00 = <strong className="text-rose-700 font-bold">$1,333.00 AUD</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
