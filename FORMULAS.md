# Paint Calculator Formulas & Calculation Logic

This document provides a comprehensive guide to all mathematical formulas and calculation logic used in the Paint Calculator application. These formulas are implemented programmatically in [`src/lib/calculator.ts`](src/lib/calculator.ts).

---

## 1. Single Room Calculations

For any given room, let:
- $L$ = Room Length (meters)
- $W$ = Room Width (meters)
- $H$ = Ceiling Height (meters)
- $C_{wall}$ = Number of wall coats (integer)
- $C_{ceil}$ = Number of ceiling coats (integer)
- $P_{wall}$ = Wall paint toggle (`true` if walls are being painted, `false` otherwise)
- $P_{ceil}$ = Ceiling paint toggle (`true` if ceiling is being painted, `false` otherwise)
- $Cov$ = Paint coverage rate (default: $14\text{ m}^2/\text{L}$)

### 1.1 Gross Room Areas
*   **Total Wall Area ($m^2$):**
    $$A_{wall\_gross} = 2 \times (L + W) \times H$$
    *Note: The model estimates walls as solid continuous surfaces. No deductions are made for doors, windows, or architectural openings.*

*   **Total Ceiling Area ($m^2$):**
    $$A_{ceil\_gross} = L \times W$$

### 1.2 Net Paintable Areas
*   **Paintable Wall Area ($m^2$):**
    $$A_{wall\_paintable} = \begin{cases} A_{wall\_gross} \times C_{wall} & \text{if } P_{wall} \text{ is true} \\ 0 & \text{otherwise} \end{cases}$$

*   **Paintable Ceiling Area ($m^2$):**
    $$A_{ceil\_paintable} = \begin{cases} A_{ceil\_gross} \times C_{ceil} & \text{if } P_{ceil} \text{ is true} \\ 0 & \text{otherwise} \end{cases}$$

*   **Total Paintable Area ($m^2$):**
    $$A_{total\_paintable} = A_{wall\_paintable} + A_{ceil\_paintable}$$

### 1.3 Raw Paint Litres Required
*   **Raw Wall Paint (Litres):**
    $$V_{wall\_raw} = \frac{A_{wall\_paintable}}{Cov}$$

*   **Raw Ceiling Paint (Litres):**
    $$V_{ceil\_raw} = \frac{A_{ceil\_paintable}}{Cov}$$

*   **Total Raw Paint Required (Litres):**
    $$V_{total\_raw} = V_{wall\_raw} + V_{ceil\_raw}$$

---

## 2. Paint Purchasing & Tin Recommendation

Paint is sold in predefined container sizes ($Tins = [15\text{L}, 10\text{L}, 4\text{L}, 2\text{L}, 1\text{L}]$).
The calculator uses an optimization algorithm to determine the combination of tins to purchase for a target volume $V_{target}$ (where $V_{target}$ is either $V_{wall\_raw}$ or $V_{ceil\_raw}$).

### 2.1 Optimization Objectives
The algorithm finds a combination of tins $(c_{15}, c_{10}, c_4, c_2, c_1)$ where $c_i \ge 0$ represents the quantity of tin size $i$ to purchase, satisfying:
1.  **Sufficiency**:
    $$V_{purchased} = \sum (c_i \times \text{Size}_i) \ge V_{target}$$
2.  **Minimize Surplus**:
    $$\text{Minimize } (V_{purchased} - V_{target})$$
3.  **Minimize Count (Tie-Breaker)**:
    If multiple combinations yield the same minimum surplus, the combination with the fewest total tins is selected:
    $$\text{Minimize } \sum c_i$$

### 2.2 Touch-up Reserve (Surplus)
*   **Wall Surplus (Litres):**
    $$V_{wall\_surplus} = V_{wall\_purchased} - V_{wall\_raw}$$

*   **Ceiling Surplus (Litres):**
    $$V_{ceil\_surplus} = V_{ceil\_purchased} - V_{ceil\_raw}$$

---

## 3. Labour Estimation

Labour hours are computed based on active painted surfaces ($A_{wall\_paintable}$ and $A_{ceil\_paintable}$), using distinct productivity rates.

Let:
- $Prod_{wall}$ = Wall rolling productivity (default: $10\text{ m}^2/\text{hour}$)
- $Prod_{ceil}$ = Ceiling rolling productivity (default: $7\text{ m}^2/\text{hour}$)
- $Rate_{labour}$ = Professional painter hourly charge-out rate (default: $\$65.00\text{ AUD/hour}$)

### 3.1 Labour Hours
*   **Wall Labour Hours:**
    $$T_{wall} = \frac{A_{wall\_paintable}}{Prod_{wall}}$$

*   **Ceiling Labour Hours:**
    $$T_{ceil} = \frac{A_{ceil\_paintable}}{Prod_{ceil}}$$

