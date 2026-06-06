import type { RoomInput } from "../types/estimate";

export interface ValidationExample {
  id: string;
  name: string;
  description: string;
  input: RoomInput;
  expected: {
    wallAreaM2: number;
    ceilingAreaM2: number;
    paintableAreaM2: number;
    wallPaintLitresRaw: number;
    ceilingPaintLitresRaw: number;
    totalPaintLitresPurchased: number;
    totalPaintCostAud: number;
    totalLabourHours: number;
    totalLabourCostAud: number;
    totalProjectCostAud: number;
  };
}

export const VALIDATION_EXAMPLES: ValidationExample[] = [
  {
    id: "example-1",
    name: "Example 1: Single Standard Room",
    description: "A standard 4m x 5m room with 2.4m ceiling height, two coats of Standard-grade paint on both walls and ceilings.",
    input: {
      id: "val-room-1",
      name: "Standard Room",
      length: 4,
      width: 5,
      ceilingHeight: 2.4,
      paintWalls: true,
      paintCeilings: true,
      coats: 2,
      paintQuality: "standard",
    },
    expected: {
      wallAreaM2: 43.20,
      ceilingAreaM2: 20.00,
      paintableAreaM2: 126.40,
      wallPaintLitresRaw: 6.17,
      ceilingPaintLitresRaw: 2.86,
      totalPaintLitresPurchased: 10.00, // 7L wall (1x4L + 1x2L + 1x1L) + 3L ceiling (1x2L + 1x1L)
      totalPaintCostAud: 280.00, // 10L * $28.00/L
      totalLabourHours: 14.35, // 8.64h wall + 5.71h ceiling (86.4/10 + 40/7)
      totalLabourCostAud: 933.03, // 14.3542h * $65/h (specifically $561.60 + $371.43)
      totalProjectCostAud: 1213.03,
    },
  },
  {
    id: "example-2",
    name: "Example 2: Wall-Only Budget Room",
    description: "A 3m x 3m utility room with 2.5m ceiling height, two coats of Budget-grade paint on walls only (ceilings excluded).",
    input: {
      id: "val-room-2",
      name: "Utility Room",
      length: 3,
      width: 3,
      ceilingHeight: 2.5,
      paintWalls: true,
      paintCeilings: false,
      coats: 2,
      paintQuality: "budget",
    },
    expected: {
      wallAreaM2: 30.00,
      ceilingAreaM2: 9.00,
      paintableAreaM2: 60.00,
      wallPaintLitresRaw: 4.29,
      ceilingPaintLitresRaw: 0.00,
      totalPaintLitresPurchased: 5.00, // 5L wall (1x4L + 1x1L)
      totalPaintCostAud: 90.00, // 5L * $18.00/L
      totalLabourHours: 6.00, // 60/10 = 6.00h wall
      totalLabourCostAud: 390.00, // 6h * $65/h
      totalProjectCostAud: 480.00,
    },
  },
];
