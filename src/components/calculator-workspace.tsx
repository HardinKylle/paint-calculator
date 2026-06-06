"use client";
import React, { useState } from "react";
import { Info, Grid, ShieldCheck, BookOpen } from "lucide-react";
import type { RoomInput } from "@/types/estimate";
import { DEFAULT_ROOMS, DEFAULT_ASSUMPTIONS } from "@/lib/defaults";
import { calculateProjectEstimate } from "@/lib/calculator";
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
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 text-white shadow-lg border border-slate-700/50">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <PigmentaLogo className="h-14 w-14 shrink-0 drop-shadow-sm" priority />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-r from-white via-stone-100 to-stone-300">
                Pigmenta Paint Calculator
              </h1>
              <p className="text-sm text-stone-300 max-w-xl mt-1 leading-relaxed">
                Estimate paint quantities, tin requirements, labour hours, and costs for residential interior walls and ceilings.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center md:justify-start md:self-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-center min-w-[80px]">
              <span className="block text-[10px] text-rose-300 font-bold uppercase tracking-wider">Rooms</span>
              <span className="text-2xl font-extrabold">{rooms.length}</span>
            </div>
            <div className="text-center min-w-[100px]">
              <span className="block text-[10px] text-rose-300 font-bold uppercase tracking-wider">Total Area</span>
              <span className="text-2xl font-extrabold">{projectEstimate.totalPaintableAreaM2.toFixed(1)} m²</span>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                  { id: "calculation", label: "Sample Walkthrough", Icon: BookOpen },
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
              {activeTab === "calculation" && <CalculationPanel />}
              {activeTab === "validation" && <ValidationPanel />}
            </div>
          </div>
        </section>

        <section className="hidden lg:flex lg:col-span-5 flex-col gap-6 lg:sticky lg:top-6">
          <EstimatePanel estimate={projectEstimate} />
        </section>
      </main>

      <div className="block lg:hidden border-t border-stone-200 pt-8 mt-4 space-y-4">
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
              label: "Sample Walkthrough",
              Icon: BookOpen,
              component: <CalculationPanel />,
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
    </div>
  );
};
