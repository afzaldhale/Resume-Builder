# Resume Builder - Complete Architecture Audit

**Generated:** 2026-06-10  
**Scope:** Full PDF generation, template rendering, pagination, and shared systems  
**Status:** Read-only analysis (no code modifications)

---

## SECTION A — PDF GENERATION

All files involved in PDF export, rendering, download, and preview pipeline:

### Backend PDF Engine

**PDF_GENERATION:**

- [backend/src/services/pdfService.js](backend/src/services/pdfService.js)
  - **Responsibility:** Core PDF generation using Puppeteer. Manages browser launch, page rendering, PDF conversion to blob format. Launches headless Chrome with A4 dimensions (794px × 1123px).
  - **Key Functions:**
    - `generateResumePDF(resumeData, templateId, options)` - Main PDF generation orchestrator
    - `getAvailableTemplates()` - Lists all 15 available templates
    - `isValidTemplateId(templateId)` - Template validation
    - `getTemplateInfo(templateId)` - Template metadata
    - `getTemplatePreview(templateId)` - Preview generation helper
    - `getTemplateStatus(templateId)` - Status check
  - **Used By:** resumeController.js (downloadResumePDF)
  - **Dependencies:** puppeteer (v24.34.0)
  - **Critical Config:**
    - A4_WIDTH_PX = 794
    - A4_HEIGHT_PX = 1123
    - FRONTEND_RENDER_URL = "/print/resume?mode=pdf"
    - Puppeteer options: headless mode, no-sandbox, GPU disabled, color profile forced

- [backend/src/controllers/resumeController.js](backend/src/controllers/resumeController.js)
  - **Responsibility:** HTTP endpoint handler for PDF download requests. Validates user permissions, fetches resume from database, calls pdfService.js.
  - **Key Functions:**
    - `downloadResumePDF(req, res)` - Main endpoint handler (line 406+)
  - **Route:** GET `/api/resumes/:id/pdf`
  - **Used By:** resumeRoutes.js
  - **Process Flow:**
    1. Validates authentication (req.user.id)
    2. Checks download_requests table for "approved" status
    3. Fetches resume_data and template_id from resumes table
    4. Calls generateResumePDF(resumeData, templateId)
    5. Sets HTTP headers (Content-Type: application/pdf, Content-Disposition: attachment)
    6. Sends pdfBuffer to client

- [backend/src/routes/resumeRoutes.js](backend/src/routes/resumeRoutes.js)
  - **Responsibility:** Express routes for resume endpoints. Defines GET `/api/resumes/:id/pdf` route.
  - **Route Definition:** `router.get("/:id/pdf", authenticate, downloadResumePDF)`
  - **Used By:** server.js (main app router)

- [backend/src/database.js](backend/src/database.js)
  - **Responsibility:** MySQL connection pool for database queries.
  - **Used By:** resumeController.js
  - **Query Tables:**
    - `resumes` (id, user_id, title, resume_data, template_id, created_at)
    - `download_requests` (resume_id, user_id, status)

### Frontend PDF Rendering & Preview

- [frontend/src/components/pages/ResumePDF.tsx](frontend/src/components/pages/ResumePDF.tsx)
  - **Responsibility:** Frontend page component for PDF download. Routes through Axios with blob handling.
  - **File Size:** Small (currently contains API service with downloadResumePDF function)
  - **Key Function:** `downloadResumePDF(resumeId)` - Initiates blob download via Axios
  - **Critical Details:**
    - Uses separate Axios instance for blob response (NOT main api instance)
    - Sets `responseType: "blob"` (REQUIRED for PDF)
    - Creates blob, generates download link, triggers click, cleans up
  - **Route:** Path `/resume/:resumeId/pdf`
  - **Used By:** App.tsx routing

- [frontend/src/components/pages/ResumePrint.tsx](frontend/src/components/pages/ResumePrint.tsx)
  - **Responsibility:** Renders resume in print/PDF mode via Puppeteer callback. Waits for resume data via global `window.__RESUME_PRINT_PAYLOAD__`.
  - **Key Features:**
    - Listens for `resume-print-payload` event
    - Validates template ID, applies payload
    - Waits for font loading (document.fonts.ready)
    - Signals ready via `window.__RESUME_PRINT_READY__ = true`
    - Renders ResumeDocument with renderMode="pdf"
  - **Mode Detection:** `searchParams.get("mode") === "pdf"` triggers PDF render mode
  - **Class Names Applied:**
    - `resume-print-mode` (body)
    - `resume-pdf-mode` (documentElement)
    - `pdf-render-mode` (documentElement, if mode=pdf)
    - `resume-print-ready` (when ready for screenshot)
  - **Route:** `/print/resume?mode=pdf` (called by Puppeteer)
  - **Used By:** pdfService.js (via page.goto and page.waitForFunction)

---

## SECTION B — TEMPLATE SYSTEM

### Backend Templates (Server-side HTML)

15 server-side HTML template files for Puppeteer rendering:

**TEMPLATES:**

