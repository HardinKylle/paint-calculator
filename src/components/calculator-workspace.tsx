"use client";
import React, { useState } from "react";
import { Info, Grid, ShieldCheck, BookOpen } from "lucide-react";
import type { RoomInput } from "@/types/estimate";
import { DEFAULT_ROOMS, DEFAULT_ASSUMPTIONS } from "@/lib/defaults";
import { calculateProjectEstimate } from "@/lib/calculator";
import { PrintEstimate } from "@/components/print-estimate";
import { RoomEditor } from "@/components/room-editor";
import { PigmentaLogo } from "@/components/pigmenta-logo";
import {
  EstimatePanel,
  FloorPlanPanel,
  AssumptionsPanel,
  ValidationPanel,
  CalculationPanel,
} from "@/components/panels";
import { CollapsiblePanel } from "@/components/ui";
import { cn } from "@/lib/utils";

export const CalculatorWorkspace: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInput[]>([]);
  const [activeTab, setActiveTab] = useState<"reference" | "assumptions" | "validation" | "calculation">("reference");

  const projectEstimate = calculateProjectEstimate(rooms, DEFAULT_ASSUMPTIONS);

  const handleRoomUpdate = (index: number, updated: RoomInput) => {
    const nextRooms = [...rooms];
    nextRooms[index] = updated;
    setRooms(nextRooms);
  };

  const handleRoomRemove = (index: number) => {
    const nextRooms = [...rooms];
    nextRooms.splice(index, 1);
    setRooms(nextRooms);
  };

  const handleRoomAdd = () => {
    const newRoom: RoomInput = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      length: 0,
      width: 0,
      ceilingHeight: 2.4,
      paintWalls: true,
      paintCeilings: true,
      coats: 2,
      paintQuality: "standard",
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRoomAddFromReference = (room: { name: string; length: number; width: number }) => {
    const newRoom: RoomInput = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: room.name,
      length: room.length,
      width: room.width,
      ceilingHeight: 2.4,
      paintWalls: true,
      paintCeilings: true,
      coats: 2,
      paintQuality: "standard",
    };
    setRooms([...rooms, newRoom]);
  };

  const handleReset = () => {
    setRooms(DEFAULT_ROOMS);
  };

  const handleClearAll = () => {
    setRooms([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="bg-stone-900 border border-stone-850 shadow-md rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 w-full">
          <div className="flex items-start sm:items-center gap-3.5">
            <PigmentaLogo className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer" priority />
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                Pigmenta Paint Calculator
              </h1>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-1 leading-relaxed">
                Estimate paint volumes, tin recommendations, labour hours, and costs for interior walls and ceilings.
              </p>
            </div>
          </div>

          <div className="flex gap-6 justify-start md:justify-start md:self-auto border-t md:border-t-0 md:border-l border-stone-800 pt-4 md:pt-0 pl-[54px] md:pl-8">
            <div className="text-left min-w-[60px]">
              <span className="block text-[9px] text-stone-500 font-bold uppercase tracking-wider">Rooms</span>
              <span className="text-2xl font-bold text-white mt-0.5 block leading-none">{rooms.length}</span>
            </div>
            <div className="text-left min-w-[80px]">
              <span className="block text-[9px] text-stone-500 font-bold uppercase tracking-wider">Total Area</span>
              <span className="text-2xl font-bold text-white mt-0.5 block leading-none">{projectEstimate.totalPaintableAreaM2.toFixed(1)} m²</span>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
        <div className="block lg:hidden space-y-3">
          <EstimatePanel estimate={projectEstimate} compact={true} />

          <details className="group">
            <summary className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-600 hover:text-stone-800 cursor-pointer select-none transition-colors list-none [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Show Detailed Breakdown</span>
              <span className="hidden group-open:inline">Hide Detailed Breakdown</span>
            </summary>
            <div className="mt-3">
              <EstimatePanel estimate={projectEstimate} />
            </div>
          </details>
        </div>

        <section className="lg:col-span-7 flex flex-col gap-8">
          <RoomEditor
            rooms={rooms}
            estimates={projectEstimate.rooms}
            onRoomUpdate={handleRoomUpdate}
            onRoomRemove={handleRoomRemove}
            onRoomAdd={handleRoomAdd}
            onResetToDefaults={handleReset}
            onClearAll={handleClearAll}
          />

          <div className="hidden lg:flex flex-col gap-5 border-t border-stone-200 pt-8 mt-4">
            <div className="flex border-b border-stone-200 text-xs font-semibold text-stone-500">
              {(
                [
                  { id: "reference", label: "Floor Plan Reference", Icon: Grid },
                  { id: "assumptions", label: "Estimation Assumptions", Icon: Info },
                  { id: "calculation", label: "Calculation Walkthrough", Icon: BookOpen },
                  { id: "validation", label: "Engine Validation", Icon: ShieldCheck },
                ] as const
              ).map(({ id, label, Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer",
                      active
                        ? "border-rose-600 text-rose-600 font-bold"
                        : "border-transparent hover:text-stone-800"
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              {activeTab === "reference" && (
                <FloorPlanPanel
                  onAddRoom={handleRoomAddFromReference}
                  showLoadSample={rooms.length === 0}
                  onLoadSamplePlan={handleReset}
                />
              )}
              {activeTab === "assumptions" && <AssumptionsPanel />}
              {activeTab === "calculation" && <CalculationPanel rooms={rooms} estimates={projectEstimate.rooms} />}
              {activeTab === "validation" && <ValidationPanel />}
            </div>
          </div>
        </section>

        <section className="hidden lg:flex lg:col-span-5 flex-col gap-6 lg:sticky lg:top-6">
          <EstimatePanel estimate={projectEstimate} />
        </section>
      </main>

      <div className="block lg:hidden border-t border-stone-200 pt-8 mt-4 space-y-4 print:hidden">
        {(
          [
            {
              id: "reference",
              label: "Floor Plan Reference",
              Icon: Grid,
              component: (
                <FloorPlanPanel
                  onAddRoom={handleRoomAddFromReference}
                  showLoadSample={rooms.length === 0}
                  onLoadSamplePlan={handleReset}
                />
              ),
            },
            {
              id: "assumptions",
              label: "Estimation Assumptions",
              Icon: Info,
              component: <AssumptionsPanel />,
            },
            {
              id: "calculation",
              label: "Calculation Walkthrough",
              Icon: BookOpen,
              component: <CalculationPanel rooms={rooms} estimates={projectEstimate.rooms} />,
            },
            {
              id: "validation",
              label: "Engine Validation Checks",
              Icon: ShieldCheck,
              component: <ValidationPanel />,
            },
          ] as const
        ).map(({ id, label, Icon, component }) => (
          <CollapsiblePanel key={id} label={label} icon={Icon}>
            {component}
          </CollapsiblePanel>
        ))}
      </div>

      {/* Print-Only Professional Document */}
      <PrintEstimate rooms={rooms} projectEstimate={projectEstimate} />
    </div>
  );
};
