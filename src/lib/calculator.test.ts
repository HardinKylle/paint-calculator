import { describe, test, expect } from "vitest";
import {
  recommendTins,
  calculateRoomAreas,
  calculateRoomEstimate,
  calculateProjectEstimate,
} from "./calculator";
import { EstimateAssumptions, RoomInput } from "@/types/estimate";

// Sample assumptions used for testing
const testAssumptions: EstimateAssumptions = {
  coverageRateM2PerLitre: 14,
  paintPricesAudPerLitre: {
    budget: 18,
    standard: 28,
    premium: 40,
  },
  wallLabourProductivityM2PerHour: 10,
  ceilingLabourProductivityM2PerHour: 7,
  labourHourlyRateAud: 65,
  commonTinSizesLitre: [15, 10, 4, 2, 1],
};

describe("Calculator Engine Unit Tests", () => {
  describe("recommendTins - Tin Rounding Recommendations", () => {
    test("handles zero or negative required volume", () => {
      expect(recommendTins(0, testAssumptions.commonTinSizesLitre)).toEqual([]);
      expect(recommendTins(-5, testAssumptions.commonTinSizesLitre)).toEqual([]);
    });

    test("perfect fit matching multiple tin sizes", () => {
      // 14L required should recommend exactly 10L + 4L (surplus = 0)
      const recommendation = recommendTins(14, testAssumptions.commonTinSizesLitre);
      expect(recommendation).toEqual([
        { tinSize: 10, count: 1 },
        { tinSize: 4, count: 1 },
      ]);
    });

    test("surplus minimization with multiple options", () => {
      // 3L required should select 2L + 1L (total 3L, surplus 0) instead of a single 4L tin (surplus 1L)
      const recommendation = recommendTins(3, testAssumptions.commonTinSizesLitre);
      expect(recommendation).toEqual([
        { tinSize: 2, count: 1 },
        { tinSize: 1, count: 1 },
      ]);
    });

    test("tie-breaker prefers fewer tins for same surplus", () => {
      // 8L required can be 4L + 4L (2 tins) or 10L (1 tin, surplus 2L)
      // If 4L + 4L is chosen, surplus is 0, which is smaller than surplus of 10L (2L).
      // Let's test 10L vs 5x 2L. 10L has surplus 0 for 10L, 5x 2L has surplus 0.
      // So recommendTins(10) should choose 10L count 1.
      const recommendation = recommendTins(10, testAssumptions.commonTinSizesLitre);
      expect(recommendation).toEqual([{ tinSize: 10, count: 1 }]);
    });

    test("handles very large paint quantities (over 60L)", () => {
      // 76L required: 4 * 15L base = 60L. Remainder = 16L.
      // 16L remainder optimized with DP -> should choose 15L + 1L (16L total, 0 surplus).
      // Total: 5 * 15L + 1 * 1L = 76L.
      const recommendation = recommendTins(76, testAssumptions.commonTinSizesLitre);
      expect(recommendation).toEqual([
        { tinSize: 15, count: 5 },
        { tinSize: 1, count: 1 },
      ]);
    });
  });

  describe("calculateRoomAreas - Area Calculation Formulas", () => {
    test("valid dimensions", () => {
      // Room 4m x 3m with 2.5m ceiling
      const areas = calculateRoomAreas({ length: 4, width: 3, ceilingHeight: 2.5 });
      // Walls: 2 * (4 + 3) * 2.5 = 35 m2
      // Ceiling: 4 * 3 = 12 m2
      expect(areas.wallAreaM2).toBe(35);
      expect(areas.ceilingAreaM2).toBe(12);
    });

    test("invalid or incomplete dimensions return 0", () => {
      expect(calculateRoomAreas({ length: 0, width: 3, ceilingHeight: 2.4 })).toEqual({
        wallAreaM2: 0,
        ceilingAreaM2: 0,
      });
      expect(calculateRoomAreas({ length: 4, width: -1, ceilingHeight: 2.4 })).toEqual({
        wallAreaM2: 0,
        ceilingAreaM2: 0,
      });
    });
  });

  describe("calculateRoomEstimate - Single Room Estimates", () => {
    const standardRoom: RoomInput = {
      id: "room-1",
      name: "Living Room",
      length: 4,
      width: 3,
      ceilingHeight: 2.4, // Wall area: 2*(4+3)*2.4 = 33.6m2, Ceiling area: 4*3 = 12m2
      paintWalls: true,
      paintCeilings: true,
      coats: 2,
      paintQuality: "standard",
    };

    test("walls and ceilings selected", () => {
      const estimate = calculateRoomEstimate(standardRoom, testAssumptions);

      // Paintable areas: coats * area
      // Wall paintable: 33.6 * 2 = 67.2 m2
      // Ceiling paintable: 12 * 2 = 24.0 m2
      expect(estimate.paintableWallAreaM2).toBe(67.2);
      expect(estimate.paintableCeilingAreaM2).toBe(24.0);

      // Raw Litres: Area / coverage (14)
      // Wall raw: 67.2 / 14 = 4.8 L
      // Ceiling raw: 24 / 14 = 1.714 L (approx)
      expect(estimate.wallPaintLitresRaw).toBeCloseTo(4.8, 4);
      expect(estimate.ceilingPaintLitresRaw).toBeCloseTo(1.714, 2);

      // Purchased litres (rounded to tin sizes):
      // Wall: 4.8L -> recommends 4L + 1L (5L total)
      // Ceiling: 1.714L -> recommends 2L (2L total)
      expect(estimate.wallPaintLitresPurchased).toBe(5);
      expect(estimate.ceilingPaintLitresPurchased).toBe(2);

      // Labour hours: area / productivity (Walls: 10 m2/h, Ceiling: 7 m2/h)
      // Wall: 67.2 / 10 = 6.72 hours
      // Ceiling: 24 / 7 = 3.428 hours (approx)
      expect(estimate.wallLabourHours).toBeCloseTo(6.72, 4);
      expect(estimate.ceilingLabourHours).toBeCloseTo(3.428, 2);

      // Labour cost: hours * hourly rate ($65)
      // Wall: 6.72 * 65 = $436.80
      // Ceiling: (24 / 7) * 65 = $222.86 (approx)
      expect(estimate.wallLabourCostAud).toBeCloseTo(436.8, 2);
      expect(estimate.ceilingLabourCostAud).toBeCloseTo(222.86, 2);

      // Paint cost: purchased litres * standard rate ($28/L)
      // Wall: 5 * 28 = $140
      // Ceiling: 2 * 28 = $56
      expect(estimate.wallPaintCostAud).toBe(140);
      expect(estimate.ceilingPaintCostAud).toBe(56);
      expect(estimate.totalPaintCostAud).toBe(196);
    });

    test("wall-only painting", () => {
      const wallOnlyRoom: RoomInput = {
        ...standardRoom,
        paintCeilings: false,
      };
      const estimate = calculateRoomEstimate(wallOnlyRoom, testAssumptions);

      expect(estimate.paintableCeilingAreaM2).toBe(0);
      expect(estimate.ceilingPaintLitresRaw).toBe(0);
      expect(estimate.ceilingPaintLitresPurchased).toBe(0);
      expect(estimate.ceilingLabourHours).toBe(0);
      expect(estimate.ceilingLabourCostAud).toBe(0);

      // Walls should remain correct
      expect(estimate.paintableWallAreaM2).toBe(67.2);
    });

    test("ceiling-only painting", () => {
      const ceilingOnlyRoom: RoomInput = {
        ...standardRoom,
        paintWalls: false,
      };
      const estimate = calculateRoomEstimate(ceilingOnlyRoom, testAssumptions);

      expect(estimate.paintableWallAreaM2).toBe(0);
      expect(estimate.wallPaintLitresRaw).toBe(0);
      expect(estimate.wallPaintLitresPurchased).toBe(0);
      expect(estimate.wallLabourHours).toBe(0);
      expect(estimate.wallLabourCostAud).toBe(0);

      // Ceilings should remain correct
      expect(estimate.paintableCeilingAreaM2).toBe(24);
    });

    test("paint quality pricing (budget vs premium)", () => {
      const budgetRoom = { ...standardRoom, paintQuality: "budget" as const };
      const premiumRoom = { ...standardRoom, paintQuality: "premium" as const };

      const budgetEstimate = calculateRoomEstimate(budgetRoom, testAssumptions);
      const premiumEstimate = calculateRoomEstimate(premiumRoom, testAssumptions);

      // Budget standard: $18/L, Premium: $40/L. Wall purchases: 5L, Ceiling: 2L (7L total)
      // Budget: 7L * 18 = $126
      // Premium: 7L * 40 = $280
      expect(budgetEstimate.totalPaintCostAud).toBe(126);
      expect(premiumEstimate.totalPaintCostAud).toBe(280);
    });
  });

  describe("calculateProjectEstimate - Project-Level Totals & Bulk Recommendation", () => {
    test("aggregates multiple rooms and optimizes tin sizes globally", () => {
      // Room 1 (Standard): Raw wall litres: 4.8L, Raw ceiling litres: 1.714L
      const room1: RoomInput = {
        id: "room-1",
        name: "Living",
        length: 4,
        width: 3,
        ceilingHeight: 2.4,
        paintWalls: true,
        paintCeilings: true,
        coats: 2,
        paintQuality: "standard",
      };

      // Room 2 (Standard): Raw wall litres: 2.4L, Raw ceiling litres: 0L (wall only)
      const room2: RoomInput = {
        id: "room-2",
        name: "Bedroom 2",
        length: 2,
        width: 3,
        ceilingHeight: 2.4, // Wall area: 2*(2+3)*2.4 = 24m2. Coats=2 -> paintable = 48m2. Raw wall = 48/14 = 3.428L
        paintWalls: true,
        paintCeilings: false,
        coats: 2,
        paintQuality: "standard",
      };

      // Project estimate aggregates raw volumes:
      // Total wall raw standard: 4.8 + 3.428 = 8.228 L.
      // Bulk recommendation for 8.228L -> Recommends two 4L tins and one 1L tin (9L total)
      // instead of rounding rooms separately (which would be (4.8 -> 5L) + (3.428 -> 4L) = 9L).
      // Total ceiling raw standard: 1.714 L.
      // Bulk recommendation for 1.714L -> Recommends 2L tin (2L purchased).

      const project = calculateProjectEstimate([room1, room2], testAssumptions);

      // Areas
      expect(project.totalWallAreaM2).toBeCloseTo(57.6, 2);
      expect(project.totalCeilingAreaM2).toBeCloseTo(18.0, 2);
      expect(project.totalPaintableAreaM2).toBeCloseTo(139.2, 2);

      // Raw volumes
      expect(project.totalWallPaintLitresRaw).toBeCloseTo(8.228, 2);
      expect(project.totalCeilingPaintLitresRaw).toBeCloseTo(1.714, 2);

      // Bulk Tin Recommendations:
      // Walls: 4L tin (count: 2) + 1L tin (count: 1)
      expect(project.totalWallPaintLitresPurchased).toBe(9);
      expect(project.totalWallTins).toEqual([
        { tinSize: 4, count: 2, paintQuality: "standard" },
        { tinSize: 1, count: 1, paintQuality: "standard" },
      ]);

      // Ceilings: 2L tin (count: 1)
      expect(project.totalCeilingPaintLitresPurchased).toBe(2);
      expect(project.totalCeilingTins).toEqual([{ tinSize: 2, count: 1, paintQuality: "standard" }]);

      // Touch-up reserves:
      // Walls surplus: 9 - 8.228 = 0.772 L
      // Ceiling surplus: 2 - 1.714 = 0.286 L
      expect(project.totalTouchUpReserveWallL).toBeCloseTo(0.772, 2);
      expect(project.totalTouchUpReserveCeilingL).toBeCloseTo(0.286, 2);

      // Paint Costs
      expect(project.totalWallPaintCostAud).toBe(9 * 28);
      expect(project.totalCeilingPaintCostAud).toBe(2 * 28);
      expect(project.totalPaintCostAud).toBe(308);

      // Labour Hours & Costs
      // Wall hours: 67.2 / 10 + 48.0 / 10 = 11.52 hours
      // Ceiling hours: 24.0 / 7 = 3.42857 hours
      expect(project.totalWallLabourHours).toBeCloseTo(11.52, 2);
      expect(project.totalCeilingLabourHours).toBeCloseTo(3.42857, 2);
      expect(project.totalLabourHours).toBeCloseTo(11.52 + 3.42857, 2);

      expect(project.totalWallLabourCostAud).toBeCloseTo(11.52 * 65, 2);
      expect(project.totalCeilingLabourCostAud).toBeCloseTo(3.42857 * 65, 2);
      expect(project.totalLabourCostAud).toBeCloseTo((11.52 + 3.42857) * 65, 2);

      // Total Project Cost
      expect(project.totalProjectCostAud).toBeCloseTo(308 + (11.52 + 3.42857) * 65, 2);
    });
  });
});
