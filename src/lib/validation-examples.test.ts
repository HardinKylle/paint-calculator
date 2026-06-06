import { describe, expect, test } from "vitest";
import { calculateRoomEstimate } from "./calculator";
import { DEFAULT_ASSUMPTIONS } from "./defaults";
import { VALIDATION_EXAMPLES } from "./validation-examples";

const expectDisplayValueToMatch = (actual: number, expected: number) => {
  expect(actual).toBeCloseTo(expected, 2);
};

describe("validation examples", () => {
  test.each(VALIDATION_EXAMPLES)("$name expected values match the calculator engine", (example) => {
    const estimate = calculateRoomEstimate(example.input, DEFAULT_ASSUMPTIONS);

    expectDisplayValueToMatch(estimate.wallAreaM2, example.expected.wallAreaM2);
    expectDisplayValueToMatch(estimate.ceilingAreaM2, example.expected.ceilingAreaM2);
    expectDisplayValueToMatch(
      estimate.paintableWallAreaM2 + estimate.paintableCeilingAreaM2,
      example.expected.paintableAreaM2
    );
    expectDisplayValueToMatch(estimate.wallPaintLitresRaw, example.expected.wallPaintLitresRaw);
    expectDisplayValueToMatch(estimate.ceilingPaintLitresRaw, example.expected.ceilingPaintLitresRaw);
    expectDisplayValueToMatch(
      estimate.wallPaintLitresPurchased + estimate.ceilingPaintLitresPurchased,
      example.expected.totalPaintLitresPurchased
    );
    expectDisplayValueToMatch(estimate.totalPaintCostAud, example.expected.totalPaintCostAud);
    expectDisplayValueToMatch(estimate.totalLabourHours, example.expected.totalLabourHours);
    expectDisplayValueToMatch(estimate.totalLabourCostAud, example.expected.totalLabourCostAud);
    expectDisplayValueToMatch(estimate.totalCostAud, example.expected.totalProjectCostAud);
  });
});
