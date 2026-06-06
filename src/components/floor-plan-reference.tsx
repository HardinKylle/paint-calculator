import React from "react";
import { Grid, Plus, RotateCcw } from "lucide-react";

interface ReferenceRoom {
  name: string;
  length: number;
  width: number;
}

const SAMPLE_ROOMS: ReferenceRoom[] = [
  { name: "Living", length: 5.2, width: 4.1 },
  { name: "Kitchen", length: 3.4, width: 3.1 },
  { name: "Bedroom 1", length: 4.0, width: 3.6 },
  { name: "Hall", length: 5.5, width: 1.1 },
  { name: "Bedroom 2", length: 3.4, width: 3.2 },
  { name: "Bath", length: 2.4, width: 2.1 },
  { name: "Laundry", length: 2.2, width: 1.8 },
];

interface FloorPlanReferenceProps {
  onAddRoom: (room: { name: string; length: number; width: number }) => void;
  onLoadSamplePlan?: () => void;
  showLoadSample?: boolean;
}

export const FloorPlanReference: React.FC<FloorPlanReferenceProps> = ({
  onAddRoom,
  onLoadSamplePlan,
  showLoadSample = false,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-1.5">
            <Grid size={18} className="text-rose-600" />
            Floor Plan Reference
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Reference dimensions from the standard residential floor plan.
          </p>
        </div>
        
        {showLoadSample && onLoadSamplePlan && (
          <button
            onClick={onLoadSamplePlan}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white py-1 px-2.5 text-[11px] font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            Load Full Sample Plan
          </button>
        )}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <th className="px-4 py-2">Room Name</th>
              <th className="px-4 py-2 text-right">Length (m)</th>
              <th className="px-4 py-2 text-right">Width (m)</th>
              <th className="px-4 py-2 text-right">Area (m²)</th>
              <th className="px-4 py-2 text-center w-12">Add</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-stone-700">
            {SAMPLE_ROOMS.map((room) => {
              const ceilingArea = room.length * room.width;
              return (
                <tr key={room.name} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-stone-900">{room.name}</td>
                  <td className="px-4 py-2.5 text-right">{room.length.toFixed(1)} m</td>
                  <td className="px-4 py-2.5 text-right">{room.width.toFixed(1)} m</td>
                  <td className="px-4 py-2.5 text-right font-medium text-stone-600">
                    {ceilingArea.toFixed(2)} m²
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => onAddRoom(room)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                      title={`Add ${room.name} to calculation list`}
                    >
                      <Plus size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
