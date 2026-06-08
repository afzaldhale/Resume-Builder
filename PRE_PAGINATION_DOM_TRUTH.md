# PRE_PAGINATION_DOM_TRUTH

## Purpose
This report captures the exact runtime DOM state immediately before and after `ResumeDocument` pagination begins for the audited templates.

## Instrumentation
- `frontend/src/components/resume-templates/ResumeDocument.tsx`
  - Captures `window.__PRE_PAGINATION_DOM_TRUTH__.beforePagination` before pagination logic runs.
  - Captures `window.__PRE_PAGINATION_DOM_TRUTH__.afterPagination` after page cleanup and pagination mutation completes.
- `backend/pre-pagination-dom-truth.mjs`
  - Drives the browser to `/print/resume?mode=preview`.
  - Injects payload and waits for runtime instrumentation data.
  - Writes JSON output to `backend/debug-output/`.

## Audited templates
- Template 1
- Template 2
- Template 5
- Template 8
- Template 11

## Results
| Template | Before pagination header count | Before pagination section count | After pagination header count | After pagination section count |
|---|---|---|---|---|
| 1 | 1 | 8 | 0 | 8 |
| 2 | 1 | 8 | 0 | 8 |
| 5 | 1 | 8 | 0 | 8 |
| 8 | 1 | 8 | 0 | 8 |
| 11 | 1 | 8 | 0 | 8 |

## Conclusion
- The header is present in the DOM before pagination begins for all audited templates.
- After pagination completes, the runtime capture shows the header count becomes `0` while the number of `.resume-section` elements remains unchanged.
- This indicates the header is not missing from initial render; it is removed or dropped during `ResumeDocument` pagination.

## Evidence files
- `backend/debug-output/pre-pagination-template-1.json`
- `backend/debug-output/pre-pagination-template-2.json`
- `backend/debug-output/pre-pagination-template-5.json`
- `backend/debug-output/pre-pagination-template-8.json`
- `backend/debug-output/pre-pagination-template-11.json`
- `backend/debug-output/pre-pagination-dom-truth-summary.json`

## Notes
- The audit was performed using the live React/Vite preview runtime.
- No code fixes were applied beyond runtime instrumentation and audit tooling.
