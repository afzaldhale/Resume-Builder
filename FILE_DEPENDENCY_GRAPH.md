# File Dependency Graph

## Current Production Dependency Graph

- `ResumeBuilder.tsx`
  - imports `ResumeDocument.tsx`
- `ResumeDocument.tsx`
  - imports `ThemedResumeTemplate.tsx`
  - imports `TemplateRegistry.tsx` for `getSafeTemplateId`
  - contains pagination and render-mode orchestration
- `ThemedResumeTemplate.tsx`
  - imports `shared.tsx` for `renderTemplate`
  - imports `themeConfig.ts` for `resolveTemplateTheme`
- `shared.tsx`
  - exports `renderTemplate`
  - exports `ResumePage`, `ResumeHeader`, `ResumeSidebar`, `ResumeTwoColumnLayout`, and section helpers
  - depends on `ResumeSection` and `ResumeTypography`
- `themeConfig.ts`
  - imports `templateThemes.tsx`
  - merges editable colors into theme palette
- `templateThemes.tsx`
  - defines template palettes, typography, spacing, layout hints, sidebar keys, and section order
- `TemplateRegistry.tsx`
  - imports `Template1`..`Template15`
  - exports `TEMPLATE_IDS`, `getSafeTemplateId`, `isValidTemplateId`
  - currently not part of the active renderer path beyond id validation

## Proposed Stable Dependency Graph

- `ResumeBuilder.tsx`
  - unchanged
- `ResumeDocument.tsx`
  - unchanged public entrypoint
  - continues to host pagination and render-mode state
- `ThemedResumeTemplate.tsx`
  - becomes the layout dispatcher
  - imports `LayoutEngine.ts`
  - imports `ThemeEngine.ts`
  - imports `TemplateMetadata.ts`
- `resume-shared/LayoutEngine.ts`
  - selects layout family for a template
  - imports `TemplateMetadata.ts`
  - imports layout components from `resume-layouts/`
  - imports `SectionBuilder.ts`
  - imports `ResumeTypography.ts`
- `resume-shared/ThemeEngine.ts`
  - imports `templateThemes.tsx`
  - exposes pure theme resolution and color merge
- `resume-shared/SectionBuilder.ts`
  - imports `resume-templates/types.ts`
  - exports section map and ordering helpers
- `resume-shared/ResumeTypography.ts`
  - exports typography scale and density helpers
- `resume-shared/TemplateMetadata.ts`
  - exports `TEMPLATE_IDS`, `isValidTemplateId`, `getSafeTemplateId`
  - exports template family mapping
- `resume-layouts/ModernLayout.tsx`
  - imports `ThemeEngine.ts`, `SectionBuilder.ts`, `ResumeHeader.tsx`, `ResumeSection.tsx`
  - renders single-column modern layout
- `resume-layouts/SidebarLayout.tsx`
  - imports `ThemeEngine.ts`, `SectionBuilder.ts`, `ResumeSidebar.tsx`, `ResumeHeader.tsx`, `ResumeSection.tsx`
  - renders two-column sidebar layouts
- `resume-layouts/MinimalLayout.tsx`
  - imports `ThemeEngine.ts`, `SectionBuilder.ts`, `ResumeHeader.tsx`, `ResumeSection.tsx`
  - renders minimalist single-column layout
- `resume-layouts/ExecutiveLayout.tsx`
  - imports `ThemeEngine.ts`, `SectionBuilder.ts`, `ResumeHeader.tsx`, `ResumeSection.tsx`
  - renders compact single-column layout
- `resume-layouts/ProfessionalLayout.tsx`
  - imports `ThemeEngine.ts`, `SectionBuilder.ts`, `ResumeSidebar.tsx`, `ResumeHeader.tsx`, `ResumeSection.tsx`
  - renders contact-only sidebar layout
- `templateThemes.tsx`
  - becomes pure theme token source
  - no layout metadata in final architecture

## Compatibility / Transitional Graph

While migrating:
- `shared.tsx` remains the fallback source of truth
- new layout files are introduced in parallel
- `ThemedResumeTemplate.tsx` may switch one family at a time
- `shared.tsx` remains available until final cleanup

## Notes
- `ResumeDocument.tsx` is explicitly preserved as the stable public interface.
- `ResumePrint.tsx` and `pdfService.js` remain unchanged.
- `TemplateRegistry.tsx` transitions to a metadata-only role and must not import unused template components once migration is complete.
