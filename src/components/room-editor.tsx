import React from "react";
import { Plus, RotateCcw, Trash } from "lucide-react";
import type { RoomInput, RoomEstimate } from "../types/estimate";
import { RoomRow } from "./room-row";

interface RoomEditorProps {
  rooms: RoomInput[];
  estimates: RoomEstimate[];
  onRoomUpdate: (index: number, updated: RoomInput) => void;
  onRoomRemove: (index: number) => void;
  onRoomAdd: () => void;
  onResetToDefaults: () => void;
  onClearAll: () => void;
}

export const RoomEditor: React.FC<RoomEditorProps> = ({
  rooms,
  estimates,
  onRoomUpdate,
  onRoomRemove,
  onRoomAdd,
  onResetToDefaults,
  onClearAll,
}) => {
  const isEmpty = rooms.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Room Configurations</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure room dimensions, paint coats, and material qualities.
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isEmpty && (
            <>
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white py-1.5 px-3 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                title="Clear all rooms"
              >
                <Trash size={14} />
                Clear All
              </button>
              <button
                onClick={onResetToDefaults}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white py-1.5 px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                title="Reset to default sample floor plan rooms"
              >
                <RotateCcw size={14} />
                Reset to Sample Plan
              </button>
            </>
          )}
          <button
            onClick={onRoomAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 py-1.5 px-4 text-xs font-semibold text-white hover:from-rose-600 hover:to-orange-600 transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus size={14} />
            Add Room
          </button>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 py-12 px-6 bg-stone-50/50 text-center">
          <div className="rounded-full bg-stone-100 p-4 mb-3 text-stone-400">
            <Plus size={28} />
          </div>
          <h3 className="font-semibold text-stone-800 text-base">No rooms added</h3>
          <p className="text-sm text-stone-500 max-w-sm mt-1 mb-6">
            Add a custom room from scratch, or load preloaded default dimensions from the sample floor plan to begin.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onResetToDefaults}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white py-2 px-4 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Load Sample Plan
            </button>
            <button
              onClick={onRoomAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 py-2 px-5 text-xs font-semibold text-white hover:from-rose-600 hover:to-orange-600 transition-all shadow-xs cursor-pointer border-0"
            >
              <Plus size={14} />
              Add First Room
            </button>
          </div>
        </div>
      ) : (
        /* Room Cards List */
        <div className="flex flex-col gap-4">
          {rooms.map((room, index) => {
            const estimate = estimates[index];
            if (!estimate) return null;
            return (
              <RoomRow
                key={room.id}
                room={room}
                estimate={estimate}
                onUpdate={(updated) => onRoomUpdate(index, updated)}
                onRemove={() => onRoomRemove(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
