# Visual Regression Tests

## Purpose
Document the visual regression approach for the resume renderer migration.

## Scope
- Baseline comparisons for Template 1, Template 2, Template 4, Template 6, Template 8.
- Rendering snapshots for current renderer vs extracted layout modules.
- Visual diffing for header, sidebar, typography, and section placement.

## Implementation Notes
- Capture screenshots at fixed A4 scale.
- Store baseline images under `frontend/src/components/resume-tests/visual/`.
- Compare against extracted layout renderings in Phase 2.
