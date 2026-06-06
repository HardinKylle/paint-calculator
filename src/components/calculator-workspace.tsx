"use client";

import React, { useState } from "react";
import { Paintbrush, Calculator } from "lucide-react";
import type { RoomInput } from "../types/estimate";
import { DEFAULT_ROOMS, DEFAULT_ASSUMPTIONS } from "../lib/defaults";
import { calculateProjectEstimate } from "../lib/calculator";
import { RoomEditor } from "./room-editor";
import { EstimateSummary } from "./estimate-summary";
import { ChevronDown, Info, Grid, ShieldCheck } from "lucide-react";
import { FloorPlanReference } from "./floor-plan-reference";
import { AssumptionsPanel } from "./assumptions-panel";
import { ValidationPanel } from "./validation-panel";

export const CalculatorWorkspace: React.FC = () => {
  // Starts with an empty room list by default
  const [rooms, setRooms] = useState<RoomInput[]>([]);
  const [activeTab, setActiveTab] = useState<"reference" | "assumptions" | "validation">("reference");

  // Live calculation of project-level estimate
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
      {/* Premium Branded Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 text-white shadow-lg border border-slate-700/50">
        {/* Decorative background grid/blobs representing copper/coral paint splashes */}
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-rose-450">
              <Calculator size={30} strokeWidth={1.5} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/60 border border-rose-500/20 px-2.5 py-0.5 text-xs text-rose-300 font-semibold mb-2">
                <Paintbrush size={12} />
                <span>Interior Paint Estimator</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-r from-white via-stone-100 to-stone-300">
                Pigmenta Paint Calculator
              </h1>
              <p className="text-sm text-stone-300 max-w-xl mt-1 leading-relaxed">
                Estimate paint quantities, tin requirements, labour hours, and costs for residential interior walls and ceilings.
              </p>
            </div>
          </div>
          
          {/* Quick Stats Banner */}
          <div className="flex gap-4 self-start md:self-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
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

      {/* Main Content Layout Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile-only compact estimate summary: displayed above Room Editor on small screens */}
        <div className="block lg:hidden space-y-3">
          <EstimateSummary estimate={projectEstimate} compact={true} />
          
          <details className="group">
            <summary className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-600 hover:text-stone-800 cursor-pointer select-none transition-colors list-none [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Show Detailed Breakdown</span>
              <span className="hidden group-open:inline">Hide Detailed Breakdown</span>
            </summary>
            <div className="mt-3">
              <EstimateSummary estimate={projectEstimate} />
            </div>
          </details>
        </div>

        {/* Left Column: Room Editor & Info Tabs (Col Span 7) */}
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

          {/* Desktop Info Panels (Tabs Layout) */}
          <div className="hidden lg:flex flex-col gap-5 border-t border-stone-200 pt-8 mt-4">
            {/* Tabs Header */}
            <div className="flex border-b border-stone-200 text-xs font-semibold text-stone-500">
              <button
                onClick={() => setActiveTab("reference")}
                className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "reference"
                    ? "border-rose-600 text-rose-600 font-bold"
                    : "border-transparent hover:text-stone-800"
                }`}
              >
                <Grid size={14} />
                Floor Plan Reference
              </button>
              <button
                onClick={() => setActiveTab("assumptions")}
                className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "assumptions"
                    ? "border-rose-600 text-rose-600 font-bold"
                    : "border-transparent hover:text-stone-800"
                }`}
              >
                <Info size={14} />
                Estimation Assumptions
              </button>
              <button
                onClick={() => setActiveTab("validation")}
                className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "validation"
                    ? "border-rose-600 text-rose-600 font-bold"
                    : "border-transparent hover:text-stone-800"
                }`}
              >
                <ShieldCheck size={14} />
                Engine Validation
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === "reference" && (
                <FloorPlanReference
                  onAddRoom={handleRoomAddFromReference}
                  showLoadSample={rooms.length === 0}
                  onLoadSamplePlan={handleReset}
                />
              )}
              {activeTab === "assumptions" && <AssumptionsPanel />}
              {activeTab === "validation" && <ValidationPanel />}
            </div>
          </div>
        </section>

        {/* Right Column: Detailed Estimate Summary (Col Span 5) */}
        <section className="hidden lg:flex lg:col-span-5 flex-col gap-6 lg:sticky lg:top-6">
          <EstimateSummary estimate={projectEstimate} />
        </section>
      </main>

      {/* Mobile-only collapsible footer panels */}
      <div className="block lg:hidden border-t border-stone-200 pt-8 mt-4 space-y-4">
        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs">
          <summary className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50/50 hover:bg-stone-50 list-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5">
              <Grid size={14} className="text-stone-400" />
              Floor Plan Reference
            </span>
            <ChevronDown size={14} className="text-stone-400 group-open:rotate-180 transition-transform duration-200" />
          </summary>
          <div className="p-4 border-t border-stone-200 bg-stone-50/20">
            <FloorPlanReference
              onAddRoom={handleRoomAddFromReference}
              showLoadSample={rooms.length === 0}
              onLoadSamplePlan={handleReset}
            />
          </div>
        </details>

        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs">
          <summary className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50/50 hover:bg-stone-50 list-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5">
              <Info size={14} className="text-stone-400" />
              Estimation Assumptions
            </span>
            <ChevronDown size={14} className="text-stone-400 group-open:rotate-180 transition-transform duration-200" />
          </summary>
          <div className="p-4 border-t border-stone-200 bg-stone-50/20">
            <AssumptionsPanel />
          </div>
        </details>

        <details className="group border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs">
          <summary className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50/50 hover:bg-stone-50 list-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-stone-400" />
              Engine Validation Checks
            </span>
            <ChevronDown size={14} className="text-stone-400 group-open:rotate-180 transition-transform duration-200" />
          </summary>
          <div className="p-4 border-t border-stone-200 bg-stone-50/20">
            <ValidationPanel />
          </div>
        </details>
      </div>
    </div>
  );
};
