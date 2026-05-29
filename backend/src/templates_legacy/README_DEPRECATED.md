# ⚠️ DEPRECATED: Backend Template System

## Status: LEGACY (No Longer Used)

This directory contains the **deprecated backend template system**. These files are kept for **reference purposes only** and are **no longer used for PDF generation**.

### Why Deprecated?

- **Single Source of Truth**: React `ResumeDocument` component is now the authoritative template implementation
- **Unified PDF Pipeline**: All PDF generation routes through the frontend `/print/resume` endpoint
- **Simplified Maintenance**: No need to maintain two template systems

### Current PDF Generation Flow

```
ResumeDocument (React) → Frontend /print/resume → Puppeteer Capture → PDF
```

### What Was the Old System?

The files in this directory (template1-15.js) were originally used for server-side HTML template rendering. They've been completely replaced by the React component system.

### When Will These Be Deleted?

After confirmation that PDF generation works correctly for all templates through the frontend pipeline, these legacy files will be removed in a cleanup commit.

### Important: Do Not Use

❌ **DO NOT** import or use any of these template files in new code.

### Migration Complete

All template rendering now happens exclusively in:
- `frontend/src/components/resume-templates/ResumeDocument.tsx` 
- `frontend/src/components/resume-templates/Template*.tsx` (individual template components)

---

**Last Updated**: 2026-05-29  
**Status**: Ready for cleanup after PDF generation validation
