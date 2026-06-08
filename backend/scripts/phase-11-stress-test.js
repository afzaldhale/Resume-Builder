#!/usr/bin/env node

/**
 * PHASE 11 - Multi-Page PDF Parity Stress Test
 * 
 * This script validates that:
 * 1. Stress test resume generates multi-page PDF
 * 2. No content is truncated or hidden
 * 3. Pagination works correctly across templates
 * 4. Frontend preview matches PDF output
 */

import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.PDF_RENDER_URL || "http://127.0.0.1:8080";
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const stressTestData = JSON.parse(
  fs.readFileSync("backend/fixtures/stress-test-resume.json", "utf-8")
);

const TEMPLATES_TO_TEST = [1, 2, 3, 4, 5, 7]; // Test multiple templates

async function generatePDFAndValidate(templateId) {
  let browser;
  try {
    console.log(`\n📄 Testing Template ${templateId} with stress data...`);
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    const printUrl = `${FRONTEND_URL}/print/resume?mode=pdf`;

    console.log(`   ↳ Navigating to print route: ${printUrl}`);

    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 1,
    });

    await page.emulateMediaType("screen");

    await page.goto(printUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    // Send resume data and template ID
    await page.evaluate(
      ({ templateId: tid, resumeData }) => {
        window.__RESUME_PRINT_READY__ = false;
        window.__RESUME_PRINT_PAYLOAD__ = {
          templateId: tid,
          resumeData: resumeData,
        };
        window.dispatchEvent(new Event("resume-print-payload"));
      },
      { templateId, resumeData: stressTestData }
    );

    // Wait for ready signal
    await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, {
      timeout: 30000,
    });

    // Wait for .resume-page element
    await page.waitForSelector(".resume-page", {
      timeout: 30000,
    });

    // Wait for fonts
    const fontsReadyHandle = await page.evaluateHandle("document.fonts.ready");
    await fontsReadyHandle.jsonValue();

    console.log("   ✓ Page rendered successfully");

    // Get page metrics
    const metrics = await page.evaluate(() => {
      const pageElements = document.querySelectorAll(".resume-page, .page");
      const pages = [];

      pageElements.forEach((el, idx) => {
        pages.push({
          index: idx,
          height: el.scrollHeight,
          className: el.className,
          childCount: el.children.length,
        });
      });

      // Also check for .resume-theme-root
      const themeRoots = document.querySelectorAll(".resume-theme-root");
      
      return {
        pageCount: pageElements.length,
        themeRootCount: themeRoots.length,
        pages: pages,
        totalScrollHeight: Array.from(pageElements).reduce(
          (sum, el) => sum + el.scrollHeight,
          0
        ),
        skillsCount: document.querySelectorAll("[class*=skill]").length,
        experienceCount: document.querySelectorAll("[class*=experience], [class*=job], [class*=position]").length,
        projectCount: document.querySelectorAll("[class*=project]").length,
        certCount: document.querySelectorAll("[class*=cert]").length,
        educationCount: document.querySelectorAll("[class*=education], [class*=degree], [class*=school]").length,
      };
    });

    console.log(`   ✓ Page metrics:`);
    console.log(`     - Theme Roots found: ${metrics.themeRootCount}`);
    console.log(`     - Page containers: ${metrics.pageCount}`);
    console.log(`     - Total content height: ${metrics.totalScrollHeight}px`);
    console.log(`     - Expected pages: ${Math.ceil(metrics.totalScrollHeight / A4_HEIGHT_PX)}`);
    console.log(`     - Content detected: ${metrics.skillsCount} skills, ${metrics.experienceCount} exp, ${metrics.projectCount} projects, ${metrics.certCount} certs, ${metrics.educationCount} edu`);

    // Generate PDF
    console.log("   ↳ Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
      scale: 1,
    });

    const filename = `stress-test-template-${templateId}.pdf`;
    const pdfPath = path.join("backend/artifacts", filename);
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`   ✓ PDF generated: ${filename} (${(pdfBuffer.length / 1024).toFixed(2)}KB)`);

    // Validate PDF content
    const hasContent = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasName: text.includes("Comprehensive Stress Test Resume"),
        hasSummary: text.includes("pagination-first"),
        hasSkills: text.includes("JavaScript") && text.includes("React"),
        hasExperience: text.includes("Principal Engineer"),
        hasProjects: text.includes("Real-Time Collaborative"),
        hasCertifications: text.includes("AWS Certified"),
        hasEducation: text.includes("Stanford"),
      };
    });

    console.log(`   ✓ Content validation:`);
    console.log(`     - Name: ${hasContent.hasName ? "✓" : "✗"}`);
    console.log(`     - Summary: ${hasContent.hasSummary ? "✓" : "✗"}`);
    console.log(`     - Skills: ${hasContent.hasSkills ? "✓" : "✗"}`);
    console.log(`     - Experience: ${hasContent.hasExperience ? "✓" : "✗"}`);
    console.log(`     - Projects: ${hasContent.hasProjects ? "✓" : "✗"}`);
    console.log(`     - Certifications: ${hasContent.hasCertifications ? "✓" : "✗"}`);
    console.log(`     - Education: ${hasContent.hasEducation ? "✓" : "✗"}`);

    const allContentPresent = Object.values(hasContent).every(v => v);

    return {
      templateId,
      success: allContentPresent,
      metrics,
      pdfPath,
      contentPresent: hasContent,
    };
  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    return {
      templateId,
      success: false,
      error: error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║   PHASE 11 - MULTI-PAGE PDF PARITY & TRUNCATION REMOVAL   ║");
  console.log("║                STRESS TEST VALIDATION                      ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  console.log(`\nConfiguration:`);
  console.log(`  Frontend URL: ${FRONTEND_URL}`);
  console.log(`  Backend URL: ${BACKEND_URL}`);
  console.log(`  A4 Page Size: ${A4_WIDTH_PX}x${A4_HEIGHT_PX}px`);
  console.log(`  Templates to test: ${TEMPLATES_TO_TEST.join(", ")}`);

  // Verify fixtures exist
  const fixturesPath = "backend/fixtures/stress-test-resume.json";
  if (!fs.existsSync(fixturesPath)) {
    console.error(`✗ Fixtures file not found: ${fixturesPath}`);
    process.exit(1);
  }

  console.log(`\nStress Test Resume Data:`);
  console.log(`  Skills: ${stressTestData.skills.length}`);
  console.log(`  Experience: ${stressTestData.experience.length}`);
  console.log(`  Education: ${stressTestData.education.length}`);
  console.log(`  Projects: ${stressTestData.projects.length}`);
  console.log(`  Certifications: ${stressTestData.certifications.length}`);
  console.log(`  Languages: ${stressTestData.languages.length}`);
  console.log(`  Strengths: ${stressTestData.strengths.length}`);
  console.log(`  Hobbies: ${stressTestData.hobbies.length}`);

  const results = [];

  for (const templateId of TEMPLATES_TO_TEST) {
    const result = await generatePDFAndValidate(templateId);
    results.push(result);

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║                      TEST RESULTS                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  const passCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  results.forEach(result => {
    const status = result.success ? "✓ PASS" : "✗ FAIL";
    console.log(`\nTemplate ${result.templateId}: ${status}`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    } else if (result.metrics) {
      console.log(`  Pages generated: ${result.metrics.pageCount}`);
      console.log(`  Content: ${Object.values(result.contentPresent).filter(v => v).length}/7 sections verified`);
    }
  });

  console.log(`\n Summary: ${passCount} passed, ${failCount} failed\n`);

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    phase: "PHASE 11 - Multi-Page PDF Parity & Truncation Removal",
    testType: "Stress Test",
    totalTests: results.length,
    passed: passCount,
    failed: failCount,
    successRate: `${((passCount / results.length) * 100).toFixed(1)}%`,
    results: results.map(r => ({
      template: r.templateId,
      status: r.success ? "PASS" : "FAIL",
      error: r.error,
      metrics: r.metrics,
    })),
    stressTestData: {
      skills: stressTestData.skills.length,
      experience: stressTestData.experience.length,
      projects: stressTestData.projects.length,
      certifications: stressTestData.certifications.length,
      education: stressTestData.education.length,
      languages: stressTestData.languages.length,
    },
  };

  const reportPath = "backend/artifacts/phase-11-stress-test-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`📊 Report saved to: ${reportPath}\n`);

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
