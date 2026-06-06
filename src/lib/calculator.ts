import {
  RoomInput,
  EstimateAssumptions,
  RoomEstimate,
  ProjectEstimate,
  TinRecommendation,
  PaintQuality,
} from "../types/estimate";

/**
 * Recommends a combination of tin sizes to cover the required raw litres.
 * Prioritizes:
 * 1. Sufficiency: Total purchased capacity >= requiredLitres.
 * 2. Minimum Surplus: Minimizes leftover paint.
 * 3. Fewer Tins: If two combinations have the same surplus, chooses the one with fewer tins.
 */
export function recommendTins(requiredLitres: number, tinSizes: number[]): TinRecommendation[] {
  if (requiredLitres <= 0 || tinSizes.length === 0) return [];

  let target = Math.ceil(requiredLitres);
  const sortedSizes = [...tinSizes].sort((a, b) => b - a);
  const maxTin = sortedSizes[0];

  // Optimize for very large volumes to prevent array size overhead in DP
  let base15LTins = 0;
  if (target > 60 && maxTin === 15) {
    base15LTins = Math.floor((target - 60) / 15);
    target = target - base15LTins * 15;
  }

  const limit = target + maxTin;
  const dp: (number[] | null)[] = new Array(limit + 1).fill(null);
  dp[0] = [];

  for (let i = 0; i <= target; i++) {
    if (dp[i] === null) continue;
    const currentTins = dp[i]!;

    for (const size of sortedSizes) {
      const nextSum = i + size;
      if (nextSum > limit) continue;

      const nextTins = [...currentTins, size];
      const existing = dp[nextSum];

      if (existing === null) {
        dp[nextSum] = nextTins;
      } else {
        // Tie-breaker: prefer fewer tins
        if (nextTins.length < existing.length) {
          dp[nextSum] = nextTins;
        }
      }
    }
  }

  let bestTins: number[] | null = null;
  let bestSum = Infinity;

  for (let s = target; s <= limit; s++) {
    const tins = dp[s];
    if (tins !== null) {
      if (s < bestSum) {
        bestSum = s;
        bestTins = tins;
      } else if (s === bestSum) {
        if (bestTins === null || tins.length < bestTins.length) {
          bestTins = tins;
        }
      }
    }
  }

  if (!bestTins) return [];

  // Group the tins into TinRecommendation format
  const counts: Record<number, number> = {};
  
  // Add base tins if we extracted them
  if (base15LTins > 0) {
    counts[15] = base15LTins;
  }

  for (const tin of bestTins) {
    counts[tin] = (counts[tin] || 0) + 1;
  }

  return sortedSizes
    .filter(size => counts[size] > 0)
    .map(size => ({
      tinSize: size,
      count: counts[size],
    }));
}

export function calculateRoomAreas(room: { length: number; width: number; ceilingHeight: number }) {
  if (!room.length || !room.width || !room.ceilingHeight || room.length <= 0 || room.width <= 0 || room.ceilingHeight <= 0) {
    return { wallAreaM2: 0, ceilingAreaM2: 0 };
  }
  const wallAreaM2 = 2 * (room.length + room.width) * room.ceilingHeight;
  const ceilingAreaM2 = room.length * room.width;
  return { wallAreaM2, ceilingAreaM2 };
}

/**
 * Calculates the estimate for a single room.
 * Note: Tin recommendations and paint cost at the room level are computed independently.
 */
