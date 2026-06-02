# PHASE 8: CENTRALIZATION IMPLEMENTATION PLAN

## Overview
Consolidate repeated CSS patterns and components across 15 resume templates into shared modules.

## Current State
- Total Template Code: 145.13 KB (5854 lines)
- Duplicated Patterns: 0
- Affected Templates: 0

## Potential Savings
- **Bytes:** 0 bytes
- **KB:** 0.00 KB
- **Reduction:** 0.0% of template code

## Recommended Components to Extract



## Implementation Steps

### Step 1: Create Component Library in templateShared.js
```javascript
// Add to backend/src/templates/templateShared.js

export const resumeTypography = {
  name: { fontSize: '28px', fontWeight: 700, lineHeight: 1.1 },
  role: { fontSize: '15px', fontWeight: 600, lineHeight: 1.3 },
  body: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5 },
  sectionTitle: { fontSize: '14px', fontWeight: 700, lineHeight: 1.2 },
  // ... more typography presets
};

export const layoutDimensions = {
  A4_WIDTH: 794,
  A4_HEIGHT: 1123,
  SIDEBAR_MIN_WIDTH: 220,
  SIDEBAR_40_PERCENT: 0.40,
  SIDEBAR_35_PERCENT: 0.35,
  SIDEBAR_30_PERCENT: 0.30,
  SIDEBAR_FIXED_230: 230,
  SIDEBAR_FIXED_220: 220,
};

export const spacingPresets = {
  SECTION_GAP: '16px',
  ITEM_GAP: '8px',
  PADDING_STANDARD: '32px',
  // ... more spacing constants
};
```

### Step 2: Update Templates to Use Shared Components
Templates to update:


### Step 3: Validation Checklist
- [ ] All typography rules centralized
- [ ] All layout dimensions centralized
- [ ] All spacing rules centralized
- [ ] Page break rules complete (already done)
- [ ] Re-generate PDFs for all templates
- [ ] Compare PDFs to pre-centralization versions
- [ ] Verify no visual regressions
- [ ] Run A4 safety tests again
- [ ] Confirm PDF parity maintained

## Success Criteria
- ✅ All shared patterns moved to templateShared.js
- ✅ No code duplication in individual templates
- ✅ Templates down to <4KB each (from ~9.1KB)
- ✅ All PDFs unchanged visually
- ✅ A4 compliance maintained
- ✅ PDF parity confirmed

## Rollback Plan
If issues occur:
1. Revert templateShared.js changes
2. Restore individual template files from backup
3. Run regression tests
4. Document what went wrong

## Next Phase
After Phase 8 completion:
- Run final comprehensive validation
- Generate migration completion report
- Archive pre-centralization code for reference