*   **Total Labour Hours:**
    $$T_{total} = T_{wall} + T_{ceil}$$

### 3.2 Labour Cost
*   **Total Labour Cost ($):**
    $$Cost_{labour} = T_{total} \times Rate_{labour}$$

---

## 4. Cost Calculation

Let:
- $Price_{paint}$ = Cost per litre based on selected quality level (Budget: $\$18.00$, Standard: $\$28.00$, Premium: $\$40.00$)

### 4.1 Paint Cost
*   **Wall Paint Cost ($):**
    $$Cost_{wall\_paint} = V_{wall\_purchased} \times Price_{paint}$$

*   **Ceiling Paint Cost ($):**
    $$Cost_{ceil\_paint} = V_{ceil\_purchased} \times Price_{paint}$$

*   **Total Paint Cost ($):**
    $$Cost_{paint} = Cost_{wall\_paint} + Cost_{ceil\_paint}$$

### 4.2 Total Room/Project Estimate
*   **Total Estimate ($):**
    $$Cost_{total} = Cost_{paint} + Cost_{labour}$$

---

## 5. Project-Level Aggregation (Multi-Room)

When estimating a multi-room project, the calculator performs a **Bulk Paint Optimization**. Instead of buying paint for each room separately (which accumulates excess leftovers), the raw required volumes are aggregated by **paint quality** across all rooms before recommending tins.

Let $R$ be the set of all rooms in the project.

### 5.1 Aggregated Paintable Areas & Labour
*   **Total Project Paintable Wall Area:**
    $$A_{proj\_wall\_paintable} = \sum_{r \in R} A_{wall\_paintable}^{(r)}$$

*   **Total Project Paintable Ceiling Area:**
    $$A_{proj\_ceil\_paintable} = \sum_{r \in R} A_{ceil\_paintable}^{(r)}$$

*   **Total Project Labour Hours:**
    $$T_{proj\_total} = \sum_{r \in R} T_{total}^{(r)}$$

*   **Total Project Labour Cost:**
    $$Cost_{proj\_labour} = T_{proj\_total} \times Rate_{labour}$$

### 5.2 Bulk Paint Purchase Recommendation
For each distinct paint quality level $Q$ used in the project:
1.  Sum the raw required litres for all walls using paint quality $Q$:
    $$V_{proj\_wall\_raw}^{(Q)} = \sum_{r \in R, \text{Quality}(r) = Q} V_{wall\_raw}^{(r)}$$
2.  Sum the raw required litres for all ceilings using paint quality $Q$:
    $$V_{proj\_ceil\_raw}^{(Q)} = \sum_{r \in R, \text{Quality}(r) = Q} V_{ceil\_raw}^{(r)}$$
3.  Run the **Tin Recommendation Algorithm** on $V_{proj\_wall\_raw}^{(Q)}$ to get $V_{proj\_wall\_purchased}^{(Q)}$.
4.  Run the **Tin Recommendation Algorithm** on $V_{proj\_ceil\_raw}^{(Q)}$ to get $V_{proj\_ceil\_purchased}^{(Q)}$.

### 5.3 Aggregated Costs
*   **Total Project Paint Cost ($):**
    $$Cost_{proj\_paint} = \sum_{Q} \left( \left(V_{proj\_wall\_purchased}^{(Q)} + V_{proj\_ceil\_purchased}^{(Q)}\right) \times Price_{paint}^{(Q)} \right)$$

*   **Total Project Estimate ($):**
    $$Cost_{proj\_total} = Cost_{proj\_paint} + Cost_{proj\_labour}$$

---

## 6. Detailed Step-by-Step Example

To help visualize how the math works, let's step through the calculations for a single room:

### Example Input
- **Length ($L$):** $5.0\text{ m}$
- **Width ($W$):** $4.0\text{ m}$
- **Ceiling Height ($H$):** $2.4\text{ m}$
- **Coats:** $2$
- **Paint Walls ($P_{wall}$):** `true`
- **Paint Ceilings ($P_{ceil}$):** `true`
- **Paint Quality:** Premium (Price per Litre = $\$40.00$)
- **Coverage Rate ($Cov$):** $14.0\text{ m}^2/\text{L}$

---

### Step 1: Gross Area Calculations
Using the formulas from Section 1.1:
1. **Wall Gross Area:**
   $$A_{wall\_gross} = 2 \times (Length + Width) \times Height = 2 \times (5.0 + 4.0) \times 2.4$$
   $$A_{wall\_gross} = 2 \times 9.0 \times 2.4 = 43.2\text{ m}^2$$
2. **Ceiling Gross Area:**
   $$A_{ceil\_gross} = Length \times Width = 5.0 \times 4.0 = 20.0\text{ m}^2$$

---

