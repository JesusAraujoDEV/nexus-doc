# 2026-08-15 — Mobile responsiveness sweep

## What changed
Full mobile-viewport (375px) audit of the app, focused on the consultation form and its six tabs (Principal/Récipe/Ultrasonido/Lab. exámenes/Eco. general/Informes-Constancias) — all built the same week without a dedicated mobile pass. Fixed:

- Consultation tab bar (`ConsultationFormHeader.tsx`): six tabs in a plain `flex` row forced the whole page to scroll sideways (563px content in a 375px viewport); now the tab row scrolls itself (`overflow-x-auto`), page-level overflow gone.
- Récipe rows (`RecipeItemsEditor.tsx`): three inputs + a trash icon crammed into one row; now stacks vertically below `sm:`.
- Lab. exámenes Solicitud (`LabExamOrderTab.tsx`): fixed `grid-cols-2` split into ~155px columns; now `grid-cols-1 md:grid-cols-2`.
- Lab. exámenes Registro de resultados (`LabExamResultsTab.tsx`): a real 5-column fixed grid per pending exam; now stacks to one card per exam on mobile.
- Eco. general save bar (`GeneralUltrasoundTab.tsx`): overflowed the page by ~48px; now stacks below `sm:`.
- Field-dense grids (`GeneralUltrasoundAbdominalFields`/`RenalFields`/`TiroideoFields`/`PartesBlandasFields`, `UltrasoundUteroFields`, `UltrasoundBiometriaFetalFields`, `MedicalBackground`'s antecedentes card): fixed 3–4 column grids at all widths; now `grid-cols-2 sm:grid-cols-N`.
- `FechaInciertaCalculator` dialog footer was a hand-rolled `flex justify-end` instead of the shared `DialogFooter` (which already stacks buttons on mobile everywhere else in the app) — switched to reuse it.

All fixes are additive Tailwind breakpoint classes; desktop/tablet layouts are unchanged (re-verified at 768px and 1280px after each fix).

## Why
The user reported parts of the app weren't adapted to mobile — the doctor uses it from her phone between patients. Asked for a full sweep, not a single bug.

## How
Delegated to `crew:frontend-architect` given the scope (every screen, every consultation tab). Verified overflow via `document.documentElement.scrollWidth` vs `clientWidth` plus element-level scans at 375px (more reliable than screenshots in this environment), re-checked every fix at 768px/1280px, `npx tsc --noEmit` clean.

Also reverted a dev-only `vite.config.ts` proxy the agent added to work around an unrelated app occupying port 3000 on the dev machine — that's a local environment quirk, not something that belongs in the shared config (the backend's own port is unaffected, still 3000). Added `.claude/` to `.gitignore` (local dev-server launch config, machine-specific, was about to be committed).

## Promoted knowledge
None new.

## Follow-ups
- [ ] Login page not independently checked at mobile width (only exercised functionally).
- [ ] `EditPatientDialog`'s field grid not independently screenshotted (structurally identical to `NewPatientDialog`, which passed).
