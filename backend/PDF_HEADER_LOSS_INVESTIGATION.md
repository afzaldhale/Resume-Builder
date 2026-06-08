# PDF Header Loss Investigation - Complete Audit Plan

## Problem Statement

**Frontend Preview:** ✓ Shows Name, Role, Contact, Career Objective  
**Generated PDF:** ✗ Missing Name, Role, Contact — starts from Career Objective

The header is present in the browser preview but disappears in the PDF export.

## Investigation Strategy

The audit investigates 8 potential root causes in sequence:

### 1️⃣ DOM Snapshot Before PDF Generation
**File:** `1-dom-snapshot.json`

Captures the state of the DOM when Puppeteer first loads the page:
- Checks if `.resume-page` element exists
- Verifies `.resume-theme-root` is present
- Confirms `<header>` element exists
- Extracts actual Name and Role text content

**Why this matters:** If the header isn't in the DOM at this point, the issue is in the React component tree or the print route rendering logic.

---

### 2️⃣ Puppeteer Capture Timing
**File:** `2-pagination-status.json`

Verifies that pagination completes before PDF generation:
- Logs the `__RESUME_PRINT_READY__` signal timing
- Counts total pages detected
- For each page, reports:
  - `scrollHeight` and `clientHeight`
  - Whether it has a `<header>` element
  - What the header contains

**Why this matters:** If pagination removes the header from page 1, or if Puppeteer captures before pagination completes, the PDF will be missing the header.

---

### 3️⃣ Print CSS Inspection
**File:** `3-print-css-audit.json`

Audits all `@media print` rules in the document:
- Finds all print media rules
- Lists sample CSS rules
- Checks computed styles on the header:
  - `display` (looking for `display: none`)
  - `visibility` (looking for `visibility: hidden`)
  - `opacity` (looking for `opacity: 0`)
  - `position` (looking for `position: absolute`)
  - `overflow` (looking for `overflow: hidden`)

**Why this matters:** Print CSS rules might be hiding the header in print mode without affecting the browser preview.

---

### 4️⃣ Page Clipping Detection
**File:** `4-clipping-audit.json`

Measures the bounding rectangles of the first page and header:
- Compares page boundaries with header position
- Detects if header is positioned above the visible page boundary
- Reports `scrollHeight` vs `clientHeight` mismatch

**Why this matters:** The header might exist in the DOM but be positioned outside the clipping boundary of the page container, causing it to be cut off during PDF generation.

---

### 5️⃣ Screenshot Before PDF
**Files:** 
- `5-before-pdf-fullpage.png` (full page with all pages visible)
- `5-before-pdf-viewport.png` (current viewport only)

Captures what Puppeteer actually sees before calling `page.pdf()`:
- Full page screenshot shows all rendered content
- Viewport screenshot shows only the visible area

**Visual Comparison:**
```
✓ Screenshot contains header     → Issue is in page.pdf() rendering
✗ Screenshot missing header      → Issue is in the React render path
```

---

### 6️⃣ Print Route Verification
**File:** `6-route-audit.json`

Audits the print route (`/print/resume?mode=pdf`) rendering:
- Confirms correct URL and query parameters
- Verifies body and HTML classes
- Confirms `ResumePrint` component rendered
- Checks if `pdf-render-mode` class is active
- Verifies `ThemedResumeTemplate` is present

**Why this matters:** An alternate layout or missing component in the print route would cause the header to not be rendered at all.

---

### 7️⃣ PDF Generation & Inspection
**File:** `7-generated.pdf`

The actual generated PDF for manual visual inspection.

Compare:
- `5-before-pdf-fullpage.png` (what we expected in PDF)
- `7-generated.pdf` (what we actually got)

**If they differ:** The issue is in Puppeteer's `page.pdf()` rendering engine.

---

### 8️⃣ Final Verdict Summary
**File:** `8-audit-summary.json`

Aggregates all audit results and provides diagnosis:
```json
{
  "headerInDOM": boolean,
  "headerOnFirstPage": boolean,
  "paginationOccurred": boolean,
  "issue": "NONE | HEADER_NOT_IN_DOM | HEADER_REMOVED_BY_PAGINATION | HEADER_CLIPPED_BY_PAGE"
}
```

---

## How to Run the Audit