### Step 2: Net Paintable Areas
Multiply by the number of coats ($2$) since the toggles are `true`:
1. **Paintable Wall Area:**
   $$A_{wall\_paintable} = 43.2\text{ m}^2 \times 2\text{ coats} = 86.4\text{ m}^2$$
2. **Paintable Ceiling Area:**
   $$A_{ceil\_paintable} = 20.0\text{ m}^2 \times 2\text{ coats} = 40.0\text{ m}^2$$
3. **Total Paintable Area:**
   $$A_{total\_paintable} = 86.4 + 40.0 = 126.4\text{ m}^2$$

---

### Step 3: Raw Paint Litres Required
Divide paintable areas by the coverage rate ($14.0\text{ m}^2/\text{L}$):
1. **Raw Wall Paint:**
   $$V_{wall\_raw} = \frac{86.4\text{ m}^2}{14.0\text{ m}^2/\text{L}} \approx 6.17\text{ Litres}$$
2. **Raw Ceiling Paint:**
   $$V_{ceil\_raw} = \frac{40.0\text{ m}^2}{14.0\text{ m}^2/\text{L}} \approx 2.86\text{ Litres}$$

---

### Step 4: Paint purchasing & Tin Size Optimization
The calculator chooses standard tin sizes ($15\text{L}, 10\text{L}, 4\text{L}, 2\text{L}, 1\text{L}$) to cover the raw volumes with minimal leftover waste.

1. **For Walls ($V_{wall\_raw} \approx 6.17\text{ L}$):**
   - We must purchase at least $6.17\text{ L}$.
   - The optimization algorithm checks combinations of tin sizes:
     - $1 \times 10\text{L}$ tin = $10\text{L}$ total (surplus = $3.83\text{L}$)
     - $2 \times 4\text{L}$ tins = $8\text{L}$ total (surplus = $1.83\text{L}$)
     - **Best Combination:** $1 \times 4\text{L}$ tin + $1 \times 2\text{L}$ tin + $1 \times 1\text{L}$ tin = **$7\text{L}$ total** (surplus = $0.83\text{L}$)
   - **Recommended Wall Tins:** `1 x 4L`, `1 x 2L`, `1 x 1L` (Total purchased: **$7.00\text{ L}$**)
   - **Wall Touch-up Reserve (Surplus):** $7.00 - 6.17 = 0.83\text{ Litres}$

2. **For Ceilings ($V_{ceil\_raw} \approx 2.86\text{ L}$):**
   - We must purchase at least $2.86\text{ L}$.
   - Checking combinations:
     - $1 \times 4\text{L}$ tin = $4\text{L}$ total (surplus = $1.14\text{L}$)
     - **Best Combination:** $1 \times 2\text{L}$ tin + $1 \times 1\text{L}$ tin = **$3\text{L}$ total** (surplus = $0.14\text{L}$)
   - **Recommended Ceiling Tins:** `1 x 2L`, `1 x 1L` (Total purchased: **$3.00\text{ L}$**)
   - **Ceiling Touch-up Reserve (Surplus):** $3.00 - 2.86 = 0.14\text{ Litres}$

---

### Step 5: Labour Hours & Labour Cost
Using wall productivity $10\text{ m}^2/\text{hour}$, ceiling productivity $7\text{ m}^2/\text{hour}$, and rate $\$65.00/\text{hour}$:
1. **Wall Labour Hours:**
   $$T_{wall} = \frac{A_{wall\_paintable}}{10} = \frac{86.4}{10} = 8.64\text{ hours}$$
2. **Ceiling Labour Hours:**
   $$T_{ceil} = \frac{A_{ceil\_paintable}}{7} = \frac{40.0}{7} \approx 5.71\text{ hours}$$
3. **Total Labour Hours:**
   $$T_{total} = 8.64 + 5.71 = 14.35\text{ hours}$$
4. **Total Labour Cost:**
   $$Cost_{labour} = 14.35\text{ hours} \times \$65.00/\text{hour} = \$933.00\text{ AUD}$$

---

### Step 6: Paint Costs & Total Estimate
Using the purchased litres and the price of premium paint ($\$40.00/\text{L}$):
1. **Wall Paint Cost:**
   $$Cost_{wall\_paint} = 7.00\text{ L} \times \$40.00/\text{L} = \$280.00\text{ AUD}$$
2. **Ceiling Paint Cost:**
   $$Cost_{ceil\_paint} = 3.00\text{ L} \times \$40.00/\text{L} = \$120.00\text{ AUD}$$
3. **Total Paint Cost:**
   $$Cost_{paint} = \$280.00 + \$120.00 = \$400.00\text{ AUD}$$
4. **Total Room Estimate:**
   $$Cost_{total} = Cost_{paint} + Cost_{labour} = \$400.00 + \$933.00 = \$1,333.00\text{ AUD}$$
