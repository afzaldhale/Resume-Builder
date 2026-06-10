# Visual Regression Report

## Purpose
Document the visual regression strategy for migrating from the monolithic `shared.tsx` renderer to modular layout families.

## Current Status
- Current renderer is `shared.tsx`.
- Extracted layout families are not yet active in production.
- Visual parity must be preserved at pixel level.

## Baseline Templates
The first visual regression targets are:
- Template 1
- Template 2
- Template 4
- Template 6
- Template 8

## Comparison Strategy
For each baseline template:
1. Render the current production output via `shared.tsx`.
2. Render the extracted layout output from the new `resume-layouts/` component.
3. Capture comparison screenshots at identical viewport / print scale.
4. Compare via pixel diff and semantic DOM checks.

## Snapshot Pairs
- `visual/Template1.current.png` vs `visual/Template1.extracted.png`
- `visual/Template2.current.png` vs `visual/Template2.extracted.png`
- `visual/Template4.current.png` vs `visual/Template4.extracted.png`
- `visual/Template6.current.png` vs `visual/Template6.extracted.png`
- `visual/Template8.current.png` vs `visual/Template8.extracted.png`

## Validation Axes
- Header appearance and positioning
- Section order and header labels
- Sidebar presence, width, and section order
- Typography size, weight, and line spacing
- Card / accent treatment placement
- Page margins and A4 shell positioning

## Acceptance Criteria
- No visible pixel delta outside known safe tolerance.
- No style drift in header, sidebar, or body text.
- No structural DOM regressions in section wrappers.
- No difference in page break behavior for baseline fixtures.

## Implementation Notes
- The extracted layout modules must be rendered through a comparison harness, not through production rendering.
- Visual regression artifacts should be captured under `frontend/src/components/resume-tests/visual/`.
- The first successful comparison set is the gate for Phase 4 controlled migration.

## Report Status
- This document defines the visual regression plan.
- Actual screenshot artifacts are to be produced during Phase 2 and referenced here.
