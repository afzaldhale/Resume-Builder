# PDF Compatibility Report

## Purpose
Verify that PDF rendering remains unchanged while migrating the resume renderer to a layout-driven architecture.

## Current PDF Contract
- Entry route: `frontend/src/components/pages/ResumePrint.tsx`
- Public render entrypoint: `frontend/src/components/resume-templates/ResumeDocument.tsx`
- Backend generator: `backend/src/services/pdfService.js`
- Render mode: `renderMode="pdf"`
- Contract flags: `window.__RESUME_PRINT_PAYLOAD__`, `window.__RESUME_PRINT_READY__`
- Page size: A4
- Margin config: zero margins inside Puppeteer PDF

## Validation Matrix

| Template | Fixture | Expected PDF Behavior | Checkpoints |
|---|---|---|---|
| Template 1 | Normal resume | same page count, same section order | `ResumePrint` loads, page count stable, `__RESUME_PRINT_READY__` true |
| Template 2 | Long multi-page resume | correct sidebar/main split across pages | no header duplication issues, page count stable |
| Template 4 | Stress resume | no truncated sections, accent line preserved | content preserved across page breaks |
| Template 6 | Normal resume | contact-only sidebar preserved | sidebar content present, main content paginates correctly |
| Template 8 | Long multi-page resume | compact layout remains dense and page count stable | typography and header structure preserved |

## PDF Compatibility Checks

### Contract preservation
- Do not change `ResumePrint.tsx` or `pdfService.js`.
- `ResumeDocument.tsx` remains the stable public interface.
- `renderMode="pdf"` behavior must stay identical.

### Rendering checks
- `window.__RESUME_PRINT_PAYLOAD__` is accepted and applied.
- `window.__RESUME_PRINT_READY__` is set after render completion.
- `.resume-page` elements are present and count is stable.
- No page exceeds A4 height beyond acceptable threshold.
- No orphaned section headers are introduced.

### Output checks
- PDF generation works with Puppeteer using the existing service.
- The exported PDF maintains A4 dimensions.
- Print background, layout, and typography are preserved.

## Risk items
- Any change to page shell or page size in `ResumeDocument.tsx` is a hard no.
- Any layout extraction that changes section wrapper classes may alter pagination behavior.
- Sidebar layout changes must preserve `ResumeSidebar` DOM semantics.

## Acceptance Criteria
- Existing PDF output remains bit-for-bit equivalent for baseline fixtures where possible.
- Page count does not regress.
- Section order and header structure remain unchanged.
- No PDF pipeline changes are introduced.

## Report Status
- This file defines the PDF compatibility validation plan.
- Actual PDF comparison artifacts should be produced during Phase 3 and Phase 4.