export function calculateRoomEstimate(room: RoomInput, assumptions: EstimateAssumptions): RoomEstimate {
  const { wallAreaM2, ceilingAreaM2 } = calculateRoomAreas(room);

  const paintableWallAreaM2 = room.paintWalls ? wallAreaM2 * room.coats : 0;
  const paintableCeilingAreaM2 = room.paintCeilings ? ceilingAreaM2 * room.coats : 0;

  const wallPaintLitresRaw = paintableWallAreaM2 / assumptions.coverageRateM2PerLitre;
  const ceilingPaintLitresRaw = paintableCeilingAreaM2 / assumptions.coverageRateM2PerLitre;

  const wallTins = room.paintWalls
    ? recommendTins(wallPaintLitresRaw, assumptions.commonTinSizesLitre).map(t => ({
        ...t,
        paintQuality: room.paintQuality,
      }))
    : [];
  const ceilingTins = room.paintCeilings
    ? recommendTins(ceilingPaintLitresRaw, assumptions.commonTinSizesLitre).map(t => ({
        ...t,
        paintQuality: room.paintQuality,
      }))
    : [];

  const wallPaintLitresPurchased = wallTins.reduce((sum, t) => sum + t.tinSize * t.count, 0);
  const ceilingPaintLitresPurchased = ceilingTins.reduce((sum, t) => sum + t.tinSize * t.count, 0);

  const pricePerLitre = assumptions.paintPricesAudPerLitre[room.paintQuality];
  const wallPaintCostAud = wallPaintLitresPurchased * pricePerLitre;
  const ceilingPaintCostAud = ceilingPaintLitresPurchased * pricePerLitre;
  const totalPaintCostAud = wallPaintCostAud + ceilingPaintCostAud;

  const wallLabourHours = paintableWallAreaM2 / assumptions.wallLabourProductivityM2PerHour;
  const ceilingLabourHours = paintableCeilingAreaM2 / assumptions.ceilingLabourProductivityM2PerHour;
  const totalLabourHours = wallLabourHours + ceilingLabourHours;

  const wallLabourCostAud = wallLabourHours * assumptions.labourHourlyRateAud;
  const ceilingLabourCostAud = ceilingLabourHours * assumptions.labourHourlyRateAud;
  const totalLabourCostAud = wallLabourCostAud + ceilingLabourCostAud;

  const totalCostAud = totalPaintCostAud + totalLabourCostAud;

  return {
    roomId: room.id,
    wallAreaM2,
    ceilingAreaM2,
    paintableWallAreaM2,
    paintableCeilingAreaM2,
    wallPaintLitresRaw,
    ceilingPaintLitresRaw,
    wallPaintLitresPurchased,
    ceilingPaintLitresPurchased,
    wallTins,
    ceilingTins,
    wallPaintCostAud,
    ceilingPaintCostAud,
    totalPaintCostAud,
    wallLabourHours,
    ceilingLabourHours,
    totalLabourHours,
    wallLabourCostAud,
    ceilingLabourCostAud,
    totalLabourCostAud,
    totalCostAud,
  };
}

/**
 * Calculates the project-level estimate across all rooms.
 * Optimizes tin recommendations by grouping paint volumes by quality.
 */
