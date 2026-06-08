# PDF Header Loss Forensic Trace

## Summary
The forensic trace confirms the header loss occurs during the PDF pagination split stage inside `frontend/src/components/resume-templates/ResumeDocument.tsx`.

## Evidence Collected

| Stage | Observed State | Evidence Source | Conclusion |
|---|---|---|---|
| 1. Print route loaded | `/print/resume?mode=pdf` rendered correctly with `resume-print-mode` and `pdf-render-mode` | `backend/debug-output/6-route-audit.json` | Print route active, correct render-mode classes present |
| 2. DOM snapshot before `page.pdf()` | `.resume-page` and `.resume-theme-root` exist, but no `<header>` element, no name/role text | `backend/debug-output/1-dom-snapshot.json` | Header is missing in final pre-PDF DOM |
| 3. Pagination audit | Single page detected, first page has no `<header>`, headerContent reported as `NO HEADER` | `backend/debug-output/2-pagination-status.json` | Pagination state confirms header removal from page container |
| 4. Visual confirmation | PDF pre-generation screenshot begins with `Professional Summary` and no visible header | `backend/debug-output/5-before-pdf-viewport.png` | Final rendered page shows content starting after header area |

## Root Cause Candidate

The page-level pagination split logic in `frontend/src/components/resume-templates/ResumeDocument.tsx` has a header extraction bug:

- It identifies `sectionElements` by querying `.resume-section` inside the page content wrapper.
- It then walks backward from the first section to collect `headerNodes` only among direct previous siblings.
- In the shared template render structure, the `<header>` is nested inside a wrapper and is not a direct sibling of the first `.resume-section`.
- As a result, `headerNodes` remains empty and the rebuilt page body contains only section content.

This explains why the final PDF DOM keeps the page container but drops the header entirely.

## Relevant Code Location

- `frontend/src/components/resume-templates/ResumeDocument.tsx`
  - `useLayoutEffect` for `renderMode === "pdf"`
  - Header capture block under `const headerNodes: HTMLElement[] = [];`

## Recommended Next Validation Step

To confirm the exact moment of loss, verify that the raw render output before pagination still contains `<header>` in the nested template structure, then compare to the DOM after `ResumeDocument` pagination splits pages.

## Artifact Files

- `backend/debug-output/1-dom-snapshot.json`
- `backend/debug-output/2-pagination-status.json`
- `backend/debug-output/5-before-pdf-viewport.png`
- `backend/debug-output/6-route-audit.json`
- `backend/debug-output/8-audit-summary.json`
