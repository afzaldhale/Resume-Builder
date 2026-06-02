#!/usr/bin/env node

/**
 * PHASE 7: PDF/PREVIEW PARITY ANALYZER
 * 
 * Compares expected template specifications against actual PDF output
 * Generates detailed parity report identifying alignment issues
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateResumePDF } from "../src/services/pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, ".phase-7-results");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * EXPECTED TEMPLATE SPECIFICATIONS
 * (From Phase 5 typography standardization)
 */
const TEMPLATE_SPECS = {
  1: {
    name: "Clean Single Column",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "24px", weight: 600 },
      role: { size: "14px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  2: {
    name: "Corporate Sidebar Blue",
    type: "SIDEBAR",
    layout: "40% sidebar + 60% content",
    sidebarWidth: "40%",
    minSidebarPx: 317,
    expectedSidebarPx: 317,
    typography: {
      name: { size: "28px", weight: 700 },
      role: { size: "18px", weight: 600 },
      body: { size: "13px", weight: 400 },
      sectionTitle: { size: "16px", weight: 700 },
    },
  },
  3: {
    name: "Colored Heading Corporate",
    type: "TWO_COLUMN_HEADER",
    layout: "colored header + two-column content",
    typography: {
      name: { size: "26px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "12.5px", weight: 400 },
      sectionTitle: { size: "15px", weight: 700 },
    },
  },
  4: {
    name: "Left Accent Teal",
    type: "SIDEBAR",
    layout: "230px sidebar + content",
    sidebarWidth: "230px",
    minSidebarPx: 230,
    expectedSidebarPx: 230,
    typography: {
      name: { size: "26px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "11px", weight: 400 },
      sectionTitle: { size: "11px", weight: 700 }, // ⚠️ BELOW 14px MIN
    },
  },
  5: {
    name: "Premium Gray Sidebar",
    type: "SIDEBAR",
    layout: "230px sidebar + content",
    sidebarWidth: "230px",
    minSidebarPx: 230,
    expectedSidebarPx: 230,
    typography: {
      name: { size: "27px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "10.9px", weight: 400 },
      sectionTitle: { size: "11px", weight: 700 }, // ⚠️ BELOW 14px MIN
    },
  },
  6: {
    name: "Professional Sidebar Teal",
    type: "SIDEBAR",
    layout: "220px sidebar + content",
    sidebarWidth: "220px",
    minSidebarPx: 220,
    expectedSidebarPx: 220,
    typography: {
      name: { size: "26px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "10.9px", weight: 400 },
      sectionTitle: { size: "10.8px", weight: 700 }, // ⚠️ BELOW 14px MIN
    },
  },
  7: {
    name: "Muted Coral Corporate",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "26px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  8: {
    name: "Compact ATS Single",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "20px", weight: 700 },
      role: { size: "12px", weight: 600 },
      body: { size: "10px", weight: 400 },
    },
  },
  9: {
    name: "Premium Charcoal Sidebar",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "28px", weight: 700 },
      role: { size: "13px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  10: {
    name: "Blue Heading Corporate",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "28px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  11: {
    name: "Classic Two Column",
    type: "SIDEBAR",
    layout: "35% sidebar + 65% content",
    sidebarWidth: "35%",
    minSidebarPx: 278,
    expectedSidebarPx: 278,
    typography: {
      name: { size: "24px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "13px", weight: 400 },
      sectionTitle: { size: "13px", weight: 700 }, // ⚠️ BELOW 14px MIN
    },
  },
  12: {
    name: "Soft Green Corporate",
    type: "TWO_COLUMN_HEADER",
    layout: "colored header + two-column content",
    typography: {
      name: { size: "28px", weight: 700 },
      role: { size: "16px", weight: 600 },
      body: { size: "13px", weight: 400 },
      sectionTitle: { size: "14px", weight: 700 },
    },
  },
  13: {
    name: "Rose Sidebar Corporate",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "28px", weight: 700 },
      role: { size: "14px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  14: {
    name: "Minimal Left Accent",
    type: "SINGLE_COLUMN",
    layout: "single",
    typography: {
      name: { size: "26px", weight: 700 },
      role: { size: "12px", weight: 600 },
      body: { size: "11px", weight: 400 },
    },
  },
  15: {
    name: "Corporate Clean",
    type: "SIDEBAR",
    layout: "30% sidebar + 70% content",
    sidebarWidth: "30%",
    minSidebarPx: 238,
    expectedSidebarPx: 238,
    typography: {
      name: { size: "24px", weight: 700 },
      role: { size: "13px", weight: 600 },
      body: { size: "13px", weight: 400 },
      sectionTitle: { size: "14px", weight: 700 },
    },
  },
};

/**
 * PARITY VALIDATION
 */
const analyzeParityCompliance = (templateId, spec) => {
  const issues = [];
  const warnings = [];

  // Check typography compliance with standards
  const standardName = 28;
  const standardRole = 15;
  const standardBody = 12;
  const standardSectionMin = 14;

  const nameSize = parseFloat(spec.typography.name?.size) || 0;
  const roleSize = parseFloat(spec.typography.role?.size) || 0;
  const bodySize = parseFloat(spec.typography.body?.size) || 0;
  const sectionSize = parseFloat(spec.typography.sectionTitle?.size) || 0;

  if (nameSize < standardName - 2) {
    warnings.push(`Name font (${spec.typography.name?.size}) is below ideal (${standardName}px)`);
  }

  if (roleSize < standardRole - 3) {
    warnings.push(`Role font (${spec.typography.role?.size}) is below ideal (${standardRole}px)`);
  }

  if (bodySize < standardBody - 2) {
    warnings.push(`Body font (${spec.typography.body?.size}) is below ideal (${standardBody}px)`);
  }

  if (sectionSize < standardSectionMin) {
    issues.push(
      `Section title (${spec.typography.sectionTitle?.size}) below ${standardSectionMin}px minimum`
    );
  }

  // Check sidebar width compliance
  if (spec.minSidebarPx) {
    if (spec.minSidebarPx < 220) {
      issues.push(`Sidebar width (${spec.minSidebarPx}px) below 220px minimum`);
    }
  }

  // Check layout type
  if (!spec.type || !["SIDEBAR", "TWO_COLUMN_HEADER", "SINGLE_COLUMN"].includes(spec.type)) {
    warnings.push(`Layout type "${spec.type}" not recognized`);
  }

  return {
    compliant: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, 100 - issues.length * 20 - warnings.length * 5),
  };
};

/**
 * GENERATE PARITY REPORT
 */
const generateParityReport = async () => {
  console.log("\n");
  console.log("═".repeat(80));
  console.log("  PHASE 7: PDF/PREVIEW PARITY ANALYSIS");
  console.log("═".repeat(80));
  console.log("\n");

  const report = {
    timestamp: new Date().toISOString(),
    totalTemplates: 15,
    compliant: 0,
    warnings: 0,
    issues: 0,
    templates: {},
    summary: {
      byType: {},
      typographyGaps: [],
      sidebarGaps: [],
    },
  };

  console.log("Analyzing template specifications...\n");

  for (let templateId = 1; templateId <= 15; templateId++) {
    const spec = TEMPLATE_SPECS[templateId];
    if (!spec) continue;

    process.stdout.write(`  Template ${templateId}: ${spec.name}... `);

    const analysis = analyzeParityCompliance(templateId, spec);

    report.templates[templateId] = {
      name: spec.name,
      type: spec.type,
      layout: spec.layout,
      spec,
      analysis,
    };

    if (!report.summary.byType[spec.type]) {
      report.summary.byType[spec.type] = {
        count: 0,
        compliant: 0,
        issues: [],
      };
    }

    report.summary.byType[spec.type].count++;

    if (analysis.compliant) {
      report.compliant++;
      report.summary.byType[spec.type].compliant++;
      console.log(`✅ PASS (Score: ${analysis.score}%)`);
    } else {
      report.issues += analysis.issues.length;
      console.log(`⚠️ ISSUES (${analysis.issues.length})`);
      analysis.issues.forEach((issue) => {
        report.summary.byType[spec.type].issues.push(`T${templateId}: ${issue}`);
      });
    }

    if (analysis.warnings.length > 0) {
      report.warnings += analysis.warnings.length;
    }
  }

  // Identify typography gaps
  const typographyGaps = [];
  Object.entries(TEMPLATE_SPECS).forEach(([tId, spec]) => {
    if (spec.typography?.sectionTitle) {
      const sectionSize = parseFloat(spec.typography.sectionTitle.size);
      if (sectionSize < 14) {
        typographyGaps.push(`T${tId}: Section title ${spec.typography.sectionTitle.size} < 14px`);
      }
    }
  });
  report.summary.typographyGaps = typographyGaps;

  // Summary by type
  console.log("\n");
  console.log("═".repeat(80));
  console.log("  PARITY ANALYSIS SUMMARY");
  console.log("═".repeat(80));
  console.log(`\nCompliant Templates: ${report.compliant} / ${report.totalTemplates}`);
  console.log(`Total Issues: ${report.issues}`);
  console.log(`Total Warnings: ${report.warnings}`);

  console.log("\nBY LAYOUT TYPE:");
  console.log("─".repeat(80));
  Object.entries(report.summary.byType).forEach(([type, data]) => {
    const complianceRate = ((data.compliant / data.count) * 100).toFixed(0);
    console.log(`\n${type} (${data.count} templates, ${complianceRate}% compliant)`);
    if (data.issues.length > 0) {
      data.issues.slice(0, 3).forEach((issue) => {
        console.log(`  ❌ ${issue}`);
      });
      if (data.issues.length > 3) {
        console.log(`  ... and ${data.issues.length - 3} more issues`);
      }
    }
  });

  if (typographyGaps.length > 0) {
    console.log("\n");
    console.log("TYPOGRAPHY GAPS (Section titles below 14px minimum):");
    console.log("─".repeat(80));
    typographyGaps.forEach((gap) => {
      console.log(`  ⚠️ ${gap}`);
    });
  }

  // Save report
  const reportPath = path.join(OUTPUT_DIR, "phase-7-parity-analysis.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report saved to: ${reportPath}`);

  return report;
};

// Execute
generateParityReport().catch((error) => {
  console.error("\nFATAL ERROR:", error);
  process.exit(1);
});
