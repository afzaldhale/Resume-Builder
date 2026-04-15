/**
 * EXAMPLE: Using PDF Optimization Utilities
 * ==========================================
 * This file shows practical examples of how to use
 * the PDF generation and validation utilities
 */

// ============================================
// EXAMPLE 1: Basic PDF Generation
// ============================================

import { generateResumePDF } from '../services/pdfService.js';

export async function example_basicGeneration() {
  try {
    const resumeData = {
      personalDetails: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
      },
      summary: "Experienced software engineer with 10+ years in full-stack development.",
      experience: [
        {
          role: "Senior Engineer",
          company: "Tech Corp",
          duration: "2020-2024",
          description: "Led team of 5. Improved performance by 40%.",
        },
      ],
      education: [
        {
          degree: "B.Tech Computer Science",
          school: "Tech University",
          year: "2014",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
    };

    // Generate PDF
    const pdfBuffer = await generateResumePDF(resumeData, 1);

    // Save to file
    const fs = require("fs");
    fs.writeFileSync("resume.pdf", pdfBuffer);

    console.log("✅ PDF generated successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// ============================================
// EXAMPLE 2: PDF Generation with Debug Mode
// ============================================

import { generateResumePDF } from '../services/pdfService.js';

export async function example_debugMode() {
  try {
    const resumeData = { /* ... */ };

    // Generate with debug logging
    const pdfBuffer = await generateResumePDF(
      resumeData,
      1,
      { debugMode: true }  // Enable debug output
    );

    console.log("PDF size:", pdfBuffer.length, "bytes");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// ============================================
// EXAMPLE 3: Validate Template Before Use
// ============================================

import { TemplateValidator, formatValidationReport } from '../utils/templateValidator.js';

export function example_validateTemplate() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; }
        .page { width: 794px; height: 1123px; padding: 32px; }
        h2 { margin: 12px 0 8px 0; }
      </style>
    </head>
    <body>
      <div class="page">
        <h1>Resume Title</h1>
        <h2>Experience</h2>
        <p>Job description here...</p>
      </div>
    </body>
    </html>
  `;

  // Simple validation
  const structureCheck = TemplateValidator.validateStructure(html);
  console.log("Structure errors:", structureCheck.errors);
  console.log("Warnings:", structureCheck.warnings);

  // Full validation report
  const resumeData = { /* ... */ };
  const report = TemplateValidator.generateReport(
    html,
    "", // CSS
    1050, // Content height in px
    resumeData
  );

  console.log(formatValidationReport(report));
}

// ============================================
// EXAMPLE 4: Calculate Optimal Scaling
// ============================================

import { calculateOptimalScale } from '../utils/pdfOptimizer.js';

export function example_calculateScaling() {
  // Scenario 1: Content too large (needs shrinking)
  const result1 = calculateOptimalScale(1500);
  console.log(result1);
  // Output: {
  //   scale: 0.7486,
  //   scalingMode: 'shrink',
  //   contentHeight: 1500,
  //   pageHeight: 1123,
  //   finalHeight: 1122.9,
  //   verticalUtilization: 99.99,
  //   recommendation: 'Shrinking by 25.14% to fit content...'
  // }

  // Scenario 2: Content fits perfectly
  const result2 = calculateOptimalScale(1100);
  console.log(result2);
  // Output: {
  //   scale: 1.0209,
  //   scalingMode: 'expand',
  //   ...
  // }

  // Scenario 3: Content is very small (needs expansion)
  const result3 = calculateOptimalScale(800);
  console.log(result3);
  // Output: {
  //   scale: 1.4038,
  //   scalingMode: 'expand',
  //   ...
  // }
}

// ============================================
// EXAMPLE 5: Validate Template Configuration
// ============================================

import { validateTemplate } from '../utils/pdfOptimizer.js';

export function example_validateTemplateConfig() {
  // Valid template
  const valid = validateTemplate(1);
  console.log(valid);
  // Output: {
  //   valid: true,
  //   templateId: 1,
  //   name: 'Simple Classic',
  //   safeZone: { top: 36, bottom: 36, left: 36, right: 36 }
  // }

  // Invalid template
  const invalid = validateTemplate(99);
  console.log(invalid);
  // Output: {
  //   valid: false,
  //   error: 'Template 99 not found. Valid range: 1-15',
  //   templateId: 99
  // }
}

// ============================================
// EXAMPLE 6: Format Debug Information
// ============================================

import { formatDebugInfo, calculateOptimalScale, validateTemplate } from '../utils/pdfOptimizer.js';

export function example_formatDebugOutput() {
  const scaleResult = calculateOptimalScale(1050);
  const templateValidation = validateTemplate(2);

  const debugOutput = formatDebugInfo(scaleResult, templateValidation);
  console.log(debugOutput);

  // Output:
  // 📊 PDF GENERATION DEBUG INFO:
  // ==================================================
  // Template: Professional Sidebar (ID: 2)
  // Safe Zone: T:32px B:32px L:32px R:32px
  // 
  // Content Measurements:
  //   Content Height: 1050px
  //   Page Height:    1123px
  //   Ratio:          0.935
  // 
  // Scaling Result:
  //   Mode:                EXPAND
  //   Scale Factor:        1.0696
  //   Final Height:        1123px
  //   Page Utilization:    100.00%
  // 
  // Recommendation:
  //   Expanding by 6.96% to fill page (100.00% page utilization)
  // ==================================================
}

// ============================================
// EXAMPLE 7: Express Route Handler with Debug
// ============================================

import express from 'express';
import { generateResumePDF } from '../services/pdfService.js';
import { formatDebugInfo, calculateOptimalScale, validateTemplate } from '../utils/pdfOptimizer.js';

const router = express.Router();

router.get('/api/resumes/:id/download', async (req, res) => {
  try {
    const resumeId = req.params.id;
    const debugMode = req.query.debug === 'true';

    // Fetch resume from database
    const resume = await getResumeFromDB(resumeId);

    // Generate PDF with debug option
    const pdfBuffer = await generateResumePDF(
      resume.resume_data,
      resume.template_id,
      { debugMode }
    );

    // Optional: Log scaling info
    if (debugMode) {
      const scaleResult = calculateOptimalScale(resume.content_height || 1050);
      const templateValidation = validateTemplate(resume.template_id);
      console.log(formatDebugInfo(scaleResult, templateValidation));
    }

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=resume-${resumeId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 8: Pre-flight Validation in API
// ============================================

import { validateResumeDataForPDF } from '../utils/pdfOptimizer.js';

router.post('/api/resumes/:id/validate', async (req, res) => {
  try {
    const resumeData = req.body.resumeData;

    // Validate data before PDF generation
    const errors = validateResumeDataForPDF(resumeData);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Resume data validation failed',
        errors,
      });
    }

    res.json({
      success: true,
      message: 'Resume data is valid for PDF generation',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXAMPLE 9: Complete PDF Generation Pipeline
// ============================================

import { generateResumePDF } from '../services/pdfService.js';
import { validateResumeDataForPDF } from '../utils/pdfOptimizer.js';
import { TemplateValidator } from '../utils/templateValidator.js';

export async function example_completePipeline(resumeData, templateId) {
  console.log("\n🚀 Starting PDF generation pipeline...\n");

  try {
    // Step 1: Validate input data
    console.log("1️⃣  Validating resume data...");
    const dataErrors = validateResumeDataForPDF(resumeData);
    if (dataErrors.length > 0) {
      throw new Error(`Data validation failed: ${dataErrors.join(', ')}`);
    }
    console.log("   ✅ Resume data valid\n");

    // Step 2: Validate template
    console.log("2️⃣  Validating template...");
    const templateValidation = validateTemplate(templateId);
    if (!templateValidation.valid) {
      throw new Error(templateValidation.error);
    }
    console.log(`   ✅ Template valid: ${templateValidation.name}\n`);

    // Step 3: Generate PDF
    console.log("3️⃣  Generating PDF...");
    const pdfBuffer = await generateResumePDF(
      resumeData,
      templateId,
      { debugMode: true }
    );
    console.log(`   ✅ PDF generated (${pdfBuffer.length} bytes)\n`);

    // Step 4: Return result
    return {
      success: true,
      buffer: pdfBuffer,
      size: pdfBuffer.length,
      template: templateValidation.name,
    };
  } catch (error) {
    console.error("   ❌ Pipeline failed:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// EXAMPLE 10: Performance Monitoring
// ============================================

export async function example_performanceMonitoring() {
  const metrics = {
    startTime: Date.now(),
  };

  try {
    const resumeData = { /* ... */ };

    const start = Date.now();
    const pdfBuffer = await generateResumePDF(resumeData, 1, { debugMode: true });
    const duration = Date.now() - start;

    metrics.endTime = Date.now();
    metrics.pdfGenerationTime = duration;
    metrics.pdfSize = pdfBuffer.length;
    metrics.totalTime = metrics.endTime - metrics.startTime;

    console.log("\n📊 Performance Metrics:");
    console.log(`   Generation time: ${metrics.pdfGenerationTime}ms`);
    console.log(`   PDF size: ${(metrics.pdfSize / 1024).toFixed(2)} KB`);
    console.log(`   Total time: ${metrics.totalTime}ms\n`);

    return metrics;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// Usage: Call any example function
// ============================================

// Uncomment to run examples:
// example_basicGeneration();
// example_debugMode();
// example_validateTemplate();
// example_calculateScaling();
// example_validateTemplateConfig();
// example_formatDebugOutput();
// example_completePipeline(sampleData, 1);
// example_performanceMonitoring();

export default {
  example_basicGeneration,
  example_debugMode,
  example_validateTemplate,
  example_calculateScaling,
  example_validateTemplateConfig,
  example_formatDebugOutput,
  example_completePipeline,
  example_performanceMonitoring,
};