### Prerequisites
```bash
# Ensure both frontend and backend servers are running
npm run dev      # Terminal 1: Backend (port 8080 or configured PDF_RENDER_URL)
npm run dev      # Terminal 2: Frontend (port 5173 or proxied to backend)
```

### Execute the Audit
```bash
cd backend

# Run with default sample data
node run-pdf-header-audit.js 1

# Run with specific template
node run-pdf-header-audit.js 3

# Run with custom resume data
node run-pdf-header-audit.js 1 ./test-resume.json
```

### Output
All debug files are written to `backend/debug-output/`:
```
debug-output/
├── 1-dom-snapshot.json
├── 2-pagination-status.json
├── 3-print-css-audit.json
├── 4-clipping-audit.json
├── 5-before-pdf-fullpage.png
├── 5-before-pdf-viewport.png
├── 6-route-audit.json
├── 7-generated.pdf
└── 8-audit-summary.json
```

---

## Interpreting Results

### Case 1: Header in DOM but NOT on First Page
```
✓ headerInDOM: true
✗ headerOnFirstPage: false
```
**Diagnosis:** Pagination is removing the header from page 1  
**Solution:** Check `ResumeDocument.tsx` pagination logic - `headerNodes` should be appended to every page's body, not just the first one.

### Case 2: Header NOT in DOM
```
✗ headerInDOM: false
```
**Diagnosis:** Print route isn't rendering `ResumeHeader`  
**Solution:** Check `ResumePrint.tsx` → `ResumeDocument.tsx` → `ThemedResumeTemplate.tsx` → `renderTemplate()` → ensure `ResumeHeader` is included for both single-column and two-column layouts.

### Case 3: Header Clipped by Page
```
✓ headerInDOM: true
✓ headerOnFirstPage: true
headerRect.top < page.top  OR  headerRect.bottom > page.bottom
```
**Diagnosis:** Header extends beyond page boundaries  
**Solution:** Check CSS constraints on `.resume-page` or page container - ensure padding and sizing allows header to fit.

### Case 4: Header in Screenshot but NOT in PDF
```
✓ 5-before-pdf-fullpage.png contains header
✗ 7-generated.pdf missing header
```
**Diagnosis:** Puppeteer's `page.pdf()` rendering issue  
**Solution:** Check Puppeteer PDF options in `pdfService.js` - verify `printBackground`, `preferCSSPageSize`, margins.

---

## Next Steps After Audit

Once the audit identifies the root cause, use the specific debug file to guide fixes:

1. **If DOM issue:** Review React component rendering in print route
2. **If pagination issue:** Check pagination algorithm in `ResumeDocument.tsx`
3. **If CSS issue:** Add print media fixes to `index.css`
4. **If Puppeteer issue:** Adjust PDF generation options

---

## Files Generated

| File | Purpose | Format |
|------|---------|--------|
| `1-dom-snapshot.json` | DOM state when page loads | JSON |
| `2-pagination-status.json` | Page structure after pagination | JSON |
| `3-print-css-audit.json` | Print CSS rules and computed styles | JSON |
| `4-clipping-audit.json` | Bounding box measurements | JSON |
| `5-before-pdf-fullpage.png` | Full page screenshot | PNG |
| `5-before-pdf-viewport.png` | Viewport screenshot | PNG |
| `6-route-audit.json` | Print route component verification | JSON |
| `7-generated.pdf` | Actual generated PDF | PDF |
| `8-audit-summary.json` | Final diagnosis and summary | JSON |

---

## Cleanup

After investigation, remove debug output:
```bash
rm -rf backend/debug-output
```

---

## Troubleshooting the Audit

### "Timeout waiting for RESUME_PRINT_READY"
- Frontend server not responding or too slow
- Verify `FRONTEND_RENDER_URL` environment variable
- Check browser console for errors

### "No .resume-page found"
- Print route not rendering the expected component structure
- Check React component hierarchy in `ResumePrint.tsx`

### Screenshots blank or missing
- Check Puppeteer permissions
- Verify viewport size hasn't changed
- Ensure browser can render the page

---

## Related Files

- **Print Route:** `frontend/src/components/pages/ResumePrint.tsx`
- **Document Component:** `frontend/src/components/resume-templates/ResumeDocument.tsx`
- **Template Rendering:** `frontend/src/components/resume-templates/shared.tsx`
- **PDF Service:** `backend/src/services/pdfService.js`
- **Print CSS:** `frontend/src/index.css` (lines 389+)
