# 2026-08-09 — Ficha de Embarazo (pregnancy record) UI

## What changed
Consultations now start with a category choice (Ginecología / Obstetricia). Picking Obstetricia surfaces the patient's active pregnancy or a mini-form to start one (reported F.U.M, or "fecha incierta" via a calculator that takes an ultrasound date + gestational weeks/days). The patient profile gained a pregnancy section listing every Ficha de Embarazo the patient has had, each with its linked consultations ("Evolución"), a print action, and an edit dialog covering status (activo/finalizado/pérdida/ectópico) and newborn data. The patient directory gained an "embarazadas ahora" filter. The old heuristic `PregnancyBanner`/`pregnancy.ts` (guessed pregnancy from record contents) was deleted, superseded by the real backend-backed entity.

## Why
Mirrors the backend Pregnancy entity added the same day (see `nexus-doc-back/docs/work/2026-08/2026-08-09-pregnancy-record.md`) and the user's explicit request to replicate VRunner's pregnancy workflow: create/edit/delete obstetric consultations tied to a ficha, filter the directory by currently-pregnant patients, and print the ficha the same way récipes and ultrasounds already print.

## How
- `ConsultationForm` gained a `category` field driving which `UltrasoundFieldsEditor` mode is available (obstetric trimester switcher only shows for `obstetrics`) and whether `PregnancyPicker` renders.
- `PregnancyPicker` auto-selects the patient's active pregnancy (via `useEffect`, not a render-time side effect — an earlier draft violated React's render rules and was corrected) or offers to create one inline, including the `FechaInciertaCalculator` dialog.
- `PatientFilters` → `patients-api.ts` (`PatientListParams.pregnant`) → `PatientsDirectory` now passes `pregnant=true` through to the backend's existing filter.
- Verified via `npx tsc --noEmit` and `eslint` on all touched files (clean). No interactive browser was available in this environment to click through the flow, so this is unverified end-to-end in a live UI — see follow-ups.

## Promoted knowledge
None new — extends the existing page-based consultation flow and JSONB/computed-field patterns already documented for this project.

## Follow-ups
- [ ] End-to-end browser verification of the full flow (category toggle → PregnancyPicker → fecha incierta → Evolución list → print) once a browser session is available.
- [ ] No delete button yet for a Ficha de Embarazo itself.
- [ ] Deleting an obstetric consultation from the pregnancy card view uses the generic consultation-delete flow, unverified in that specific context.
