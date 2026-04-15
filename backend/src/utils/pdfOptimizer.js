/**
 * PDF OPTIMIZER UTILITIES
 * ========================
 * Helper functions for PDF generation optimization
 * Handles debugging, measurement, and configuration
 */

export const PDF_CONFIG = {
  A4_WIDTH_PX: 794,
  A4_HEIGHT_PX: 1123,
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  MARGIN_SAFE: 5, // Minimum safe margin in mm for content
  
  // Scaling parameters
  SCALING: {
    MAX_EXPANSION: 1.15,   // Max upscale (fill empty space)
    MIN_COMPRESSION: 0.75, // Min downscale (fit overflow)
    FONT_MIN: 0.82,        // Minimum font scale
    LINE_HEIGHT_MIN: 1.2,  // Minimum line height
    SPACE_MIN: 0.72,       // Minimum space scale
  },

  // Template-specific safe zones (in pixels)
  TEMPLATES: {
    1: { name: "Simple Classic", safeZone: { top: 36, bottom: 36, left: 36, right: 36 } },
    2: { name: "Professional Sidebar", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    3: { name: "Modern Two-Column", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    4: { name: "Modern Professional", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    5: { name: "Timeline Professional", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    6: { name: "ATS Optimized", safeZone: { top: 24, bottom: 24, left: 24, right: 24 } },
    7: { name: "Creative Portfolio", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    8: { name: "Clean Minimalist", safeZone: { top: 36, bottom: 36, left: 36, right: 36 } },
    9: { name: "Dark Theme", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    10: { name: "Modern Gradient", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    11: { name: "Soft Indigo", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    12: { name: "Fresh Emerald", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    13: { name: "Modern Fuchsia", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
    14: { name: "Minimal White", safeZone: { top: 36, bottom: 36, left: 36, right: 36 } },
    15: { name: "Clean Professional", safeZone: { top: 32, bottom: 32, left: 32, right: 32 } },
  },
};

/**
 * Calculate optimal scale factor for a given content height
 * @param {number} contentHeight - Actual content height in pixels
 * @param {number} pageHeight - Target page height (default A4)
 * @returns {object} Scale calculation result
 */
export const calculateOptimalScale = (
  contentHeight,
  pageHeight = PDF_CONFIG.A4_HEIGHT_PX
) => {
  const config = PDF_CONFIG.SCALING;
  let scale = 1;
  let scalingMode = "none";

  if (contentHeight > pageHeight) {
    // SHRINK TO FIT
    scale = Math.max(config.MIN_COMPRESSION, pageHeight / contentHeight);
    scalingMode = "shrink";
  } else if (contentHeight < pageHeight) {
    // EXPAND TO FILL
    const expansionRatio = pageHeight / contentHeight;
    scale = Math.min(config.MAX_EXPANSION, expansionRatio);
    scalingMode = "expand";
  }

  const verticalUtilization = Math.min(100, (contentHeight * scale / pageHeight) * 100);

  return {
    scale: parseFloat(scale.toFixed(4)),
    scalingMode,
    contentHeight,
    pageHeight,
    finalHeight: contentHeight * scale,
    verticalUtilization: parseFloat(verticalUtilization.toFixed(2)),
    recommendation: generateScalingRecommendation(scale, scalingMode, contentHeight, pageHeight),
  };
};

/**
 * Generate human-readable recommendation
 */
function generateScalingRecommendation(scale, mode, contentHeight, pageHeight) {
  const utilization = (Math.min(contentHeight * scale, pageHeight) / pageHeight * 100).toFixed(1);
  
  if (mode === "shrink") {
    return `Shrinking by ${((1 - scale) * 100).toFixed(1)}% to fit content (${utilization}% page utilization)`;
  } else if (mode === "expand") {
    return `Expanding by ${((scale - 1) * 100).toFixed(1)}% to fill page (${utilization}% page utilization)`;
  } else {
    return `Content fits perfectly (${utilization}% page utilization)`;
  }
}

/**
 * Validate template structure
 * @param {number} templateId - Template ID (1-15)
 * @returns {object} Template validation result
 */
export const validateTemplate = (templateId) => {
  const id = parseInt(templateId, 10);
  const template = PDF_CONFIG.TEMPLATES[id];

  if (!template) {
    return {
      valid: false,
      error: `Template ${id} not found. Valid range: 1-15`,
      templateId: id,
    };
  }

  return {
    valid: true,
    templateId: id,
    ...template,
  };
};

/**
 * Format debug information for logging
 */
export const formatDebugInfo = (scaleResult, templateValidation) => {
  const lines = [
    "\n📊 PDF GENERATION DEBUG INFO:",
    "═".repeat(50),
    `Template: ${templateValidation.name} (ID: ${templateValidation.templateId})`,
    `Safe Zone: T:${templateValidation.safeZone.top}px B:${templateValidation.safeZone.bottom}px L:${templateValidation.safeZone.left}px R:${templateValidation.safeZone.right}px`,
    "",
    "Content Measurements:",
    `  Content Height: ${scaleResult.contentHeight}px`,
    `  Page Height:    ${scaleResult.pageHeight}px`,
    `  Ratio:          ${(scaleResult.contentHeight / scaleResult.pageHeight).toFixed(3)}`,
    "",
    "Scaling Result:",
    `  Mode:                ${scaleResult.scalingMode.toUpperCase()}`,
    `  Scale Factor:        ${scaleResult.scale}`,
    `  Final Height:        ${scaleResult.finalHeight.toFixed(0)}px`,
    `  Page Utilization:    ${scaleResult.verticalUtilization}%`,
    "",
    "Recommendation:",
    `  ${scaleResult.recommendation}`,
    "═".repeat(50),
    "",
  ];

  return lines.join("\n");
};

/**
 * Generate Puppeteer PDF options with optimizations
 */
export const generatePuppeteerPDFOptions = (includeMargins = false) => {
  const baseOptions = {
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    scale: 1,
  };

  if (includeMargins) {
    baseOptions.margin = {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm",
    };
  } else {
    baseOptions.margin = {
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px",
    };
  }

  return baseOptions;
};

/**
 * Validate resume data has minimum required fields
 */
export const validateResumeDataForPDF = (resumeData) => {
  const errors = [];

  if (!resumeData) {
    errors.push("Resume data is empty");
    return errors;
  }

  if (!resumeData.personalDetails || !resumeData.personalDetails.fullName) {
    errors.push("Missing personal details or full name");
  }

  return errors;
};

/**
 * Get environment-based configuration
 */
export const getProductionConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";
  
  return {
    enableDebugMode: process.env.PDF_DEBUG === "true" || !isProduction,
    enableDetailedLogging: process.env.PDF_VERBOSE === "true" || !isProduction,
    pdfTimeout: parseInt(process.env.PDF_TIMEOUT || "30000", 10),
    maxRetries: parseInt(process.env.PDF_MAX_RETRIES || "2", 10),
  };
};

export default {
  PDF_CONFIG,
  calculateOptimalScale,
  validateTemplate,
  formatDebugInfo,
  generatePuppeteerPDFOptions,
  validateResumeDataForPDF,
  getProductionConfig,
};