export function calculateProjectEstimate(rooms: RoomInput[], assumptions: EstimateAssumptions): ProjectEstimate {
  const roomEstimates = rooms.map(room => calculateRoomEstimate(room, assumptions));

  // Initialize overall totals
  let totalWallAreaM2 = 0;
  let totalCeilingAreaM2 = 0;
  let totalPaintableAreaM2 = 0;
  let totalWallPaintLitresRaw = 0;
  let totalCeilingPaintLitresRaw = 0;
  let totalWallLabourHours = 0;
  let totalCeilingLabourHours = 0;
  let totalLabourHours = 0;
  let totalWallLabourCostAud = 0;
  let totalCeilingLabourCostAud = 0;
  let totalLabourCostAud = 0;

  // Group raw paint volumes by quality to optimize tin sizes in bulk
  const wallVolumeByQuality: Record<PaintQuality, number> = { budget: 0, standard: 0, premium: 0 };
  const ceilingVolumeByQuality: Record<PaintQuality, number> = { budget: 0, standard: 0, premium: 0 };

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const est = roomEstimates[i];

    totalWallAreaM2 += est.wallAreaM2;
    totalCeilingAreaM2 += est.ceilingAreaM2;
    totalPaintableAreaM2 += est.paintableWallAreaM2 + est.paintableCeilingAreaM2;

    totalWallPaintLitresRaw += est.wallPaintLitresRaw;
    totalCeilingPaintLitresRaw += est.ceilingPaintLitresRaw;

    totalWallLabourHours += est.wallLabourHours;
    totalCeilingLabourHours += est.ceilingLabourHours;
    totalLabourHours += est.totalLabourHours;

    totalWallLabourCostAud += est.wallLabourCostAud;
    totalCeilingLabourCostAud += est.ceilingLabourCostAud;
    totalLabourCostAud += est.totalLabourCostAud;

    if (room.paintWalls) {
      wallVolumeByQuality[room.paintQuality] += est.wallPaintLitresRaw;
    }
    if (room.paintCeilings) {
      ceilingVolumeByQuality[room.paintQuality] += est.ceilingPaintLitresRaw;
    }
  }

  // Calculate bulk project-level tin recommendations and paint costs grouped by quality
  const aggregatedWallTins: TinRecommendation[] = [];
  const aggregatedCeilingTins: TinRecommendation[] = [];
  let totalWallPaintLitresPurchased = 0;
  let totalCeilingPaintLitresPurchased = 0;
  let totalWallPaintCostAud = 0;
  let totalCeilingPaintCostAud = 0;

  const qualities: PaintQuality[] = ["budget", "standard", "premium"];

  for (const q of qualities) {
    const wallRaw = wallVolumeByQuality[q];
    if (wallRaw > 0) {
      const tins = recommendTins(wallRaw, assumptions.commonTinSizesLitre);
      for (const tin of tins) {
        const existing = aggregatedWallTins.find(t => t.tinSize === tin.tinSize && t.paintQuality === q);
        if (existing) {
          existing.count += tin.count;
        } else {
          aggregatedWallTins.push({ ...tin, paintQuality: q });
        }
        totalWallPaintLitresPurchased += tin.tinSize * tin.count;
        totalWallPaintCostAud += tin.tinSize * tin.count * assumptions.paintPricesAudPerLitre[q];
      }
    }

    const ceilingRaw = ceilingVolumeByQuality[q];
    if (ceilingRaw > 0) {
      const tins = recommendTins(ceilingRaw, assumptions.commonTinSizesLitre);
      for (const tin of tins) {
        const existing = aggregatedCeilingTins.find(t => t.tinSize === tin.tinSize && t.paintQuality === q);
        if (existing) {
          existing.count += tin.count;
        } else {
          aggregatedCeilingTins.push({ ...tin, paintQuality: q });
        }
        totalCeilingPaintLitresPurchased += tin.tinSize * tin.count;
        totalCeilingPaintCostAud += tin.tinSize * tin.count * assumptions.paintPricesAudPerLitre[q];
      }
    }
  }

  // Sort aggregated tins descending by size
  aggregatedWallTins.sort((a, b) => b.tinSize - a.tinSize);
  aggregatedCeilingTins.sort((a, b) => b.tinSize - a.tinSize);

  const totalTouchUpReserveWallL = totalWallPaintLitresPurchased - totalWallPaintLitresRaw;
  const totalTouchUpReserveCeilingL = totalCeilingPaintLitresPurchased - totalCeilingPaintLitresRaw;
  const totalPaintCostAud = totalWallPaintCostAud + totalCeilingPaintCostAud;
  const totalProjectCostAud = totalPaintCostAud + totalLabourCostAud;

  return {
    rooms: roomEstimates,
    totalWallAreaM2,
    totalCeilingAreaM2,
    totalPaintableAreaM2,
    totalWallPaintLitresRaw,
    totalCeilingPaintLitresRaw,
    totalWallPaintLitresPurchased,
    totalCeilingPaintLitresPurchased,
    totalWallTins: aggregatedWallTins,
    totalCeilingTins: aggregatedCeilingTins,
    totalTouchUpReserveWallL,
    totalTouchUpReserveCeilingL,
    totalWallPaintCostAud,
    totalCeilingPaintCostAud,
    totalPaintCostAud,
    totalWallLabourHours,
    totalCeilingLabourHours,
    totalLabourHours,
    totalWallLabourCostAud,
    totalCeilingLabourCostAud,
    totalLabourCostAud,
    totalProjectCostAud,
  };
}
