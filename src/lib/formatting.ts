import type { TinRecommendation } from "../types/estimate";

/**
 * Capitalizes a string (e.g., "premium" -> "Premium").
 */
export function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Rounds a number to a specified number of decimal places.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Formats a currency value as AUD (e.g., $1,234.56).
 */
export function formatCurrency(value: number): string {
  const rounded = roundTo(value, 2);
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

/**
 * Formats an area in square metres (e.g., 24.50 m²).
 */
export function formatArea(value: number): string {
  const rounded = roundTo(value, 2);
  return `${rounded.toFixed(2)} m²`;
}

/**
 * Formats paint volume in litres (e.g., 3.45 L).
 */
export function formatLitres(value: number): string {
  const rounded = roundTo(value, 2);
  return `${rounded.toFixed(2)} L`;
}

/**
 * Formats labour hours (e.g., 4.25 hrs).
 */
export function formatHours(value: number): string {
  const rounded = roundTo(value, 2);
  return `${rounded.toFixed(2)} hrs`;
}

/**
 * Formats a list of tin recommendations into a readable string.
 * Example room-level: "1 x 10L, 1 x 4L"
 * Example project-level with quality: "1 x 10L (Standard), 2 x 1L (Premium)"
 */
export function formatTinRecommendation(tins: TinRecommendation[]): string {
  if (!tins || tins.length === 0) return "No tins recommended";
  return tins
    .map(t => {
      const qualitySuffix = t.paintQuality ? ` (${capitalize(t.paintQuality)})` : "";
      return `${t.count} × ${t.tinSize}L${qualitySuffix}`;
    })
    .join(", ");
}
