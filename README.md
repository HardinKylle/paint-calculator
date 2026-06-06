# Pigmenta Paint Calculator

Pigmenta is a professional interior painting estimator built for residential walls and ceilings. It calculates paint quantities, optimal tin configurations, labor hours, and total costs with real-time updates and bulk paint purchasing optimization.

---

## Tech Stack

- **Core:** React 19, Next.js 16.2 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 (Sleek dark headers, premium stone-toned cards, responsive designs, custom animations)
- **Icons:** Lucide React
- **Validation & Testing:** Vitest unit tests for calculator logic
- **Type Safety:** TypeScript

---

## Getting Started & Setup Commands

### Prerequisites
Make sure you have Node.js installed (v18.0.0 or higher recommended).

### Installation
Install the project dependencies:
```bash
npm install
```

### Running the Development Server
Start the Turbopack local development server:
```bash
npm run dev
```
Open http://localhost:3000 to view the calculator.

### Running Unit Tests
Run the calculation engine test suite:
```bash
npm run test
```

### Linting Checks
Run ESLint verification checks:
```bash
npm run lint
```

### Production Build
Generate an optimized production build:
```bash
npm run build
```

---

## File Structure

```text
paint-calculator/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global HTML layout & font definitions
│   │   └── page.tsx             # Entry page rendering the workspace
│   ├── components/
│   │   ├── panels/              # Workspace Tab Panels
│   │   │   ├── index.ts         # Panels Barrel Export
│   │   │   ├── assumptions-panel.tsx # Standard constants & exclusions lists
│   │   │   ├── calculation-panel.tsx # Step-by-step math walkthrough
│   │   │   ├── estimate-panel.tsx    # Compact & detailed summary
│   │   │   ├── floor-plan-panel.tsx  # Standard house sample plans
│   │   │   └── validation-panel.tsx  # Manual validation matches check
│   │   │
│   │   ├── ui/                  # Reusable UI Primitives
│   │   │   ├── index.ts         # UI Primitives Barrel Export
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── collapsible-panel.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── select.tsx
│   │   │
│   │   ├── calculator-workspace.tsx  # Main application orchestrator
│   │   ├── room-editor.tsx      # Room addition, deletion & parameter form
│   │   └── room-row.tsx         # Individual room line editor
│   │
│   ├── lib/
│   │   ├── calculator.ts        # Core estimation & tin optimization logic
│   │   ├── calculator.test.ts   # Vitest unit test suite (12 test cases)
│   │   ├── defaults.ts          # Default rooms and starting assumptions
│   │   ├── formatting.ts        # Currency, area, hours & litres formatters
│   │   ├── utils.ts             # Tailwind class merge helper
│   │   ├── validation-examples.test.ts # Validation fixture tests
│   │   └── validation-examples.ts # Validation cases data
│   │
│   └── types/
│       └── estimate.ts          # Global TypeScript interfaces & types
│
├── ASSUMPTIONS.md               # Estimate constants, justifications, and formulas
├── FORMULAS.md                  # Algebraic math walkthrough and examples
├── VALIDATION.md                # Manual calculations verified against engine
└── AI_USAGE.md                  # AI assistance, workflow notes, and corrections
```

---

## Working Features

1. **Multi-Room Dynamic Grid:** Add, remove, or modify length, width, height, quality, coats, and paint toggles (walls vs. ceilings separately) for an unlimited number of rooms.
2. **Bulk Purchase Optimization:** Aggregates paint volume requirements by paint quality before recommending tins. This saves costs compared to buying separate tins for every room.
3. **Advanced Tin Recommendation Algorithm:** An integer optimization algorithm that finds combinations of standard retail sizes (15L, 10L, 4L, 2L, 1L) that cover raw litres with minimum surplus paint and minimum tin counts.
4. **Labor productivity split:** Uses distinct trade productivity rates for walls (10 m²/hr) vs. ceilings (7 m²/hr) to calculate painter charges accurately.
5. **Interactive Floor Plan Reference:** Instantly load standard room sizes (Living, Kitchen, Bedroom 1 & 2, Hall, Bathroom, Laundry) from the plan to populate parameters quickly.
6. **Live Math Walkthrough Panel:** Clear formulas and concrete calculations show how numbers are computed step-by-step.
7. **Engine Validation Panel:** Real-time matches between pre-calculated manual validation examples and the live React engine.

---

## Future Priorities & Unfinished Work

While the core estimation engine, styling, and testing are complete, the following features would be next:
- **AUD Only — No Dynamic Pricing:** All prices are hardcoded in Australian Dollars (AUD). There is no currency conversion, no multi-currency support, and no dynamic/live pricing from paint suppliers. Paint cost-per-litre values are static estimates, not fetched from any external API or database.
- **Quote Export (PDF/CSV):** Allow tradespeople to export estimates as customer quotes.
- **Separate Wall/Ceiling Paint Lines:** Support different paint qualities (e.g. standard ceilings with premium walls) in the same room.
- **Interactive Visual Floor Plan Preview:** Render a lightweight, responsive schematic visual layout of rooms to preview size proportions.
- **Local Storage Persistence:** Auto-save calculation rooms in the browser to prevent data loss on page refresh.
- **GST Configuration:** Toggle tax rates in assumptions.
