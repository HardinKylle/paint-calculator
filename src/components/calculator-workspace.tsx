"use client";

import React, { useState } from "react";
import { Paintbrush, Calculator } from "lucide-react";
import type { RoomInput } from "../types/estimate";
import { DEFAULT_ROOMS, DEFAULT_ASSUMPTIONS } from "../lib/defaults";
import { calculateProjectEstimate } from "../lib/calculator";
import { RoomEditor } from "./room-editor";
import { formatCurrency, formatArea, formatHours } from "../lib/formatting";

export const CalculatorWorkspace: React.FC = () => {
  // Starts with an empty room list by default
  const [rooms, setRooms] = useState<RoomInput[]>([]);

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

  const handleReset = () => {
    setRooms(DEFAULT_ROOMS);
  };

  const handleClearAll = () => {
    setRooms([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Premium Branded Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 p-8 text-white shadow-lg border border-slate-700/50">
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
        {/* Left Column: Room Editor (Col Span 7) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <RoomEditor
            rooms={rooms}
            estimates={projectEstimate.rooms}
            onRoomUpdate={handleRoomUpdate}
            onRoomRemove={handleRoomRemove}
            onRoomAdd={handleRoomAdd}
            onResetToDefaults={handleReset}
            onClearAll={handleClearAll}
          />
        </section>

        {/* Right Column: Basic Calculations Preview for Phase 5 (Col Span 5) */}
        <section className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Estimate Preview</h2>
            <div className="flex flex-col gap-3.5 text-sm text-stone-600">
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span>Total Project Area:</span>
                <span className="font-semibold text-stone-950">{formatArea(projectEstimate.totalPaintableAreaM2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span>Total Labour Hours:</span>
                <span className="font-semibold text-stone-950">{formatHours(projectEstimate.totalLabourHours)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span>Estimated Cost (Subtotal):</span>
                <span className="font-bold text-rose-800 text-lg">{formatCurrency(projectEstimate.totalProjectCostAud)}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 mt-4 leading-relaxed">
              * A detailed breakdown of materials, tin recommendation, and labour split will be loaded in the next phase.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
