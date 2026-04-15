/**
 * TEMPLATE VALIDATION UTILITY
 * ===========================
 * Helper functions for template developers to validate
 * their resume templates work with the A4 scaling system
 */

export const TemplateValidator = {
  /**
   * Validate template HTML structure
   */
  validateStructure: (html) => {
    const errors = [];
    const warnings = [];

    // Check DOCTYPE
    if (!html.includes("<!DOCTYPE html")) {
      warnings.push("Missing DOCTYPE declaration");
    }

    // Check for .page container
    if (!html.includes('class="page"') && !html.includes("class='page'")) {
      errors.push("❌ CRITICAL: Missing .page container (required)");
    }

    // Check for multiple .page containers
    const pageMatches = html.match(/class=['"]page['"]/g);
    if (pageMatches && pageMatches.length > 1) {
      errors.push("❌ Multiple .page containers found (only one allowed)");
    }

    // Check for positioning that breaks layout
    if (html.includes("position: absolute") || html.includes("position:absolute")) {
      warnings.push("⚠️  Found position: absolute (may break scaling)");
    }

    if (html.includes("position: fixed") || html.includes("position:fixed")) {
      warnings.push("⚠️  Found position: fixed (may break scaling)");
    }

    // Check width specification
    if (html.includes(".page") && html.includes("width")) {
      const cssMatch = html.match(/\.page\s*\{[^}]*width:\s*([^;]+)/);
      if (cssMatch && cssMatch[1] !== "794px") {
        warnings.push(`⚠️  .page width is ${cssMatch[1]}, should be 794px`);
      }
    }

    return { errors, warnings };
  },

  /**
   * Check CSS for common issues
   */
  validateCSS: (css) => {
    const issues = [];

    // Check for min-height abuse
    const minHeightMatches = css.match(/min-height:\s*([^;]+)/g);
    if (minHeightMatches && minHeightMatches.length > 3) {
      issues.push("⚠️  Many min-height declarations (may prevent shrinking)");
    }

    // Check for height constraints on page
    if (css.includes(".page") && css.includes("height:")) {
      const heightMatch = css.match(/\.page\s*\{[^}]*height:\s*([^;]+)/);
      if (heightMatch && heightMatch[1] !== "1123px") {
        issues.push(`⚠️  .page height is ${heightMatch[1]}, should be 1123px`);
      }
    }

    // Check line heights
    const lineHeights = css.match(/line-height:\s*([^;]+)/g);
    if (lineHeights) {
      const values = lineHeights.map(lh => parseFloat(lh));
      const dangerousValues = values.filter(v => v > 2 || v < 1);
      if (dangerousValues.length > 0) {
        issues.push("⚠️  Extreme line-height values detected");
      }
    }

    // Check for box-sizing
    if (!css.includes("box-sizing")) {
      issues.push("⚠️  box-sizing: border-box not found (recommended)");
    }

    return issues;
  },

  /**
   * Simulate page breaking
   */
  estimatePageFit: (contentHeightPx) => {
    const A4_HEIGHT = 1123;
    const contentFits = contentHeightPx <= A4_HEIGHT;
    const scale = contentFits
      ? Math.min(1.15, A4_HEIGHT / contentHeightPx)
      : Math.max(0.75, A4_HEIGHT / contentHeightPx);
    const utilization = Math.min(100, (contentHeightPx * scale / A4_HEIGHT) * 100);

    return {
      contentHeight: contentHeightPx,
      pageHeight: A4_HEIGHT,
      fits: contentFits,
      scale: scale.toFixed(4),
      utilization: utilization.toFixed(1),
      mode: contentFits ? (contentHeightPx < A4_HEIGHT ? "expand" : "fit") : "shrink",
    };
  },

  /**
   * Validate template data requirements
   */
  validateDataStructure: (resumeData) => {
    const required = [
      "personalDetails",
      "summary",
      "experience",
      "education",
      "skills",
    ];
    const missing = [];

    required.forEach(field => {
      if (!resumeData[field]) {
        missing.push(`Missing: ${field}`);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
      sections: Object.keys(resumeData),
    };
  },

  /**
   * Report template readiness
   */
  generateReport: (html, css, contentHeight, resumeData) => {
    const structureCheck = TemplateValidator.validateStructure(html);
    const cssCheck = TemplateValidator.validateCSS(css);
    const fitCheck = TemplateValidator.estimatePageFit(contentHeight);
    const dataCheck = TemplateValidator.validateDataStructure(resumeData);

    const allGood = structureCheck.errors.length === 0 &&
                    cssCheck.length === 0 &&
                    dataCheck.valid;

    return {
      ready: allGood,
      score: calculateReadinessScore(
        structureCheck,
        cssCheck,
        fitCheck,
        dataCheck
      ),
      structure: structureCheck,
      css: cssCheck,
      fit: fitCheck,
      data: dataCheck,
      recommendations: generateRecommendations(
        structureCheck,
        cssCheck,
        fitCheck,
        dataCheck
      ),
    };
  },
};

/**
 * Calculate readiness score (0-100)
 */
function calculateReadinessScore(structure, css, fit, data) {
  let score = 100;

  // Deduct for structural errors
  score -= structure.errors.length * 20;
  score -= structure.warnings.length * 5;

  // Deduct for CSS issues
  score -= css.length * 3;

  // Deduct for fit issues
  if (fit.utilization < 50 || fit.utilization > 110) {
    score -= 15;
  }

  // Deduct for missing data
  if (!data.valid) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(structure, css, fit, data) {
  const recommendations = [];

  if (structure.errors.length > 0) {
    recommendations.push("🔴 Fix critical structure errors first");
  }

  if (fit.mode === "shrink" && parseInt(fit.scale) < 0.8) {
    recommendations.push(
      "🟡 Content may be too large; consider reducing text size or sections"
    );
  }

  if (fit.mode === "expand" && fit.utilization < 70) {
    recommendations.push(
      "🟡 Content is small; add more content or adjust spacing"
    );
  }

  if (css.includes("remove")) {
    recommendations.push("🟡 Review CSS for best practices");
  }

  if (!data.valid) {
    recommendations.push(`🔵 Ensure resume data includes: ${data.missing.join(", ")}`);
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Template looks great! Ready for production.");
  }

  return recommendations;
}

/**
 * Format validation report for display
 */
export const formatValidationReport = (report) => {
  const lines = [
    "\n" + "=".repeat(60),
    "TEMPLATE VALIDATION REPORT",
    "=".repeat(60),
    "",
    `Overall Score: ${report.score}/100 ${getScoreBadge(report.score)}`,
    `Ready for Production: ${report.ready ? "✅ YES" : "❌ NO"}`,
    "",
  ];

  if (report.structure.errors.length > 0) {
    lines.push("STRUCTURAL ERRORS:");
    report.structure.errors.forEach(e => lines.push(`  ${e}`));
    lines.push("");
  }

  if (report.structure.warnings.length > 0) {
    lines.push("WARNINGS:");
    report.structure.warnings.forEach(w => lines.push(`  ${w}`));
    lines.push("");
  }

  if (report.css.length > 0) {
    lines.push("CSS ISSUES:");
    report.css.forEach(issue => lines.push(`  ${issue}`));
    lines.push("");
  }

  lines.push("PAGE FIT ANALYSIS:");
  lines.push(`  Content Height: ${report.fit.contentHeight}px`);
  lines.push(`  Page Height: ${report.fit.pageHeight}px`);
  lines.push(`  Scaling Mode: ${report.fit.mode.toUpperCase()}`);
  lines.push(`  Scale Factor: ${report.fit.scale}x`);
  lines.push(`  Page Utilization: ${report.fit.utilization}%`);
  lines.push("");

  lines.push("RECOMMENDATIONS:");
  report.recommendations.forEach(rec => lines.push(`  ${rec}`));
  lines.push("");

  lines.push("=".repeat(60));

  return lines.join("\n");
};

function getScoreBadge(score) {
  if (score >= 90) return "🟢";
  if (score >= 70) return "🟡";
  if (score >= 50) return "🟠";
  return "🔴";
}

export default TemplateValidator;
