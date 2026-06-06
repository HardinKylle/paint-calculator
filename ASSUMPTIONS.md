# Paint Calculator Assumptions

This document outlines the estimation model, default values, rounding rules, and architectural assumptions used in the paint calculator.

---

## 1. Domain Default Values & Assumptions

The calculator uses the following default values for a standard residential painting estimate:

| Assumption Parameter | Default Value | Source & Rationale |
| :--- | :--- | :--- |
| **Default Ceiling Height** | `2.4 m` | NCC 2022 Housing Provisions Part 10.3.1 lists habitable rooms excluding kitchens as not less than `2.4 m` ([ABCB NCC Part 10.3 Room heights](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/10-health-and-amenity/part-103-room-heights)). |
| **Paint Coverage Rate** | `14 m²/L` per coat | British Paints Paint & Prime Interior Low Sheen lists coverage as `14m²/L`; this supports the calculator's conservative interior paint coverage value. Dulux also publishes a more optimistic general wall-paint guide of about `16 m²/L`, so `14 m²/L` is intentionally conservative ([British Paints Paint & Prime Interior Low Sheen](https://www.britishpaints.com.au/paint-products/ceiling-paint/paint-prime-interior-low-sheen/); [Dulux Paint Calculator](https://www.dulux.com.au/services/paint-calculator/)). |
| **Wall Labour Productivity** | `10 m²/hour` | Resene's professional painter productivity table says to calculate labour as `Area x Factor = Hours`; for interior repaint walls it lists `0.22` hours per m² for prepare/fill/sand/spot-prime plus 2 coats. Because this calculator applies productivity to coat-adjusted area, `10 m²/hour` equals `0.20` hours per finished m² for 2 coats, close to Resene's `0.22` factor ([Resene Productivity Tables](https://www.resene.com.au/pdf/Productivity_Tables.pdf)). |
| **Ceiling Labour Productivity** | `7 m²/hour` | Resene lists repaint ceilings in good condition at `0.18` hours per m² for 2 coats. The calculator's `7 m²/hour` on coat-adjusted area equals about `0.286` hours per finished m² for 2 coats, slower than Resene's table and therefore conservative for overhead work ([Resene Productivity Tables](https://www.resene.com.au/pdf/Productivity_Tables.pdf)). |
| **Labour Hourly Rate** | `$65 AUD / hour` | ServiceSeeking's 2026 Australian house painter pricing guide lists an average hourly rate of `$62.95` and an average day-rate equivalent of `$62.29/hour`; `$65/hour` is a rounded model rate ([ServiceSeeking House Painter Prices 2026](https://www.serviceseeking.com.au/pricing/house-painter-prices-2026-cost-guide?hs_amp=true)). |
| **Common Paint Tin Sizes** | `15L, 10L, 4L, 2L, 1L` | Bunnings product pages show Dulux Wash&Wear Low Sheen available in `1L`, `2L`, `4L`, `10L`, and `15L`; some ranges also include `0.5L`, while budget/trade ranges may omit `1L` or `2L` ([Dulux Wash&Wear 15L Bunnings product page](https://www.bunnings.com.au/dulux-15l-vivid-white-low-sheen-wash-wear-interior-paint_p0638909)). |

### Paint Quality Pricing

The price per litre varies based on the selected paint quality level. These values are calculator pricing bands, not exact live retail prices. Bunnings prices change and vary by product size, finish, tint base, and store availability.

| Paint Quality | Calculator Cost per Litre (AUD) | Source & Rationale |
| :--- | :--- | :--- |
| **Budget** | `$18.00` | Bunnings lists Taubmans 4L White Low Sheen Easycoat All Walls Interior Paint at `$17.99/L`; the calculator rounds this to `$18.00/L` ([Taubmans 4L Easycoat All Walls Interior Paint](https://www.bunnings.com.au/taubmans-4l-white-low-sheen-easycoat-all-walls-interior-paint_p0401018)). |
| **Standard** | `$28.00` | Bunnings lists Dulux 4L Interior Paint UltraAir Low Sheen Vivid White at `$27.00/L` and Dulux 4L Aquanamel Semi Gloss White at `$29.88/L`; the calculator uses `$28.00/L` as the middle retail band ([Dulux 4L UltraAir Low Sheen](https://www.bunnings.com.au/dulux-4l-interior-paint-ultraair-low-sheen-vivid-white-4l_p0283375); [Dulux 4L Aquanamel Semi Gloss](https://www.bunnings.com.au/dulux-4l-aquanamel-semi-gloss-white-enamel-paint-4l_p1400051)). |
| **Premium** | `$40.00` | Bunnings lists Dulux 4L Wash&Wear +PLUS Kitchen & Bathroom at `$32.75/L` and the 2L version at `$45.75/L`; the calculator uses `$40.00/L` as a rounded premium interior band between those live SKU prices ([Dulux 4L Wash&Wear +PLUS Kitchen & Bathroom](https://www.bunnings.com.au/dulux-4l-interior-paint-wash-wear-plus-kitchen-bathroom-low-sheen-vivid-white-4l_p1370128); [Dulux 2L Wash&Wear +PLUS Kitchen & Bathroom](https://www.bunnings.com.au/dulux-2l-interior-paint-wash-wear-plus-kitchen-bathroom-low-sheen-vivid-white_p1370127)). |

---

## 2. Core Estimation Formulas

The calculator runs all calculations per-room first, then aggregates them to project-level totals.

### Area Calculations
*   **Room Wall Area ($m^2$):**
    $$WallArea = 2 \times (Length + Width) \times CeilingHeight$$
    *Note: Wall area is estimated as continuous surfaces; no deductions are made for doors, windows, or other wall openings.*
*   **Room Ceiling Area ($m^2$):**
    $$CeilingArea = Length \times Width$$
*   **Paintable Wall Area ($m^2$):**
    $$PaintableWallArea = WallArea \times PaintWalls \times Coats$$
*   **Paintable Ceiling Area ($m^2$):**
    $$PaintableCeilingArea = CeilingArea \times PaintCeilings \times Coats$$

### Paint Consumption
Wall and ceiling paint quantities are calculated and purchased separately:
*   **Raw Paint Litres Required:**
    $$WallPaintLitresRaw = \frac{PaintableWallArea}{CoverageRate}$$
    $$CeilingPaintLitresRaw = \frac{PaintableCeilingArea}{CoverageRate}$$
*   **Purchased Paint Litres:**
    *   `WallPaintLitresPurchased`: The sum of recommended tins that satisfy `WallPaintLitresRaw`.
    *   `CeilingPaintLitresPurchased`: The sum of recommended tins that satisfy `CeilingPaintLitresRaw`.
*   **Tin Recommendation Tie-Breaker Algorithm:**
    When recommending combinations of tin sizes (`15L, 10L, 4L, 2L, 1L`), the selection algorithm prioritizes:
    1.  **Sufficiency**: Total purchased volume is greater than or equal to the raw required volume.
    2.  **Minimum Surplus**: Minimizes the difference between purchased volume and raw volume.
    3.  **Fewer Tins**: If two different combinations yield the exact same surplus, the combination with the lower count of individual tins is preferred (e.g., preferring `1 x 4L` over `2 x 2L` or `4 x 1L`).
*   **Touch-up Reserve (Surplus):**
    $$WallTouchUpReserve = WallPaintLitresPurchased - WallPaintLitresRaw$$
    $$CeilingTouchUpReserve = CeilingPaintLitresPurchased - CeilingPaintLitresRaw$$

### Labour Hours & Cost
Labour hours are calculated on actual painted surfaces (coats-adjusted) rather than rounded paint quantities:
*   **Wall Labour Hours:**
    $$WallLabourHours = \frac{PaintableWallArea}{WallLabourProductivity}$$
*   **Ceiling Labour Hours:**
    $$CeilingLabourHours = \frac{PaintableCeilingArea}{CeilingLabourProductivity}$$
*   **Total Labour Hours:**
    $$TotalLabourHours = WallLabourHours + CeilingLabourHours$$
*   **Labour Cost (AUD):**
    $$LabourCost = TotalLabourHours \times LabourHourlyRate$$

### Project-Level Totals
*   **Paint Cost:**
    Paint costs are computed separately for walls and ceilings based on total purchased tin volumes:
    $$WallPaintCost = WallPaintLitresPurchased \times PaintPrice$$
    $$CeilingPaintCost = CeilingPaintLitresPurchased \times PaintPrice$$
    $$TotalPaintCost = WallPaintCost + CeilingPaintCost$$
    *Note: Because project paint totals are calculated by aggregating raw litres across all rooms by paint quality before recommending tins (bulk purchasing optimization), the recommended project tins and total paint cost may be lower than the sum of individual room estimates (which assume separate paint purchasing per room).*
*   **Total Project Estimate:**
    $$TotalEstimate = TotalPaintCost + LabourCost$$

---

## 3. Rounding & Display Rules

*   **Areas:** Shown and rounded to `2` decimal places.
*   **Labour Hours:** Shown and rounded to `2` decimal places.
*   **Raw Paint Litres:** Shown to `2` decimal places for transparency.
*   **Purchased Paint Litres:** Derived from recommended tin size combinations.
*   **Leftover / Touch-up Reserve:** Rounded to `2` decimal places.
*   **Currency/Money:** All financial outputs rounded and displayed to `2` decimal places.

---

## 4. Scope Exclusions

The calculator model is strictly for interior walls and ceilings. The following are explicitly excluded from the estimate calculations:
*   Doors, windows, and other wall openings (no area deductions are made).
*   Architraves, skirting boards, cornices, and window/door frames.
*   Wall surface preparation (patching, sanding, washing, or priming).
*   Furniture movement, protective plastic sheeting, or cleanup labour.
*   GST (Goods and Services Tax) - all rates are exclusive of GST.
*   Travel allowance, height access equipment (scaffolding), or minimum callout fees.
