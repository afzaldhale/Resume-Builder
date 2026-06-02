#!/usr/bin/env node

/**
 * PHASE 8: CENTRALIZATION & CODE DEDUPLICATION ANALYZER
 * 
 * Scans all templates for repeated code patterns and generates
 * centralization recommendations with extraction strategies
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, "../src/templates");
const OUTPUT_DIR = path.join(__dirname, ".phase-8-results");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * PATTERN DETECTORS
 */

// Detect CSS patterns
const CSS_PATTERNS = {
  TYPOGRAPHY: {
    pattern: /font-size:\s*[\d.]+px|font-weight:\s*[\d]+|line-height:\s*[\d.]+/g,
    category: "Typography Rules",
  },
  SIDEBAR_WIDTH: {
    pattern: /(?:width:\s*[\d%]+|grid-template-columns:\s*[\w\d.%\s]+|flex:\s*[\d%\s]+)/g,
    category: "Layout Dimensions",
  },
  SPACING: {
    pattern: /(?:padding|margin|gap):\s*[\d.]+(?:px|%|em)?/g,
    category: "Spacing & Gaps",
  },
  BORDERS_COLORS: {
    pattern: /(?:border|color|background):\s*[#\w\d(),%.\s]+/g,
    category: "Colors & Borders",
  },
  PAGE_BREAK: {
    pattern: /page-break|break-inside|page-break-inside/g,
    category: "Page Break Rules",
  },
};

// Detect HTML patterns
const HTML_PATTERNS = {
  HEADER_STRUCTURE: {
    pattern: /<header[^>]*>[\s\S]*?<\/header>/g,
    category: "Header Component",
  },
  SECTION_STRUCTURE: {
    pattern: /<section[^>]*>[\s\S]*?<\/section>/g,
    category: "Section Component",
  },
  SIDEBAR_STRUCTURE: {
    pattern: /(?:<aside|class="sidebar")[^>]*>[\s\S]*?(?:<\/aside>|<\/>)/g,
    category: "Sidebar Component",
  },
};

/**
 * ANALYZE TEMPLATE
 */
const analyzeTemplate = (templatePath) => {
  const content = fs.readFileSync(templatePath, "utf8");
  const templateName = path.basename(templatePath);

  const analysis = {
    file: templateName,
    size: content.length,
    lines: content.split("\n").length,
    patterns: {},
    features: [],
  };

  // Detect CSS patterns
  let cssStart = content.indexOf("`const styles = `") || content.indexOf('const styles = `');
  if (cssStart === -1) {
    cssStart = content.indexOf("export const template");
  }
  const cssSection = content.slice(cssStart);

  Object.entries(CSS_PATTERNS).forEach(([name, detector]) => {
    const matches = cssSection.match(detector.pattern) || [];
    if (matches.length > 0) {
      analysis.patterns[name] = {
        count: matches.length,
        category: detector.category,
        samples: matches.slice(0, 3),
      };
    }
  });

  // Detect HTML features
  if (content.includes("sidebar") || content.includes("left-panel")) {
    analysis.features.push("Sidebar Layout");
  }
  if (content.includes("grid-template-columns")) {
    analysis.features.push("CSS Grid");
  }
  if (content.includes("display: flex")) {
    analysis.features.push("Flexbox");
  }
  if (content.includes("page-break")) {
    analysis.features.push("Page Break Handling");
  }
  if (content.includes("sharedTemplateStyles")) {
    analysis.features.push("Uses Shared Styles");
  }

  return analysis;
};

/**
 * FIND DUPLICATED PATTERNS
 */
const findDuplicatedPatterns = (analyses) => {
  const patterns = {};

  analyses.forEach((analysis) => {
    Object.entries(analysis.patterns).forEach(([patternName, data]) => {
      if (!patterns[patternName]) {
        patterns[patternName] = {
          category: data.category,
          templates: [],
          totalCount: 0,
        };
      }
      patterns[patternName].templates.push({
        template: analysis.file,
        count: data.count,
        samples: data.samples,
      });
      patterns[patternName].totalCount += data.count;
    });
  });

  // Filter to patterns that appear in multiple templates
  const duplicated = {};
  Object.entries(patterns).forEach(([name, data]) => {
    if (data.templates.length >= 3) {
      duplicated[name] = data;
    }
  });

  return duplicated;
};

/**
 * GENERATE CENTRALIZATION RECOMMENDATIONS
 */
const generateRecommendations = (duplicated, analyses) => {
  const recommendations = [];

  // Recommendation 1: Centralized Typography
  if (duplicated.TYPOGRAPHY) {
    recommendations.push({
      priority: "HIGH",
      component: "ResumeTypography",
      description:
        "Centralize font-size, font-weight, and line-height rules in shared typography system",
      templates: duplicated.TYPOGRAPHY.templates.map((t) => t.template),
      benefit: "Update fonts globally without touching individual templates",
      estimatedSavings: `${duplicated.TYPOGRAPHY.totalCount * 2} bytes per template`,
    });
  }

  // Recommendation 2: Centralized Layout Dimensions
  if (duplicated.SIDEBAR_WIDTH) {
    recommendations.push({
      priority: "HIGH",
      component: "SidebarLayout",
      description:
        "Centralize sidebar width, grid-template-columns, and flex dimensions in shared layout system",
      templates: duplicated.SIDEBAR_WIDTH.templates.map((t) => t.template),
      benefit: "Ensure consistent sidebar widths (minimum 220px) across all sidebar templates",
      estimatedSavings: `${duplicated.SIDEBAR_WIDTH.totalCount * 1.5} bytes per template`,
    });
  }

  // Recommendation 3: Centralized Spacing Rules
  if (duplicated.SPACING) {
    recommendations.push({
      priority: "MEDIUM",
      component: "ResumeSpacing",
      description:
        "Move common padding, margin, and gap rules to centralized spacing constants",
      templates: duplicated.SPACING.templates.map((t) => t.template),
      benefit: "Consistent spacing across all templates, easier adjustments",
      estimatedSavings: `${duplicated.SPACING.totalCount * 1.5} bytes per template`,
    });
  }

  // Recommendation 4: Page Break Handling
  if (duplicated.PAGE_BREAK) {
    recommendations.push({
      priority: "HIGH",
      component: "PageBreakRules",
      description:
        "Extract page-break and break-inside rules to shared component (already started with sharedTemplateStyles)",
      templates: duplicated.PAGE_BREAK.templates.map((t) => t.template),
      benefit: "Consistent page break behavior, better A4 compliance",
      estimatedSavings: `${duplicated.PAGE_BREAK.totalCount * 1} bytes per template`,
    });
  }

  return recommendations;
};

/**
 * GENERATE PHASE 8 REPORT
 */
const generateCentralizationReport = async () => {
  console.log("\n");
  console.log("═".repeat(80));
  console.log("  PHASE 8: CODE CENTRALIZATION & DEDUPLICATION ANALYSIS");
  console.log("═".repeat(80));
  console.log("\n");

  // Find all template files
  console.log("Scanning template files...\n");
  const templateFiles = fs.readdirSync(TEMPLATES_DIR).filter((f) => f.startsWith("template") && f.endsWith(".js"));

  // Analyze each template
  const analyses = [];
  let totalSize = 0;
  let totalLines = 0;

  templateFiles.forEach((file) => {
    if (file === "templateShared.js") return;

    const filepath = path.join(TEMPLATES_DIR, file);
    const analysis = analyzeTemplate(filepath);
    analyses.push(analysis);
    totalSize += analysis.size;
    totalLines += analysis.lines;

    console.log(`  ${file}`);
    console.log(`    Size: ${(analysis.size / 1024).toFixed(2)} KB | Lines: ${analysis.lines}`);
    console.log(`    Features: ${analysis.features.join(", ") || "Basic layout"}`);
  });

  console.log(`\nTotal: ${totalSize} bytes (~${(totalSize / 1024).toFixed(2)} KB)`);
  console.log(`Total Lines: ${totalLines}`);

  // Find duplicated patterns
  console.log("\nAnalyzing duplicated patterns...\n");
  const duplicated = findDuplicatedPatterns(analyses);

  console.log(`Found ${Object.keys(duplicated).length} patterns duplicated across 3+ templates:`);
  Object.entries(duplicated).forEach(([name, data]) => {
    console.log(`  • ${name}: ${data.templates.length} templates, ${data.totalCount} occurrences`);
  });

  // Generate recommendations
  const recommendations = generateRecommendations(duplicated, analyses);

  console.log("\n");
  console.log("═".repeat(80));
  console.log("  CENTRALIZATION OPPORTUNITIES");
  console.log("═".repeat(80));
  console.log("\n");

  recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  recommendations.forEach((rec, idx) => {
    console.log(`\n${idx + 1}. [${rec.priority}] ${rec.component}`);
    console.log(`   Description: ${rec.description}`);
    console.log(`   Templates: ${rec.templates.length}`);
    console.log(`   Benefit: ${rec.benefit}`);
    console.log(`   Est. Savings: ${rec.estimatedSavings}`);
  });

  // Calculate potential savings
  const totalPotentialSavings = recommendations.reduce((sum, rec) => {
    const match = rec.estimatedSavings.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  console.log("\n");
  console.log("═".repeat(80));
  console.log("  OVERALL CENTRALIZATION IMPACT");
  console.log("═".repeat(80));
  console.log(`\nCurrent Total: ${(totalSize / 1024).toFixed(2)} KB (${totalLines} lines)`);
  console.log(`Estimated Savings: ${(totalPotentialSavings / 1024).toFixed(2)} KB`);
  console.log(
    `Potential Reduction: ${((totalPotentialSavings / totalSize) * 100).toFixed(1)}% of template code`
  );

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    templates: {
      analyzed: templateFiles.length,
      totalSize,
      totalLines,
      analyses,
    },
    duplicatedPatterns: duplicated,
    recommendations,
    potentialSavings: {
      bytes: totalPotentialSavings,
      kb: (totalPotentialSavings / 1024).toFixed(2),
      percentReduction: ((totalPotentialSavings / totalSize) * 100).toFixed(1),
    },
  };

  const reportPath = path.join(OUTPUT_DIR, "phase-8-centralization-analysis.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report saved to: ${reportPath}`);

  // Generate implementation plan
  const planPath = path.join(OUTPUT_DIR, "phase-8-implementation-plan.md");
  const implementationPlan = `# PHASE 8: CENTRALIZATION IMPLEMENTATION PLAN

## Overview
Consolidate repeated CSS patterns and components across 15 resume templates into shared modules.

## Current State
- Total Template Code: ${(totalSize / 1024).toFixed(2)} KB (${totalLines} lines)
- Duplicated Patterns: ${Object.keys(duplicated).length}
- Affected Templates: ${[...new Set(Object.values(duplicated).flatMap((d) => d.templates))].length}

## Potential Savings
- **Bytes:** ${totalPotentialSavings} bytes
- **KB:** ${(totalPotentialSavings / 1024).toFixed(2)} KB
- **Reduction:** ${((totalPotentialSavings / totalSize) * 100).toFixed(1)}% of template code

## Recommended Components to Extract

${recommendations
  .map(
    (rec, idx) => `
### ${idx + 1}. ${rec.component}
- **Priority:** ${rec.priority}
- **Status:** Not yet centralized
- **Affected Templates:** ${rec.templates.join(", ")}
- **Description:** ${rec.description}
- **Benefit:** ${rec.benefit}
`
  )
  .join("\n")}

## Implementation Steps

### Step 1: Create Component Library in templateShared.js
\`\`\`javascript
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
\`\`\`

### Step 2: Update Templates to Use Shared Components
Templates to update:
${recommendations
  .flatMap((rec) => rec.templates)
  .filter((v, i, a) => a.indexOf(v) === i)
  .join(", ")}

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
- ✅ Templates down to <4KB each (from ~${(totalSize / templateFiles.length / 1024).toFixed(1)}KB)
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
`;

  fs.writeFileSync(planPath, implementationPlan);
  console.log(`✅ Implementation plan saved to: ${planPath}`);

  console.log("\n");
  console.log("═".repeat(80));
  console.log("  READY FOR PHASE 8 IMPLEMENTATION");
  console.log("═".repeat(80));
  console.log("\n");

  return report;
};

// Execute
generateCentralizationReport().catch((error) => {
  console.error("\nFATAL ERROR:", error);
  process.exit(1);
});
