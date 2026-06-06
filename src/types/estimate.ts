export type PaintQuality = "budget" | "standard" | "premium";

export interface RoomInput {
  id: string;
  name: string;
  length: number;
  width: number;
  ceilingHeight: number;
  paintWalls: boolean;
  paintCeilings: boolean;
  coats: number;
  paintQuality: PaintQuality;
}

export interface EstimateAssumptions {
  coverageRateM2PerLitre: number;
  wallLabourProductivityM2PerHour: number;
  ceilingLabourProductivityM2PerHour: number;
  labourHourlyRateAud: number;
  paintPricesAudPerLitre: Record<PaintQuality, number>;
  commonTinSizesLitre: number[];
}

export interface TinRecommendation {
  tinSize: number;
  count: number;
  paintQuality?: PaintQuality;
}

export interface RoomEstimate {
  roomId: string;
  wallAreaM2: number;
  ceilingAreaM2: number;
  paintableWallAreaM2: number;   // coats-adjusted
  paintableCeilingAreaM2: number; // coats-adjusted
  
  // Paint estimation
  wallPaintLitresRaw: number;
  ceilingPaintLitresRaw: number;
  wallPaintLitresPurchased: number;
  ceilingPaintLitresPurchased: number;
  wallTins: TinRecommendation[];
  ceilingTins: TinRecommendation[];
  wallPaintCostAud: number;
  ceilingPaintCostAud: number;
  totalPaintCostAud: number;
  
  // Labour estimation
  wallLabourHours: number;
  ceilingLabourHours: number;
  totalLabourHours: number;
  wallLabourCostAud: number;
  ceilingLabourCostAud: number;
  totalLabourCostAud: number;
  
  // Total
  totalCostAud: number;
}

export interface ProjectEstimate {
  rooms: RoomEstimate[];
  
  // Overall Totals
  totalWallAreaM2: number;
  totalCeilingAreaM2: number;
  totalPaintableAreaM2: number;
  
  totalWallPaintLitresRaw: number;
  totalCeilingPaintLitresRaw: number;
  totalWallPaintLitresPurchased: number;
  totalCeilingPaintLitresPurchased: number;
  
  totalWallTins: TinRecommendation[];
  totalCeilingTins: TinRecommendation[];
  totalTouchUpReserveWallL: number;
  totalTouchUpReserveCeilingL: number;
  
  totalWallPaintCostAud: number;
  totalCeilingPaintCostAud: number;
  totalPaintCostAud: number;
  
  totalWallLabourHours: number;
  totalCeilingLabourHours: number;
  totalLabourHours: number;
  totalWallLabourCostAud: number;
  totalCeilingLabourCostAud: number;
  totalLabourCostAud: number;
  
  totalProjectCostAud: number;
}
