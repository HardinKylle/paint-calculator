import React from "react";
import { Trash2 } from "lucide-react";
import type { RoomInput, RoomEstimate } from "../types/estimate";
import { formatCurrency, formatArea, formatLitres, formatHours } from "../lib/formatting";

interface RoomRowProps {
  room: RoomInput;
  estimate: RoomEstimate;
  onUpdate: (updated: RoomInput) => void;
  onRemove: () => void;
}

export const RoomRow: React.FC<RoomRowProps> = ({
  room,
  estimate,
  onUpdate,
  onRemove,
}) => {
  const handleChange = (field: keyof RoomInput, value: string | number | boolean) => {
    const updated = { ...room } as RoomInput;
    
    if (field === "name") {
      updated.name = value as string;
    } else if (field === "length" || field === "width") {
      const numVal = parseFloat(value as string);
      const clamped = isNaN(numVal) ? 0 : Math.max(0, numVal);
      if (field === "length") updated.length = clamped;
      if (field === "width") updated.width = clamped;
    } else if (field === "ceilingHeight") {
      const numVal = parseFloat(value as string);
      const clamped = isNaN(numVal) ? 0.1 : Math.max(0.1, numVal);
      updated.ceilingHeight = clamped;
    } else if (field === "coats") {
      const numVal = parseInt(value as string, 10);
      updated.coats = isNaN(numVal) ? 1 : Math.min(4, Math.max(1, numVal));
    } else if (field === "paintWalls") {
      updated.paintWalls = value as boolean;
      if (!updated.paintWalls && !updated.paintCeilings) {
        updated.paintCeilings = true;
      }
    } else if (field === "paintCeilings") {
      updated.paintCeilings = value as boolean;
      if (!updated.paintCeilings && !updated.paintWalls) {
        updated.paintWalls = true;
      }
    } else if (field === "paintQuality") {
      updated.paintQuality = value as RoomInput["paintQuality"];
    }

    onUpdate(updated);
  };

  return (
    <div className="group relative rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-rose-200 hover:shadow-md">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          value={room.name}
          aria-label="Room Name"
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Room Name"
          className="font-semibold text-lg text-stone-900 border-b border-transparent hover:border-stone-300 focus:border-rose-500 focus:outline-hidden py-0.5 px-1 rounded-sm w-full max-w-[200px]"
        />
        <button
          onClick={onRemove}
          className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
          title="Remove room"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label htmlFor={`length-${room.id}`} className="block text-xs font-medium text-stone-500 mb-1">
            Length (m)
          </label>
          <input
            id={`length-${room.id}`}
            type="number"
            min="0"
            step="0.1"
            value={room.length === 0 ? "" : room.length}
            onChange={(e) => handleChange("length", e.target.value)}
            placeholder="3.5"
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-sm text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-hidden"
          />
        </div>
        <div>
          <label htmlFor={`width-${room.id}`} className="block text-xs font-medium text-stone-500 mb-1">
            Width (m)
          </label>
          <input
            id={`width-${room.id}`}
            type="number"
            min="0"
            step="0.1"
            value={room.width === 0 ? "" : room.width}
            onChange={(e) => handleChange("width", e.target.value)}
            placeholder="3.5"
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-sm text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-hidden"
          />
        </div>
        <div>
          <label htmlFor={`ceiling-${room.id}`} className="block text-xs font-medium text-stone-500 mb-1">
            Ceiling (m)
          </label>
          <input
            id={`ceiling-${room.id}`}
            type="number"
            min="0.1"
            step="0.1"
            value={room.ceilingHeight || ""}
            onChange={(e) => handleChange("ceilingHeight", e.target.value)}
            placeholder="2.4"
            className="w-full rounded-lg border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-sm text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pt-3 border-t border-stone-100">
        <div>
          <span className="block text-xs font-medium text-stone-500 mb-1.5">Surface Toggles</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange("paintWalls", !room.paintWalls)}
              aria-pressed={room.paintWalls}
              className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                room.paintWalls
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-stone-50 border-stone-200 text-stone-400"
              }`}
            >
              Walls
            </button>
            <button
              onClick={() => handleChange("paintCeilings", !room.paintCeilings)}
              aria-pressed={room.paintCeilings}
              className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all duration-200 cursor-pointer ${
                room.paintCeilings
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-stone-50 border-stone-200 text-stone-400"
              }`}
            >
              Ceiling
            </button>
          </div>
        </div>

        <div>
          <label htmlFor={`coats-${room.id}`} className="block text-xs font-medium text-stone-500 mb-1.5">
            Coats
          </label>
          <select
            id={`coats-${room.id}`}
            value={room.coats}
            onChange={(e) => handleChange("coats", e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 px-2 text-xs text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="1">1 Coat</option>
            <option value="2">2 Coats</option>
            <option value="3">3 Coats</option>
            <option value="4">4 Coats</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-2">
          <label htmlFor={`quality-${room.id}`} className="block text-xs font-medium text-stone-500 mb-1.5">
            Paint Quality
          </label>
          <select
            id={`quality-${room.id}`}
            value={room.paintQuality}
            onChange={(e) => handleChange("paintQuality", e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 px-2.5 text-xs text-stone-900 focus:border-rose-500 focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="budget">Budget ($18/L)</option>
            <option value="standard">Standard ($28/L)</option>
            <option value="premium">Premium ($40/L)</option>
          </select>
        </div>
      </div>

      {/* Room Estimate Live Preview Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs bg-stone-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
        <div className="flex gap-3 text-stone-500">
          <span>Area: <strong>{formatArea(estimate.paintableWallAreaM2 + estimate.paintableCeilingAreaM2)}</strong></span>
          <span>Paint: <strong>{formatLitres(estimate.wallPaintLitresRaw + estimate.ceilingPaintLitresRaw)}</strong></span>
          <span>Labour: <strong>{formatHours(estimate.totalLabourHours)}</strong></span>
        </div>
        <div className="text-right">
          <span className="text-stone-500 mr-1.5">Est. Total:</span>
          <span className="font-semibold text-rose-900 text-sm">{formatCurrency(estimate.totalCostAud)}</span>
        </div>
      </div>
    </div>
  );
};