**Template 1:**
- [backend/src/templates/template1.js](backend/src/templates/template1.js)
  - **Layout:** Single column, centered
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Clean Single Column" - Simple, professional layout with centered content, orange section headers
  - **Key Colors:** Orange (#F58200) for section headers, dark text (#222)

**Template 2:**
- [backend/src/templates/template2.js](backend/src/templates/template2.js)
  - **Layout:** Two-column with left sidebar
  - **Columns:** Multi (40% sidebar, 60% content)
  - **Sidebar:** Yes (dark background, white text)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Corporate Sidebar Blue" - Dark navy sidebar with contact info, skill bars on left
  - **Key Colors:** Dark gray/blue sidebar (#111827, #1f2937), white content area

**Template 3:**
- [backend/src/templates/template3.js](backend/src/templates/template3.js)
  - **Layout:** Single column with colored top heading bar
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Colored Heading Corporate" - Single column with top accent bar for sections

**Template 4:**
- [backend/src/templates/template4.js](backend/src/templates/template4.js)
  - **Layout:** Single column with left accent line
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Left Accent Teal" - Minimalist with left border accent

**Template 5:**
- [backend/src/templates/template5.js](backend/src/templates/template5.js)
  - **Layout:** Two-column sidebar (light)
  - **Columns:** Multi
  - **Sidebar:** Yes (light gray background)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Premium Gray Sidebar" - Gray sidebar variant

**Template 6:**
- [backend/src/templates/template6.js](backend/src/templates/template6.js)
  - **Layout:** Two-column sidebar (teal)
  - **Columns:** Multi
  - **Sidebar:** Yes (teal background)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Professional Sidebar Teal" - Teal colored sidebar

**Template 7:**
- [backend/src/templates/template7.js](backend/src/templates/template7.js)
  - **Layout:** Single column with muted coral styling
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Muted Coral Corporate" - Coral/rose accent colors

**Template 8:**
- [backend/src/templates/template8.js](backend/src/templates/template8.js)
  - **Layout:** Single column, compact spacing
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Compact ATS Single" - ATS-friendly, minimal styling, tight spacing

**Template 9:**
- [backend/src/templates/template9.js](backend/src/templates/template9.js)
  - **Layout:** Two-column sidebar (charcoal)
  - **Columns:** Multi
  - **Sidebar:** Yes (charcoal/dark gray background)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Premium Charcoal Sidebar" - Charcoal dark sidebar

**Template 10:**
- [backend/src/templates/template10.js](backend/src/templates/template10.js)
  - **Layout:** Single column with blue heading bar
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Blue Heading Corporate" - Blue heading bars

**Template 11:**
- [backend/src/templates/template11.js](backend/src/templates/template11.js)
  - **Layout:** Two-column classic (sidebar and content)
  - **Columns:** Multi (35% sidebar, 65% content)
  - **Sidebar:** Yes (dark slate #1e293b)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Classic Two Column" - Classic two-column layout
  - **Sidebar Width:** 35%
  - **Content Width:** 65%

**Template 12:**
- [backend/src/templates/template12.js](backend/src/templates/template12.js)
  - **Layout:** Single column with soft green styling
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Soft Green Corporate" - Green accent colors

**Template 13:**
- [backend/src/templates/template13.js](backend/src/templates/template13.js)
  - **Layout:** Two-column sidebar (rose)
  - **Columns:** Multi
  - **Sidebar:** Yes (rose/pink background)
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Rose Sidebar Corporate" - Rose colored sidebar

**Template 14:**
- [backend/src/templates/template14.js](backend/src/templates/template14.js)
  - **Layout:** Single column with left accent
  - **Columns:** Single
  - **Sidebar:** No
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Minimal Left Accent" - Minimalist with amber accent

**Template 15:**
- [backend/src/templates/template15.js](backend/src/templates/template15.js)
  - **Layout:** Two-column corporate clean
  - **Columns:** Multi
  - **Sidebar:** Yes
  - **Shared Components:** Yes (templateShared.js)
  - **Description:** "Corporate Clean" - Clean corporate two-column

### Shared Backend Template Logic

- [backend/src/templates/templateShared.js](backend/src/templates/templateShared.js)
  - **Responsibility:** Shared HTML generation utilities used by all 15 backend templates.
  - **Key Functions:**
    - `getSummaryConfig(data)` - Returns summaryText and summaryTitle based on candidate type (fresher vs experienced)
    - `renderSupplementarySections(data, options)` - Generates HTML for strengths, achievements, references, customSections
    - `sharedTemplateStyles` - CSS string with shared styling (page-break-inside: avoid, list styles, custom section styles)
  - **Used By:** All template1.js through template15.js
  - **Patterns:**
    - Helper functions: `formatAchievement`, `formatReference`, `formatCustomSection`, `formatSimpleList`
    - Handles edge cases: undefined values, array coercion, empty strings

### Frontend Templates (React Components)

15 React template components for live preview:

- [frontend/src/components/resume-templates/Template1.tsx](frontend/src/components/resume-templates/Template1.tsx)
  - **Responsibility:** React component rendering template 1 (Clean Single Column)
  - **Props:** `{ data: ResumeData }`
  - **Layout:** Single column, centered content (max-width: 600px)
  - **Color Scheme:** Orange (#F58200) section headers
  - **Dependencies:** getSummaryConfig from templatePolicy.tsx

- [frontend/src/components/resume-templates/Template2.tsx](frontend/src/components/resume-templates/Template2.tsx)
  - **Layout:** Two-column sidebar (left dark, right light)

- [frontend/src/components/resume-templates/Template3.tsx](frontend/src/components/resume-templates/Template3.tsx)
  - **Layout:** Single column with colored heading bar

- [frontend/src/components/resume-templates/Template4.tsx](frontend/src/components/resume-templates/Template4.tsx)
  - **Layout:** Single column with left accent line

- [frontend/src/components/resume-templates/Template5.tsx](frontend/src/components/resume-templates/Template5.tsx)
  - **Layout:** Two-column sidebar (light)

- [frontend/src/components/resume-templates/Template6.tsx](frontend/src/components/resume-templates/Template6.tsx)
  - **Layout:** Two-column sidebar (teal)

- [frontend/src/components/resume-templates/Template7.tsx](frontend/src/components/resume-templates/Template7.tsx)
  - **Layout:** Single column (coral)

- [frontend/src/components/resume-templates/Template8.tsx](frontend/src/components/resume-templates/Template8.tsx)
  - **Layout:** Single column compact (ATS-friendly)

- [frontend/src/components/resume-templates/Template9.tsx](frontend/src/components/resume-templates/Template9.tsx)
  - **Layout:** Two-column sidebar (charcoal)

- [frontend/src/components/resume-templates/Template10.tsx](frontend/src/components/resume-templates/Template10.tsx)
  - **Layout:** Single column (blue headers)

- [frontend/src/components/resume-templates/Template11.tsx](frontend/src/components/resume-templates/Template11.tsx)
  - **Layout:** Two-column classic

- [frontend/src/components/resume-templates/Template12.tsx](frontend/src/components/resume-templates/Template12.tsx)
  - **Layout:** Single column (green)

- [frontend/src/components/resume-templates/Template13.tsx](frontend/src/components/resume-templates/Template13.tsx)
  - **Layout:** Two-column sidebar (rose)

- [frontend/src/components/resume-templates/Template14.tsx](frontend/src/components/resume-templates/Template14.tsx)
  - **Layout:** Single column (left accent)

- [frontend/src/components/resume-templates/Template15.tsx](frontend/src/components/resume-templates/Template15.tsx)
  - **Layout:** Two-column corporate

### Template Mapping and Registry

- [frontend/src/components/resume-templates/TemplateRegistry.tsx](frontend/src/components/resume-templates/TemplateRegistry.tsx)
  - **Responsibility:** Central registry mapping template IDs to React components. Single source of truth for template availability.
  - **Key Export:** `TEMPLATE_COMPONENTS: Record<number, ResumeTemplateComponent>`
  - **Functions:**
    - `isValidTemplateId(templateId)` - Boolean validation
    - `getSafeTemplateId(templateId)` - Returns valid ID or defaults to template 1
    - `getTemplateComponent(templateId)` - Returns React component or EmptyTemplate
  - **Used By:** ResumeDocument.tsx, ThemedResumeTemplate.tsx, ResumePrint.tsx

- [frontend/src/components/resume-templates/EmptyTemplate.tsx](frontend/src/components/resume-templates/EmptyTemplate.tsx)
  - **Responsibility:** Fallback template when no data available or invalid template ID
  - **Displays:** "Fill the form to see live preview..."

### Template Theme Configuration

- [frontend/src/components/resume-templates/themeConfig.ts](frontend/src/components/resume-templates/themeConfig.ts)
  - **Responsibility:** Theme configuration for all 15 templates. Maps template IDs to editable color fields.
  - **Exports:**
    - `templateThemeConfigs: Record<number, TemplateThemeConfig>`
    - `PROFESSIONAL_COLOR_PRESETS` - Array of standard professional colors
  - **Config Structure:** TemplateThemeConfig {templateId, editableColors[], defaultColors{}}
  - **Editable Colors by Template Type:**
    - Single bar templates: headingBar, headingText, nameText, bodyText, accent
    - Sidebar templates: sidebarBackground, sidebarText, headingBar, headingText, nameText, titleText
    - Minimal templates: headingText, accentBorder, nameText, bodyText
  - **Used By:** Frontend color customization UI

- [frontend/src/components/resume-templates/templateThemes.ts](frontend/src/components/resume-templates/templateThemes.ts)
  - **Responsibility:** Default theme definitions for all 15 templates.
  - **Type:** `Record<number, ResumeTemplateTheme>`
  - **Theme Properties:**
    - name, layout (single | two-column), headerLayout, headingStyle
    - palette {page, text, mutedText, accent, accentSoft, accentText, border, ...}
    - sidebarWidth, sidebarTone, sidebarSections[], mainSections[]
    - spacing: sectionSpacing, spacingScale
    - typography: fontFamily, typographyScale
  - **Used By:** themeConfig.ts, shared.tsx

---

## SECTION C — SHARED RENDERING LOGIC

All shared files used by multiple templates:

- [frontend/src/components/resume-templates/shared.tsx](frontend/src/components/resume-templates/shared.tsx)
  - **Responsibility:** Core shared rendering logic for all React templates. Renders template-agnostic sections.
  - **File Size:** Large (800+ lines)
  - **Key Exports:**
    - `ResumeTemplateTheme` - Type definition for theme configuration
    - `ResumeSidebarContactCard` - Shared component for sidebar contact info
    - `ResumeSectionLabel` - Helper for section label mapping
    - `renderTemplate(data, theme)` - Main renderer (line 828+)
  - **Functions:**
    - `getContactItems(data)` - Extracts email, phone, address, social links
    - `getSectionLabel(key, summaryTitle)` - Maps section keys to display labels
    - `formatRange(start, end)` - Formats date ranges
    - `uniqueItems(items)` - Deduplicates string arrays
    - `scalePxString(value, factor)` - Scales CSS px values
  - **React Components:**
    - `ResumeSidebarContactCard` - Renders contact section in sidebar (handles dark/light tones)
  - **Used By:** All Template1-15.tsx, ThemedResumeTemplate.tsx
  - **Dependencies:** 
    - templatePolicy.tsx (getSummaryConfig, getCompactMode, getDensityMode, getResumeSectionOrder, isFresherResume)
    - resumeSections.ts (formatMonthYear, hasSectionData, sorting functions)
    - ResumeSection.tsx (section rendering)
    - resumeDesignSystem.ts (typography constants)

- [frontend/src/components/resume-templates/ResumeDocument.tsx](frontend/src/components/resume-templates/ResumeDocument.tsx)
  - **Responsibility:** Master document component that orchestrates PDF rendering, pagination, and theme application. Most critical for multi-page handling.
  - **Props:** `{ templateId, data, renderMode, className }`
  - **Key Features:**
    - Data normalization via `normalizeResumeData(data)`
    - Data fitting via `fitResumeData(normalizedData, { renderMode, compactLevel })`
    - Pagination-first splitting for PDF rendering
    - DOM-based page splitting (treats sections as atomic units)
    - Header cloning for multi-page consistency
  - **Key Functions:**
    - `splitTextIntoChunks(textContent, makePage, currentPageBody, A4_HEIGHT_PX)` - Text overflow handler
    - `cloneHeaderOnly(node, sectionSource)` - Clones section headers for new pages
    - `moveToNewPage()` - Creates new page element
  - **Render Modes:**
    - `"editor-preview"` - Live editor display (no pagination)
    - `"pdf"` - PDF generation mode (full pagination applied)
    - `"thumbnail"` - Thumbnail preview
  - **CSS Classes:**
    - `.resume-document-shell` - Root wrapper
    - `.resume-theme-root` - Theme container
    - `.resume-content` or `[data-resume-content]` - Content wrapper
    - `.resume-section` - Atomic section element
    - `.resume-page` - Page break marker
    - `.resume-page-body-offset` - Multi-page spacing (48px)
  - **Used By:** ResumePrint.tsx, ResumeTemplates.tsx, ResumeBuilder.tsx
  - **Pagination Logic Flowchart:**
    ```
    1. Read initial page height
    2. For each section (atomic unit):
       a. Try to fit in current page
       b. If overflow: create new page, add header clone
       c. If section still overflows: split text by sentences
       d. If sentences still overflow: split by words
    3. Clone and reattach all pages to parent
    ```

- [frontend/src/components/resume-templates/ThemedResumeTemplate.tsx](frontend/src/components/resume-templates/ThemedResumeTemplate.tsx)
  - **Responsibility:** Bridge between template component and theme system. Applies theme to template renderer.
  - **Props:** `{ templateId, data }`
  - **Process:**
    1. Gets template component via `getTemplateComponent(templateId)`
    2. Resolves theme via `resolveTemplateTheme(templateId, data)`
    3. Calls `renderTemplate(data, theme)` from shared.tsx
  - **Used By:** ResumeDocument.tsx

- [frontend/src/components/resume/ResumeSection.tsx](frontend/src/components/resume/ResumeSection.tsx)
  - **Responsibility:** Generic section renderer used by all templates for consistent styling.
  - **Props:** `{ title, theme, sidebar, compactMode, summaryTitle, children }`
  - **Key Features:**
    - Heading variant resolution (full-width-bar, label-bar, underline, plain)
    - Sidebar vs main content styling
    - Full-width bar inset support
    - Responsive heading styles based on theme
  - **Used By:** All templates, shared.tsx

---

## SECTION D — PAGINATION ENGINE

All files responsible for page splitting, multi-page rendering, and page-break calculations:

- [frontend/src/components/resume-templates/ResumeDocument.tsx](frontend/src/components/resume-templates/ResumeDocument.tsx) **(CRITICAL)**
  - **Responsibility:** Main pagination orchestrator (contains 60%+ of pagination logic)
  - **Key Logic:**
    - `useLayoutEffect` hook with renderMode === "pdf" trigger
    - Measures initial scroll height: `if (scrollHeight > A4_HEIGHT_PX + 1) overflow = true`
    - Performs DOM-based split on first render (splitStateRef.current.splitDone flag)
    - Atomic section handling: moves entire sections to new pages without truncation
    - Header cloning: preserves section titles on new pages
    - Handles nested content via recursive splitting
  - **A4 Constants:** 794px width × 1123px height
  - **State Management:**
    - `measurements` - tracks initialScrollHeight, finalScrollHeight, overflow states
    - `compactLevel` - adjusts spacing for fit
    - `splitStateRef` - prevents re-splitting on re-renders
  - **Used By:** ResumePrint.tsx (renderMode="pdf" trigger)

- [frontend/src/utils/splitTextIntoChunks.ts](frontend/src/utils/splitTextIntoChunks.ts)
  - **Responsibility:** Text-level pagination splitter for long text fields that exceed page height.
  - **Algorithm:**
    1. Split text into paragraphs
    2. Try paragraph-level fit
    3. If overflow: split by sentences
    4. If sentences still overflow: split by words
    5. If single word too large: append anyway (avoid infinite loop)
  - **Key Function:** `splitTextIntoChunks(text, makePage, currentPage, A4_HEIGHT_PX, headerClone)`
  - **Return:** Updated currentPageBody reference after splitting
  - **Used By:** ResumeDocument.tsx (for handling long summaries or descriptions)

- [frontend/src/constants/resumeDesignSystem.ts](frontend/src/constants/resumeDesignSystem.ts)
  - **Responsibility:** Page dimensions and typography/spacing constants used by pagination.
  - **Key Constants:**
    ```javascript
    A4_WIDTH_PX = 794
    A4_HEIGHT_PX = 1123
    ResumeTypography = {
      fontFamily: '"Inter", Arial, Helvetica, sans-serif',
      name: 32,
      role: 15,
      heading: 14,
      body: 12,
      small: 10.5,
      lineHeight: 1.4,
    }
    ResumeSpacing = {
      pagePaddingX: 48,
      pagePaddingY: 52,
      sectionGap: 16,
      paragraphGap: 8,
      itemGap: 6,
    }
    ```
  - **Used By:** ResumeDocument.tsx, ResumeSection.tsx, all templates

- [frontend/src/utils/fitResumeData.ts](frontend/src/utils/fitResumeData.ts)
  - **Responsibility:** Data transformation to preserve all content (no truncation). Supports different render modes.
  - **Function:** `fitResumeData(resumeData, options) → ResumeData`
  - **Modes Supported:**
    - `"editor-preview"` - Full content
    - `"pdf"` - Full content (no truncation, pagination handles overflow)
    - `"thumbnail"` - Full content
  - **Comment:** "Phase 11: Preserve all user content. Remove truncation, slicing, and any '(+N more)' markers. Pagination is handled by the renderer."
  - **Used By:** ResumeDocument.tsx

- [frontend/src/components/resume-templates/templatePolicy.tsx](frontend/src/components/resume-templates/templatePolicy.tsx)
  - **Responsibility:** Content density and layout policy. Determines if content requires compact mode based on volume.
  - **Key Functions:**
    - `getCompactMode(data)` - Returns boolean (true if compactLevel > 0 OR density !== comfortable)
    - `getDensityMode(data)` - Returns "comfortable" | "compact" | "ultra-compact"
    - `getContentScore(data)` - Calculates content volume score
  - **Content Score Calculation:**
    - Summary/objective: length/120
    - Role: length/40
    - Address: length/60
    - Experience: count × 1.5
    - Projects: count × 1.2
    - Education: count × 0.9
    - (and more weighted categories)
  - **Threshold Logic:**
    - Fresher: score ≥ 18 = compact; score ≥ 11 = compact; else comfortable
    - Experienced: score ≥ 18 = ultra-compact; score ≥ 11 = compact; else comfortable
  - **Used By:** ResumeDocument.tsx (determines if spacing compression needed)

---

## SECTION E — TEMPLATE DEPENDENCY MAP

```
Resume Builder Architecture
│
├── PDF Generation Layer
│   ├── backend/src/services/pdfService.js (Puppeteer orchestrator)
│   ├── backend/src/controllers/resumeController.js (HTTP handler)
│   ├── backend/src/routes/resumeRoutes.js (Route definition)
│   └── backend/src/database.js (Data access)
│
├── Rendering Pipeline
│   ├── frontend/src/components/pages/ResumePrint.tsx (Print mode trigger)
│   ├── frontend/src/components/resume-templates/ResumeDocument.tsx (Pagination master)
│   ├── frontend/src/components/resume-templates/ThemedResumeTemplate.tsx (Theme application)
│   └── frontend/src/components/resume-templates/shared.tsx (Shared renderer)
│
├── Backend Template System (Server-side HTML)
│   ├── backend/src/templates/template1.js through template15.js (HTML generators)
│   └── backend/src/templates/templateShared.js (Shared HTML utilities)
│
├── Frontend Template System (React Components)
│   ├── frontend/src/components/resume-templates/Template1.tsx through Template15.tsx
│   ├── frontend/src/components/resume-templates/TemplateRegistry.tsx (Component registry)
│   ├── frontend/src/components/resume-templates/themeConfig.ts (Theme config)
│   └── frontend/src/components/resume-templates/templateThemes.ts (Theme definitions)
│
├── Pagination Engine
│   ├── frontend/src/components/resume-templates/ResumeDocument.tsx (DOM splitter)
│   ├── frontend/src/utils/splitTextIntoChunks.ts (Text splitter)
│   └── frontend/src/constants/resumeDesignSystem.ts (Dimensions & typography)
│
├── Layout & Spacing Policy
│   ├── frontend/src/components/resume-templates/templatePolicy.tsx (Density policy)
│   ├── frontend/src/components/resume-templates/resumeSections.ts (Section order & formatting)
│   └── frontend/src/components/resume/ResumeSection.tsx (Section renderer)
│
├── Data Management
│   ├── frontend/src/utils/fitResumeData.ts (Data fitting)
│   ├── backend/src/utils/resumeValidation.js (Payload validation)
│   └── frontend/src/components/resume-templates/types.ts (TypeScript types)
│
└── Theme System
    ├── frontend/src/components/resume-templates/themeConfig.ts (Config)
    ├── frontend/src/components/resume-templates/templateThemes.ts (Definitions)
    └── frontend/src/components/pages/ResumePDF.tsx (Download helper)
```

---

## SECTION F — HIGH RISK FILES

Files where a single change can affect multiple templates or critical functionality:

**HIGH_RISK_FILES:**

1. **[frontend/src/components/resume-templates/ResumeDocument.tsx](frontend/src/components/resume-templates/ResumeDocument.tsx)**
   - **Risk Level:** CRITICAL
   - **Reason:** Contains 60%+ of pagination logic. Used by ALL templates. Changes affect all multi-page rendering.
   - **Affects Templates:** All 15 templates + all render modes
   - **Impact Categories:**
     - Page break calculations
     - Multi-page header cloning
     - Text overflow splitting
     - Compact mode determination
   - **Change Examples to Avoid:**
     - Modifying A4_HEIGHT_PX threshold logic
     - Changing scrollHeight overflow detection
     - Altering section atomicity logic
     - Modifying header cloning patterns
   - **Safe Changes:** Template-agnostic utility functions, error handling

2. **[frontend/src/components/resume-templates/shared.tsx](frontend/src/components/resume-templates/shared.tsx)**
   - **Risk Level:** CRITICAL
   - **Reason:** Shared renderer used by ALL 15 React template components. Core rendering logic.
   - **Affects Templates:** All 15 templates
   - **Impact Categories:**
     - Typography and spacing
     - Contact card rendering
     - Section layout
     - Theme application
   - **Change Examples to Avoid:**
     - Modifying `renderTemplate()` signature or output
     - Changing `ResumeSidebarContactCard` layout
     - Altering font size calculations
   - **Safe Changes:** Adding new helper functions, improving existing utilities

3. **[backend/src/templates/templateShared.js](backend/src/templates/templateShared.js)**
   - **Risk Level:** HIGH
   - **Reason:** Imported by ALL 15 backend template files. Shared HTML/CSS utilities.
   - **Affects Templates:** All 15 backend templates
   - **Impact Categories:**
     - HTML generation for supplementary sections
     - Shared CSS styling
     - Formatting helpers
   - **Change Examples to Avoid:**
     - Modifying `getSummaryConfig()` logic
     - Changing `sharedTemplateStyles` CSS
     - Altering supplementary section rendering
   - **Safe Changes:** Adding helper functions, improving edge case handling

4. **[backend/src/services/pdfService.js](backend/src/services/pdfService.js)**
   - **Risk Level:** CRITICAL
   - **Reason:** Core PDF generation engine. All PDF exports depend on this.
   - **Affects Templates:** All 15 templates
   - **Puppeteer Configuration:**
     - Browser launch options affect PDF output quality
     - Viewport dimensions (794×1123) critical for page breaks
     - Font readiness waiting affects rendering completeness
   - **Change Examples to Avoid:**
     - Modifying A4 dimensions
     - Changing Puppeteer args (could affect rendering)
     - Altering waitForFunction timeouts
     - Changing page.pdf() options
   - **Safe Changes:** Adding debug logging, improving error messages

5. **[frontend/src/constants/resumeDesignSystem.ts](frontend/src/constants/resumeDesignSystem.ts)**
   - **Risk Level:** HIGH
   - **Reason:** Contains A4 page dimensions (794×1123) and typography constants used across system.
   - **Affects:** All templates, pagination, spacing calculations
   - **Critical Constants:**
     - A4_WIDTH_PX = 794 (used in pagination threshold)
     - A4_HEIGHT_PX = 1123 (used in pagination threshold)
     - Typography scale factors
   - **Change Examples to Avoid:**
     - Changing A4 dimensions (breaks pagination)
     - Modifying font sizes (affects page overflow calculations)
     - Altering line heights (impacts content fitting)
   - **Safe Changes:** Adding new constants, documentation

6. **[frontend/src/components/resume-templates/TemplateRegistry.tsx](frontend/src/components/resume-templates/TemplateRegistry.tsx)**
   - **Risk Level:** HIGH
   - **Reason:** Single source of truth for template component mapping. If broken, no templates render.
   - **Affects Templates:** All 15 templates
   - **Critical Export:** `TEMPLATE_COMPONENTS: Record<number, ResumeTemplateComponent>`
   - **Change Examples to Avoid:**
     - Removing template from TEMPLATE_COMPONENTS
     - Changing getSafeTemplateId() fallback logic
     - Modifying template ID validation
   - **Safe Changes:** Adding new templates (with full implementation)

7. **[frontend/src/utils/fitResumeData.ts](frontend/src/utils/fitResumeData.ts)**
   - **Risk Level:** HIGH
   - **Reason:** Controls data transformation before rendering. Affects content visibility across all templates.
   - **Affects Templates:** All 15 templates
   - **Critical Behavior:** Preserves all user content (no truncation, Phase 11 requirement)
   - **Change Examples to Avoid:**
     - Truncating arrays
     - Slicing strings
     - Removing content sections
   - **Safe Changes:** Adding new data transformations that preserve content

8. **[frontend/src/components/resume-templates/themeConfig.ts](frontend/src/components/resume-templates/themeConfig.ts)**
   - **Risk Level:** MEDIUM
   - **Reason:** Theme configuration used by frontend. Changes affect all 15 templates' color customization.
   - **Affects Templates:** All 15 templates (indirectly via theme system)
   - **Change Examples to Avoid:**
     - Removing editable color options
     - Changing default colors globally
   - **Safe Changes:** Adding new color presets, improving config organization

9. **[frontend/src/utils/splitTextIntoChunks.ts](frontend/src/utils/splitTextIntoChunks.ts)**
   - **Risk Level:** MEDIUM-HIGH
   - **Reason:** Text-level pagination splitter. Affects long-text content (summaries, descriptions).
   - **Affects:** Templates with text-heavy sections (all templates potentially)
   - **Change Examples to Avoid:**
     - Modifying A4_HEIGHT_PX threshold logic
     - Changing paragraph/sentence/word splitting algorithm
     - Altering page creation callback
   - **Safe Changes:** Improving edge case handling, adding debug info

10. **[backend/src/controllers/resumeController.js](backend/src/controllers/resumeController.js)**
    - **Risk Level:** MEDIUM
    - **Reason:** PDF download endpoint. Database queries and PDF generation orchestration.
    - **Affects:** PDF download feature for all templates
    - **Change Examples to Avoid:**
      - Changing download_requests table query logic
      - Altering resumeData JSON parsing
      - Modifying template ID extraction
    - **Safe Changes:** Adding logging, improving error handling

---

## SECTION G — RECOMMENDED BOUNDARIES

Files classified by their responsibility scope:

### GLOBAL (Used by Multiple Templates / Core System)

**CRITICAL GLOBAL:**
- [frontend/src/components/resume-templates/ResumeDocument.tsx](frontend/src/components/resume-templates/ResumeDocument.tsx) — Pagination orchestrator
- [frontend/src/components/resume-templates/shared.tsx](frontend/src/components/resume-templates/shared.tsx) — Shared renderer
- [backend/src/services/pdfService.js](backend/src/services/pdfService.js) — PDF generation engine

**HIGH GLOBAL:**
- [frontend/src/constants/resumeDesignSystem.ts](frontend/src/constants/resumeDesignSystem.ts) — Page dimensions, typography
- [frontend/src/components/resume-templates/TemplateRegistry.tsx](frontend/src/components/resume-templates/TemplateRegistry.tsx) — Template registry
- [frontend/src/utils/fitResumeData.ts](frontend/src/utils/fitResumeData.ts) — Data transformation
- [backend/src/templates/templateShared.js](backend/src/templates/templateShared.js) — Shared HTML utilities
- [frontend/src/components/resume-templates/themeConfig.ts](frontend/src/components/resume-templates/themeConfig.ts) — Theme configuration

**MEDIUM GLOBAL:**
- [frontend/src/components/resume-templates/templatePolicy.tsx](frontend/src/components/resume-templates/templatePolicy.tsx) — Density policy
- [frontend/src/components/resume-templates/resumeSections.ts](frontend/src/components/resume-templates/resumeSections.ts) — Section order & formatting
- [frontend/src/utils/splitTextIntoChunks.ts](frontend/src/utils/splitTextIntoChunks.ts) — Text pagination
- [frontend/src/components/resume-templates/templateThemes.ts](frontend/src/components/resume-templates/templateThemes.ts) — Theme definitions

### TEMPLATE_SPECIFIC (Single Template Only)

**Frontend Template Components:**
- [frontend/src/components/resume-templates/Template1.tsx](frontend/src/components/resume-templates/Template1.tsx) — TEMPLATE_SPECIFIC
- [frontend/src/components/resume-templates/Template2.tsx](frontend/src/components/resume-templates/Template2.tsx) — TEMPLATE_SPECIFIC
- ... (Template3.tsx through Template15.tsx) — TEMPLATE_SPECIFIC

**Backend Template Components:**
- [backend/src/templates/template1.js](backend/src/templates/template1.js) — TEMPLATE_SPECIFIC
- [backend/src/templates/template2.js](backend/src/templates/template2.js) — TEMPLATE_SPECIFIC
- ... (template3.js through template15.js) — TEMPLATE_SPECIFIC

**Characteristics of TEMPLATE_SPECIFIC files:**
- Used by exactly ONE template
- Changes only affect that template
- Safe to modify without affecting other templates
- Examples:
  - Template1.tsx layout: single column, orange headers
  - Template11.js HTML: 35% sidebar, 65% content split
  - Template8.tsx styling: compact ATS-friendly

### SUPPORTING (Routes, Controllers, Data)

**GLOBAL:**
- [backend/src/routes/resumeRoutes.js](backend/src/routes/resumeRoutes.js) — Route definitions
- [backend/src/controllers/resumeController.js](backend/src/controllers/resumeController.js) — HTTP handlers
- [backend/src/database.js](backend/src/database.js) — Database access
- [frontend/src/components/resume-templates/types.ts](frontend/src/components/resume-templates/types.ts) — TypeScript types
- [backend/src/utils/resumeValidation.js](backend/src/utils/resumeValidation.js) — Input validation

**RENDERING-SPECIFIC:**
- [frontend/src/components/pages/ResumePrint.tsx](frontend/src/components/pages/ResumePrint.tsx) — Print mode trigger
- [frontend/src/components/pages/ResumePDF.tsx](frontend/src/components/pages/ResumePDF.tsx) — PDF download UI
- [frontend/src/components/resume-templates/ThemedResumeTemplate.tsx](frontend/src/components/resume-templates/ThemedResumeTemplate.tsx) — Theme application bridge
- [frontend/src/components/resume-templates/EmptyTemplate.tsx](frontend/src/components/resume-templates/EmptyTemplate.tsx) — Fallback
- [frontend/src/components/resume-templates/TemplateSelector.tsx](frontend/src/components/resume-templates/TemplateSelector.tsx) — UI selector
- [frontend/src/components/resume/ResumeSection.tsx](frontend/src/components/resume/ResumeSection.tsx) — Section component

---

## SECTION H — MODIFICATION SAFETY GUIDE

### ✅ SAFE TO MODIFY

1. **Individual Template Files (Template1.tsx through Template15.tsx, template1.js through template15.js)**
   - Rationale: Changes isolated to single template
   - Examples: Changing colors, adjusting spacing, modifying section order
   - Impact: Only that template affected

2. **Error Handling & Logging in Global Files**
   - Safe in: pdfService.js, resumeController.js, ResumeDocument.tsx
   - Examples: Adding console.log, improving error messages
   - Impact: No functional change to rendering

3. **New Utility Functions in Global Files**
   - Safe in: shared.tsx, templateShared.js, resumeSections.ts
   - Examples: Adding helper functions, improving formatting
   - Impact: Existing functionality unchanged if old functions preserved

4. **CSS/Styling Additions (Not Changes)**
   - Safe: Adding new CSS classes
   - Unsafe: Modifying existing class styles that multiple templates use

### ⚠️ RISKY TO MODIFY

1. **Pagination Logic (ResumeDocument.tsx)**
   - Risk: Changes can break multi-page rendering across all templates
   - Examples: Modifying splitStateRef logic, changing overflow detection
   - Mitigation: Test thoroughly with all templates, all content volumes

2. **A4 Dimensions (resumeDesignSystem.ts, pdfService.js)**
   - Risk: Page break calculations depend on exact dimensions
   - Examples: Changing 794 or 1123
   - Mitigation: If dimensions change, update all pagination thresholds

3. **Shared Renderer (shared.tsx, templateShared.js)**
   - Risk: Changes affect rendering for all 15 templates
   - Examples: Changing renderTemplate() output, modifying contact card
   - Mitigation: Test all templates after changes

4. **Theme Configuration (themeConfig.ts, templateThemes.ts)**
   - Risk: Theme changes affect color system globally
   - Examples: Removing color options, changing palette structure
   - Mitigation: Maintain backward compatibility

### 🚫 DANGEROUS TO MODIFY

1. **TemplateRegistry.tsx**
   - Danger: Breaking this breaks ALL templates
   - Do not: Remove templates, change TEMPLATE_COMPONENTS structure

2. **fitResumeData.ts**
   - Danger: Truncating data causes content loss in PDF
   - Do not: Slice arrays, remove sections

3. **PDF Generation Pipeline** (pdfService.js → ResumePrint.tsx → ResumeDocument.tsx)
   - Danger: Breaking any step breaks PDF export entirely
   - Do not: Alter Puppeteer configuration, change render mode detection

4. **TypeScript Types** (types.ts, shared.tsx)
   - Danger: Type changes can break template rendering
   - Do not: Remove required fields from ResumeData

---

## SECTION I — CODEBASE STATISTICS

### File Count
- **Frontend Template Files:** 15 React components + 8 supporting files = 23 files
- **Backend Template Files:** 15 HTML generators + 1 shared file = 16 files
- **Pagination/Spacing System:** 5 files
- **Theme System:** 3 files
- **Routing/Controllers:** 3 files
- **Utilities:** 4 files
- **Types & Configuration:** 3 files
- **UI Components:** 1 file
- **Total Core Files:** ~58 files

### Lines of Code (Estimated)
- **ResumeDocument.tsx:** ~350 lines (pagination master)
- **shared.tsx:** ~900 lines (shared renderer)
- **Each Template (React):** ~100-150 lines
- **Each Template (Backend):** ~100-150 lines
- **pdfService.js:** ~200 lines
- **Backend Controllers:** ~400 lines

### Template Distribution
- **Single Column:** 7 templates (1, 3, 4, 7, 8, 10, 12, 14)
- **Two-Column Sidebar:** 8 templates (2, 5, 6, 9, 11, 13, 15, and Template with multi-column layout)
- **Color Schemes:**
  - Dark Sidebars: 6 templates (2, 6, 9, 11)
  - Light Sidebars: 3 templates (5, 13, 15)
  - Single Column with Bars/Accents: 7 templates (1, 3, 4, 7, 8, 10, 12, 14)

---

## SECTION J — KEY ARCHITECTURAL DECISIONS

### 1. Dual Template System (Backend + Frontend)

**Decision:** Maintain separate HTML templates (backend) and React components (frontend)

**Rationale:**
- Backend templates (template1.js-15.js): Used by Puppeteer for PDF generation
- Frontend templates (Template1.tsx-15.tsx): Used for live preview in editor
- Allows independent evolution but requires synchronization

**Impact:**
- Must keep backend and frontend templates in sync
- Changes to layout must be made in BOTH files
- Risk: Misalignment between preview and PDF output

### 2. Pagination at DOM Level (Not CSS Page Breaks)

**Decision:** Use JavaScript DOM manipulation for pagination, not CSS `page-break-*` or `:after` pseudo-elements

**Rationale:**
- CSS page breaks are unpredictable with dynamic content
- DOM-based splitting allows atomic section handling
- Enables header cloning for consistent multi-page headers
- Precise control over page overflow

**Trade-off:**
- More complex code in ResumeDocument.tsx
- Manual page creation and cloning required
- Requires explicit A4 dimension management

### 3. Atomic Section Model

**Decision:** Treat entire sections as atomic units (don't split sections across pages)

**Rationale:**
- Avoids orphaned section titles
- Maintains visual hierarchy
- Improves readability in multi-page resumes

**Trade-off:**
- First page might have less content to fit full section
- Whitespace might appear at bottom of pages
- Large sections might start on new page

### 4. Global Design System Constants

**Decision:** Centralize A4 dimensions, typography, and spacing in resumeDesignSystem.ts

**Rationale:**
- Single source of truth for measurements
- Ensures consistency across all templates
- Easy to adjust globally

**Trade-off:**
- All templates tightly coupled to these constants
- Changing dimensions requires updates in multiple files

### 5. Shared Utilities Over Template-Specific Logic

**Decision:** Extract common rendering logic to shared.tsx and templateShared.js

**Rationale:**
- Reduces code duplication
- Ensures consistency across templates
- Easier maintenance and updates

**Trade-off:**
- Higher complexity in shared.tsx
- Templates depend on shared utility functions
- Changes to shared utils affect all templates

### 6. Theme Configuration System

**Decision:** Implement theme system with editable colors and layout properties

**Rationale:**
- Allows color customization per template
- Enables future dark mode, custom themes
- Separates design concerns from logic

**Trade-off:**
- Additional layer of indirection
- Theme config must match template implementation
- Risk of config/template mismatch

---

## CONCLUSION

This Resume Builder implements a sophisticated multi-template system with:

1. **15 Professional Resume Templates** organized as single-column and two-column layouts
2. **Dual-System Architecture** (Backend HTML + Frontend React) for PDF rendering and preview
3. **Advanced Pagination Engine** using DOM-based atomic section splitting
4. **Shared Rendering Framework** ensuring consistency across all templates
5. **Configurable Theme System** for color customization
6. **Strict Type Safety** with comprehensive TypeScript definitions

**Most Critical Files (in order of impact):**
1. ResumeDocument.tsx (pagination)
2. shared.tsx (rendering)
3. pdfService.js (PDF generation)
4. TemplateRegistry.tsx (template routing)

**Safest Files to Modify:**
- Individual Template1-15.tsx and template1-15.js files
- New utilities in shared.tsx or templateShared.js
- Error handling and logging in core files

**Most Dangerous Files to Modify:**
- A4 dimensions in any location
- Pagination logic in ResumeDocument.tsx
- fitResumeData truncation logic
- TypeScript type definitions
