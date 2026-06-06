import React from "react";
import { Info, HelpCircle } from "lucide-react";

const EXCLUSIONS = [
  "Doors",
  "Windows",
  "Skirting boards",
  "Architraves",
  "Cornices",
  "Feature walls",
  "Exterior painting",
  "Surface preparation",
  "Repairs",
  "Priming",
  "Special finishes",
  "Furniture moving",
  "GST",
  "Travel",
  "Minimum call-out fees",
];

export const AssumptionsPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900 flex items-center gap-1.5">
          <Info size={18} className="text-rose-600" />
          Estimation Assumptions
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Standard parameter mappings used for automated estimations based on trade guidelines.
        </p>
      </div>

      {/* Grid of constants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Constant Parameters Table */}
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
          <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5">
            <span className="text-xs font-semibold text-stone-700">Standard Formula Constants</span>
          </div>
          <div className="p-3 text-xs divide-y divide-stone-100">
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Default Ceiling Height</span>
              <strong className="text-stone-800">2.4 m</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Paint Coverage Rate</span>
              <strong className="text-stone-800">14 m²/L per coat</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Labour Hourly Rate</span>
              <strong className="text-stone-800">$65.00 AUD/hour</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Wall Productivity</span>
              <strong className="text-stone-800">10 m²/hour</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Ceiling Productivity</span>
              <strong className="text-stone-800">7 m²/hour</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-stone-500">Paint Tins Available</span>
              <strong className="text-stone-800">15L, 10L, 4L, 2L, 1L</strong>
            </div>
          </div>
        </div>

        {/* Paint Quality Pricing */}
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
          <div className="bg-stone-50 border-b border-stone-200 px-4 py-2.5">
            <span className="text-xs font-semibold text-stone-700">Paint Quality Retail Rates</span>
          </div>
          <div className="p-3 text-xs divide-y divide-stone-100">
            <div className="flex justify-between py-2.5">
              <div>
                <strong className="text-stone-800 block">Budget Paint</strong>
                <span className="text-[10px] text-stone-400">Trade-grade builder bulk</span>
              </div>
              <strong className="text-rose-700 font-bold self-center">$18.00 / L</strong>
            </div>
            <div className="flex justify-between py-2.5">
              <div>
                <strong className="text-stone-800 block">Standard Paint</strong>
                <span className="text-[10px] text-stone-400">Standard retail wash-and-wear</span>
              </div>
              <strong className="text-rose-700 font-bold self-center">$28.00 / L</strong>
            </div>
            <div className="flex justify-between py-2.5">
              <div>
                <strong className="text-stone-800 block">Premium Paint</strong>
                <span className="text-[10px] text-stone-400">Low-VOC premium wash-and-wear</span>
              </div>
              <strong className="text-rose-700 font-bold self-center">$40.00 / L</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Scope Exclusions */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
        <h4 className="text-xs font-semibold text-stone-700 mb-2.5 flex items-center gap-1.5">
          <HelpCircle size={14} className="text-stone-400" />
          Project Exclusions (Out of Scope)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-[11px] text-stone-500 list-disc pl-1">
          {EXCLUSIONS.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

