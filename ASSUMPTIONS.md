# Paint Calculator Assumptions

This document outlines the estimation model, default values, rounding rules, and architectural assumptions used in the paint calculator.

---

## 1. Domain Default Values & Assumptions

The calculator uses the following default values for a standard residential painting estimate:

| Assumption Parameter | Default Value | Rationale & Source Reference |
| :--- | :--- | :--- |
| **Default Ceiling Height** | `2.4 m` | Standard Australian residential ceiling height for habitable rooms. (Reference: [Australian Building Codes Board (ABCB) NCC 2022 Part H1D2](https://ncc.abcb.gov.au/)). |
| **Paint Coverage Rate** | `14 m²/L` per coat | Dulux Australia Wash & Wear specifies a theoretical coverage of up to `16 m²/L` (see [Dulux Wash & Wear Datasheet](https://www.dulux.com.au/)), but practical coverage is assumed at `14 m²/L` to account for plasterboard surface absorption and roller losses. |
| **Wall Labour Productivity** | `10 m²/hour` | Standard trade estimation rate for rolling out walls on prepped plasterboard (Reference: [Rawlinsons Australian Construction Handbook](https://www.rawlhouse.com/)). |
| **Ceiling Labour Productivity** | `7 m²/hour` | Slower productivity due to overhead working fatigue, setup, and safety considerations (Reference: [Rawlinsons Australian Construction Handbook](https://www.rawlhouse.com/)). |
| **Labour Hourly Rate** | `$65 AUD / hour` | Average professional residential painter charge-out rate in Australia (Reference: [Indeed Australia Painter Salaries](https://au.indeed.com/career/painter/salaries) & [PayScale Australia Painter Hourly Rate](https://www.payscale.com/research/AU/Job=Painter%2C_Construction_and_Maintenance/Hourly_Rate)). |
| **Common Paint Tin Sizes** | `15L, 10L, 4L, 2L, 1L` | Standard retail and trade paint container sizes available in Australian retail stores (Reference: [Bunnings Warehouse Paint](https://www.bunnings.com.au/)). |

### Paint Quality Pricing

The price per litre varies based on the selected paint quality level:

| Paint Quality | Cost per Litre (AUD) | Product Class Reference |
| :--- | :--- | :--- |
| **Budget** | `$18.00` | Trade grade or builder's bulk paint (e.g., Dulux Professional / Spring Paint, see [Bunnings Trade Paint](https://www.bunnings.com.au/)). |
| **Standard** | `$28.00` | Typical retail interior paint (e.g., British Paints or [Taubmans Professional](https://www.bunnings.com.au/brands/taubmans) via Bunnings). |
| **Premium** | `$40.00` | Premium low-VOC wash-and-wear paint (e.g., [Dulux Wash & Wear](https://www.bunnings.com.au/brands/dulux) via Bunnings). |

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
