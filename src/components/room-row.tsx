import React from "react";
import { Trash2 } from "lucide-react";
import type { RoomInput, RoomEstimate } from "@/types/estimate";
import { formatCurrency, formatArea, formatLitres, formatHours } from "@/lib/formatting";
import { Button, Input, Select, Label, Card } from "@/components/ui";

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
    <Card hoverable className="group relative p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Input
          type="text"
          value={room.name}
          aria-label="Room Name"
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Room Name"
          variant="seamless"
          className="max-w-[200px]"
        />
        <Button
          onClick={onRemove}
          variant="icon-trash"
          title="Remove room"
        >
          <Trash2 size={18} />
        </Button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <Label htmlFor={`length-${room.id}`}>Length (m)</Label>
          <Input
            id={`length-${room.id}`}
            type="number"
            min="0"
            step="0.1"
            value={room.length === 0 ? "" : room.length}
            onChange={(e) => handleChange("length", e.target.value)}
            placeholder="3.5"
          />
        </div>
        <div>
          <Label htmlFor={`width-${room.id}`}>Width (m)</Label>
          <Input
            id={`width-${room.id}`}
            type="number"
            min="0"
            step="0.1"
            value={room.width === 0 ? "" : room.width}
            onChange={(e) => handleChange("width", e.target.value)}
            placeholder="3.5"
          />
        </div>
        <div>
          <Label htmlFor={`ceiling-${room.id}`}>Ceiling (m)</Label>
          <Input
            id={`ceiling-${room.id}`}
            type="number"
            min="0.1"
            step="0.1"
            value={room.ceilingHeight || ""}
            onChange={(e) => handleChange("ceilingHeight", e.target.value)}
            placeholder="2.4"
          />
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pt-3 border-t border-stone-100">
        <div>
          <span className="block text-xs font-medium text-stone-500 mb-1.5">Surface Toggles</span>
          <div className="flex gap-2">
            <Button
              onClick={() => handleChange("paintWalls", !room.paintWalls)}
              aria-pressed={room.paintWalls}
              variant="toggle"
              active={room.paintWalls}
            >
              Walls
            </Button>
            <Button
              onClick={() => handleChange("paintCeilings", !room.paintCeilings)}
              aria-pressed={room.paintCeilings}
              variant="toggle"
              active={room.paintCeilings}
            >
              Ceiling
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor={`coats-${room.id}`} className="mb-1.5">
            Coats
          </Label>
          <Select
            id={`coats-${room.id}`}
            value={room.coats}
            onChange={(e) => handleChange("coats", e.target.value)}
          >
            <option value="1">1 Coat</option>
            <option value="2">2 Coats</option>
            <option value="3">3 Coats</option>
            <option value="4">4 Coats</option>
          </Select>
        </div>

        <div className="col-span-2 sm:col-span-2">
          <Label htmlFor={`quality-${room.id}`} className="mb-1.5">
            Paint Quality
          </Label>
          <Select
            id={`quality-${room.id}`}
            value={room.paintQuality}
            onChange={(e) => handleChange("paintQuality", e.target.value)}
            className="px-2.5"
          >
            <option value="budget">Budget ($18/L)</option>
            <option value="standard">Standard ($28/L)</option>
            <option value="premium">Premium ($40/L)</option>
          </Select>
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
    </Card>
  );
};

