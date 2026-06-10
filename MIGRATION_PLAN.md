# Resume Rendering Migration Plan

## Goal
Safely transform the current monolithic shared renderer into a modular layout-driven architecture while preserving all production behavior, PDF compatibility, and pagination.

## Existing Production Path
- `ResumeBuilder.tsx`
- `ResumeDocument.tsx`
- `ThemedResumeTemplate.tsx`
- `shared.tsx`
- `themeConfig.ts`
- `templateThemes.tsx`

## Phase 1 — Architecture Stabilization

### Objective
Create the migration scaffolding without changing runtime output.

### Files created
- `frontend/src/components/resume-shared/LayoutEngine.ts`
- `frontend/src/components/resume-shared/ThemeEngine.ts`
- `frontend/src/components/resume-shared/SectionBuilder.ts`
- `frontend/src/components/resume-shared/ResumeTypography.ts`
- `frontend/src/components/resume-shared/TemplateMetadata.ts`

### Scope
- No behavioral changes.
- No routing changes.
- No PDF changes.
- No pagination changes.
- `shared.tsx` remains the source of truth.

### Tasks
1. Add migration-layer file stubs and type definitions.
2. Keep all runtime imports unchanged.
3. Document the future architecture in place.
4. Confirm current HTML output remains identical via snapshots.

### Success criteria
- New files exist and compile.
- Existing renderer remains unchanged.
- Rendered HTML output is identical for baseline templates.

## Phase 2 — Extract Layout Families

### Objective
Create the new layout family modules by copying behavior from `shared.tsx`, without switching the runtime path.

### Files created
- `frontend/src/components/resume-layouts/ModernLayout.tsx`
- `frontend/src/components/resume-layouts/SidebarLayout.tsx`
- `frontend/src/components/resume-layouts/MinimalLayout.tsx`
- `frontend/src/components/resume-layouts/ExecutiveLayout.tsx`
- `frontend/src/components/resume-layouts/ProfessionalLayout.tsx`

### Scope
- Do not change production rendering.
- Use `shared.tsx` as the source of truth.
- Implement exact layout behavior in new modules.

### Tasks
1. Reconstruct each layout family from `shared.tsx` logic.
2. Keep rendering behavior identical.
3. Capture comparison screenshots between current renderer and extracted layout.
4. Introduce a side-by-side rendering harness for visual comparison.

### Success criteria
- Visual parity at pixel level for extracted layouts.
- No runtime effect because layout modules are not yet wired.
- Comparison artifacts generated for audit.

## Phase 3 — Regression Framework

### Objective
Create the test foundation and baseline snapshots required for controlled migration.

### Files created
- `frontend/src/components/resume-tests/visual/README.md`
- `frontend/src/components/resume-tests/integration/README.md`
- `frontend/src/components/resume-tests/pdf/README.md`

### Scope
- Create a formal regression framework.
- Capture baselines for key templates and fixtures.

### Baseline snapshots
- Template 1
- Template 2
- Template 4
- Template 6
- Template 8

### Test fixtures
- Normal resume
- Long multi-page resume
- Stress resume

### Validation targets
- Page count
- Section order
- Typography
- Header placement
- Sidebar placement
- PDF output

### Success criteria
- Baseline snapshots exist.
- Regression framework is documented.
- PDF compatibility checks are defined.

## Phase 4 — Controlled Migration

### Objective
Migrate only ModernLayout first and validate its output fully.

### Scope
- Templates: 1, 3, 7, 10, 12.
- Switch one family only.
- Keep all other templates on the current `shared.tsx` path.

### Validation
1. Old renderer output vs new ModernLayout output.
2. PDF page count equality.
3. Section order equality.
4. Multi-page pagination parity.
5. Typography and header placement parity.
6. ATS structure parity.

### Success criteria
- Identical rendered DOM and PDF behavior for ModernLayout templates.
- No visible or structural regressions.
- Migration validated before the next family.

## Phase 5 — Family-by-Family Migration

### Objective
Migrate each family independently after ModernLayout passes.

### Order
1. ModernLayout
2. SidebarLayout
3. MinimalLayout
4. ExecutiveLayout
5. ProfessionalLayout

### Rules
- Never migrate multiple families simultaneously.
- Validate each family end-to-end before moving on.
- Keep runtime fallback to `shared.tsx` until migration is complete.

### Success criteria
- Each family passes visual, DOM, and PDF validation.
- No cross-family regressions introduced.

## Phase 6 — Final Cleanup

### Objective
Remove legacy layout logic from `shared.tsx` and complete the modular architecture.

### Tasks
- Remove layout decision branching from `shared.tsx`.
- Convert `TemplateRegistry.tsx` into metadata-only registry.
- Convert `templateThemes.tsx` into pure visual theme definitions.
- Move remaining layout branch logic into `LayoutEngine.ts`.
- Retain `ResumeDocument.tsx` as the stable public entrypoint.

### Success criteria
- `ResumeDocument.tsx` remains untouched as the stable API.
- PDF generation contract remains unchanged.
- Pagination behavior remains unchanged.
- Layouts are first-class, themes are visual-only.
- Architecture supports new layout families without modifying existing ones.
