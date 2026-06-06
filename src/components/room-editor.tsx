import React from "react";
import { Plus, RotateCcw, Trash } from "lucide-react";
import type { RoomInput, RoomEstimate } from "@/types/estimate";
import { RoomRow } from "@/components/room-row";
import { Button } from "@/components/ui";

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
              <Button
                onClick={onClearAll}
                variant="destructive"
                title="Clear all rooms"
              >
                <Trash size={14} />
                Clear All
              </Button>
              <Button
                onClick={onResetToDefaults}
                variant="secondary"
                title="Load default sample floor plan rooms"
              >
                <RotateCcw size={14} />
                Load Sample Plan
              </Button>
              <Button
                onClick={onRoomAdd}
                variant="primary"
              >
                <Plus size={14} />
                Add Room
              </Button>
            </>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 py-12 px-6 bg-stone-50/50 text-center">
          <div className="rounded-full bg-stone-100 p-4 mb-3 text-stone-400">
            <Plus size={28} />
          </div>
          <h3 className="font-semibold text-stone-800 text-base">No rooms added</h3>
          <p className="text-sm text-stone-500 max-w-sm mt-1 mb-6">
            Add a custom room from scratch, or load the sample floor plan to begin.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={onResetToDefaults}
              variant="secondary"
              size="lg"
            >
              <RotateCcw size={14} />
              Load Sample Plan
            </Button>
            <Button
              onClick={onRoomAdd}
              variant="primary"
              size="lg"
            >
              <Plus size={14} />
              Add First Room
            </Button>
          </div>
        </div>
      ) : (
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

          <Button
            onClick={onRoomAdd}
            variant="dashed"
            className="mt-2"
          >
            <Plus size={14} />
            Add Another Room
          </Button>
        </div>
      )}
    </div>
  );
};

