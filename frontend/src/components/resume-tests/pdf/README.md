# PDF Regression Tests

## Purpose
Document the PDF compatibility validation plan for the migration.

## Scope
- Validate PDF output for baseline templates through the existing `pdfService.js` pipeline.
- Ensure page count, page structure, and content preservation remain unchanged.
- Confirm `ResumePrint.tsx` and `ResumeDocument.tsx` contract remains stable.

## Validation Targets
- `window.__RESUME_PRINT_PAYLOAD__` acceptance
- `window.__RESUME_PRINT_READY__` readiness flag
- A4 page count
- Section break behavior
- PDF rendering quality
