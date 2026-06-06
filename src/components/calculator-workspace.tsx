"use client";
import React, { useState } from "react";
import type { RoomInput } from "@/types/estimate";
import { DEFAULT_ROOMS, DEFAULT_ASSUMPTIONS } from "@/lib/defaults";
import { calculateProjectEstimate } from "@/lib/calculator";
import { CalculatorHeader } from "@/components/calculator-header";
import { WorkspacePanels } from "@/components/workspace-panels";
import { PrintEstimate } from "@/components/print-estimate";
import { RoomEditor } from "@/components/room-editor";
import { EstimateSidebar } from "@/components/estimate-sidebar";

export const CalculatorWorkspace: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInput[]>([]);

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
      <CalculatorHeader roomsCount={rooms.length} totalArea={projectEstimate.totalPaintableAreaM2} />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
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

          <WorkspacePanels
            rooms={rooms}
            projectEstimate={projectEstimate}
            onAddRoomFromReference={handleRoomAddFromReference}
            onLoadSamplePlan={handleReset}
          />
        </section>

        <EstimateSidebar estimate={projectEstimate} />
      </main>

      {/* Print-Only Professional Document */}
      <PrintEstimate rooms={rooms} projectEstimate={projectEstimate} />
    </div>
  );
};
