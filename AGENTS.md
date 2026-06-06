# Repository Guidelines

## Project Overview

Pigmenta Paint Calculator is a Next.js 16 App Router application for estimating interior paint quantities, tin recommendations, labour hours, and AUD project costs. Core calculation logic lives in `src/lib`, UI components live in `src/components`, and route entry points live in `src/app`.

## Next.js Version Rule

This is Next.js 16.2.7, and local framework behavior may differ from older Next.js assumptions. Before changing App Router, image, route, config, metadata, server/client component, caching, or build behavior, read the relevant guide under `node_modules/next/dist/docs/` and follow any deprecation notes there.

Useful local docs:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/18-upgrading.md`

## Commands

- `npm run dev`: start the local development server.
- `npm run build`: create a production build.
- `npm run lint`: run ESLint.
- `npm run test`: run the Vitest suite.
- `npm run test:watch`: run Vitest in watch mode.

## Code Organization

- `src/app/page.tsx` renders the calculator workspace.
- `src/app/layout.tsx` defines the root layout.
- `src/components/calculator-workspace.tsx` coordinates the main client-side calculator experience.
- `src/components/room-editor.tsx` and `src/components/room-row.tsx` manage room editing UI.
- `src/components/panels/` contains workspace panels for estimates, formulas, assumptions, floor plan presets, and validation.
- `src/components/ui/` contains reusable UI primitives.
- `src/lib/calculator.ts` contains the estimation and tin optimization engine.
- `src/lib/defaults.ts` contains default rooms and assumptions.
- `src/types/estimate.ts` contains shared estimator types.

## Testing Expectations

Run `npm run test` after changing calculator formulas, assumptions, tin optimization, validation examples, or shared types. Run `npm run lint` after TypeScript, React, styling, or component changes. Run `npm run build` when changing Next.js app structure, metadata, images, config, or anything likely to affect production compilation.

## Implementation Notes

- Preserve existing user work in the working tree. Do not revert unrelated modified files.
- Keep calculation changes covered by Vitest tests in `src/lib/*.test.ts`.
- Keep hardcoded pricing assumptions documented in `ASSUMPTIONS.md`, `FORMULAS.md`, and `VALIDATION.md` when formulas or constants change.
- Use existing UI primitives from `src/components/ui` before adding new component patterns.
- Use `lucide-react` for icons when an icon is needed.
- Keep display currency as AUD unless the requirements explicitly add multi-currency behavior.

