import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

/**
 * PDF Header Loss Investigation Script
 * Audits all 8 potential causes of missing header in generated PDFs
 */

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const FRONTEND_RENDER_URL =
  process.env.PDF_RENDER_URL ||
  process.env.FRONTEND_URL ||
  "http://127.0.0.1:8080";

const debugDir = "./debug-output";
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

const writeDebugFile = (filename, content) => {
  const filepath = path.join(debugDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
  console.log(`   Wrote: ${filepath}`);
};

const writeBinaryFile = (filename, buffer) => {
  const filepath = path.join(debugDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`   Wrote: ${filepath}`);
};

export const debugPDFHeaderLoss = async (resumeData, templateId) => {
  let browser;
  console.log("\n=== PDF HEADER LOSS AUDIT ===\n");

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    // Enable console logging
    page.on("console", (msg) => {
      try {
        console.log(`[page-console] ${msg.type().toUpperCase()}: ${msg.text()}`);
      } catch (e) {}
    });

    page.on("pageerror", (err) =>
      console.error(`[page-error] ${err.message}`)
    );

    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX * 10,
      deviceScaleFactor: 1,
    });

    const printUrl = `${FRONTEND_RENDER_URL.replace(/\/$/, "")}/print/resume?mode=pdf`;
    console.log("1️⃣  NAVIGATING TO PRINT ROUTE");
    console.log(`   URL: ${printUrl}\n`);

    await page.emulateMediaType("screen");
    await page.goto(printUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    // AUDIT 2: Verify Puppeteer capture timing - SET PAYLOAD FIRST
    console.log("\n3️⃣  AUDIT 2: PUPPETEER CAPTURE TIMING");
    console.log("   Setting payload and waiting for pagination...");

    const normalizedResumeData = {
      ...resumeData,
      fullName: resumeData.fullName || "",
      role: resumeData.role || "",
      email: resumeData.email || "",
      phone: resumeData.phone || "",
      address: resumeData.address || "",
      summary: resumeData.summary || "",
      careerObjective: resumeData.careerObjective || "",
      candidateType: resumeData.candidateType || "fresher",
      education: Array.isArray(resumeData.education) ? resumeData.education : [],
      experience: Array.isArray(resumeData.experience)
        ? resumeData.experience
        : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
      certifications: Array.isArray(resumeData.certifications)
        ? resumeData.certifications
        : [],
      languages: Array.isArray(resumeData.languages)
        ? resumeData.languages
        : [],
      strengths: Array.isArray(resumeData.strengths)
        ? resumeData.strengths
        : [],
      hobbies: Array.isArray(resumeData.hobbies) ? resumeData.hobbies : [],
      achievements: Array.isArray(resumeData.achievements)
        ? resumeData.achievements
        : [],
      references: Array.isArray(resumeData.references)
        ? resumeData.references
        : [],
      customSections: Array.isArray(resumeData.customSections)
        ? resumeData.customSections
        : [],
      socialLinks: Array.isArray(resumeData.socialLinks)
        ? resumeData.socialLinks
        : [],
      theme: resumeData.theme,
    };

    await page.evaluate(
      ({ nextTemplateId, nextResumeData }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove("resume-print-ready");
        document.documentElement.removeAttribute("data-resume-print-ready");
        window.__RESUME_PRINT_PAYLOAD__ = {
          templateId: nextTemplateId,
          resumeData: nextResumeData,
        };
        window.dispatchEvent(new Event("resume-print-payload"));
      },
      {
        nextTemplateId: templateId,
        nextResumeData: normalizedResumeData,
      }
    );

    // Wait for payload to be processed by React
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const timerStart = Date.now();
    try {
      await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, {
        timeout: 30000,
      });
      const readyTime = Date.now() - timerStart;
      console.log(`   ✓ RESUME_PRINT_READY signal received in ${readyTime}ms`);
    } catch (e) {
      console.error(`   ✗ Timeout waiting for RESUME_PRINT_READY`);
      // Log what state we're in
      const debugState = await page.evaluate(() => ({
        payloadExists: !!window.__RESUME_PRINT_PAYLOAD__,
        payloadHasResumeData: !!window.__RESUME_PRINT_PAYLOAD__?.resumeData,
        printReady: window.__RESUME_PRINT_READY__,
        displayText: document.querySelector(".resume-print-loading")?.textContent,
        reactError: document.querySelector(".resume-print-loading") ? "Still loading" : "Component rendered",
      }));
      console.log(`   Debug state:`, debugState);
      throw e;
    }

    // AUDIT 1: Compare DOM before PDF generation - NOW AFTER PAYLOAD
    console.log("\n2️⃣  AUDIT 1: DOM BEFORE PDF GENERATION");
    console.log("   Capturing DOM snapshot...");

    const domSnapshot = await page.evaluate(() => {
      const resumePage = document.querySelector(".resume-page");
      const resumeThemeRoot = document.querySelector(".resume-theme-root");
      const resumeHeader = document.querySelector("header[class*='resume']");
      const fullName = document.querySelector("h1");
      const role = document.querySelector("p[style*='uppercase']");

      // Get the actual rendered structure
      const mainContent = document.querySelector(".resume-document-scale");
      const htmlStructure = mainContent ? mainContent.innerHTML.substring(0, 2000) : null;

      return {
        hasResumePageElement: !!resumePage,
        hasResumeThemeRoot: !!resumeThemeRoot,
        hasHeader: !!resumeHeader,
        hasNameElement: !!fullName,
        hasRoleElement: !!role,
        resumePageInnerHTML: resumePage
          ? resumePage.innerHTML.substring(0, 500)
          : null,
        nameContent: fullName?.textContent?.substring(0, 100) || null,
        roleContent: role?.textContent?.substring(0, 100) || null,
        htmlStructure,
        documentBody: document.body.innerHTML.substring(0, 1000),
        // Check for all possible header elements
        allHeaders: Array.from(document.querySelectorAll("header")).map((h, i) => ({
          index: i,
          classes: h.className,
          content: h.textContent.substring(0, 100),
          html: h.innerHTML.substring(0, 200),
        })),
        // Check structure within resume-page
        resumePageStructure: resumePage ? Array.from(resumePage.children).map((child, i) => ({
          index: i,
          tag: child.tagName,
          classes: child.className,
          text: child.textContent.substring(0, 50),
        })) : null,
      };
    });

    writeDebugFile("1-dom-snapshot.json", domSnapshot);
    console.log(`   ✓ .resume-page exists: ${domSnapshot.hasResumePageElement}`);
    console.log(`   ✓ .resume-theme-root exists: ${domSnapshot.hasResumeThemeRoot}`);
    console.log(`   ✓ Header element exists: ${domSnapshot.hasHeader}`);
    console.log(`   ✓ Found ${domSnapshot.allHeaders.length} header elements`);
    if (domSnapshot.allHeaders.length > 0) {
      domSnapshot.allHeaders.forEach((h) => {
        console.log(`     - Header ${h.index}: classes="${h.classes}" content="${h.content}..."`);
      });
    }
    if (domSnapshot.nameContent) {
      console.log(`   ✓ Name text: "${domSnapshot.nameContent}..."`);
    }
    if (domSnapshot.roleContent) {
      console.log(`   ✓ Role text: "${domSnapshot.roleContent}..."`);
    }
    console.log(`   Page structure (first few children):`);
    if (domSnapshot.resumePageStructure) {
      domSnapshot.resumePageStructure.slice(0, 3).forEach((child) => {
        console.log(`     - ${child.tag} (classes: ${child.classes}) - "${child.text}..."`);
      });
    }

    // Check pagination status
    const paginationStatus = await page.evaluate(() => {
      const pages = Array.from(
        document.querySelectorAll(".resume-theme-root.resume-page, .resume-page")
      );
      return {
        pageCount: pages.length,
        pages: pages.map((page, i) => ({
          index: i,
          scrollHeight: page.scrollHeight,
          clientHeight: page.clientHeight,
          offsetTop: page.offsetTop,
          hasHeader: !!page.querySelector("header"),
          headerContent:
            page.querySelector("header h1")?.textContent || "NO HEADER",
        })),
      };
    });

    writeDebugFile("2-pagination-status.json", paginationStatus);
    console.log(`   ✓ Total pages detected: ${paginationStatus.pageCount}`);
    paginationStatus.pages.forEach((p) => {
      console.log(
        `     - Page ${p.index + 1}: height=${p.scrollHeight}px, hasHeader=${
          p.hasHeader
        }, header="${p.headerContent}"`
      );
    });

    // AUDIT 3: Verify print CSS
    console.log("\n4️⃣  AUDIT 3: PRINT CSS INSPECTION");
    console.log("   Checking @media print rules...");

    const printCSSAudit = await page.evaluate(() => {
      const cssRules = [];

      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (
              rule.type === CSSRule.MEDIA_RULE &&
              rule.media.mediaText.includes("print")
            ) {
              cssRules.push({
                mediaQuery: rule.media.mediaText,
                ruleCount: rule.cssRules.length,
                sampleRules: Array.from(rule.cssRules)
                  .slice(0, 5)
                  .map((r) => r.cssText),
              });
            }
          }
        } catch (e) {
          // Cross-origin stylesheets may throw
        }
      }

      // Check computed styles for problematic properties
      const header = document.querySelector("header");
      const firstPage = document.querySelector(".resume-page");

      return {
        printMediaRulesFound: cssRules.length,
        cssRules,
        headerComputedStyles: header
          ? {
              display: window.getComputedStyle(header).display,
              visibility: window.getComputedStyle(header).visibility,
              opacity: window.getComputedStyle(header).opacity,
              position: window.getComputedStyle(header).position,
              overflow: window.getComputedStyle(header).overflow,
            }
          : null,
        firstPageComputedStyles: firstPage
          ? {
              display: window.getComputedStyle(firstPage).display,
              overflow: window.getComputedStyle(firstPage).overflow,
            }
          : null,
      };
    });

    writeDebugFile("3-print-css-audit.json", printCSSAudit);
    console.log(`   ✓ Print media rules found: ${printCSSAudit.printMediaRulesFound}`);
    if (printCSSAudit.headerComputedStyles) {
      console.log(`   Header computed styles:`);
      console.log(
        `     - display: ${printCSSAudit.headerComputedStyles.display}`
      );
      console.log(
        `     - visibility: ${printCSSAudit.headerComputedStyles.visibility}`
      );
      console.log(
        `     - opacity: ${printCSSAudit.headerComputedStyles.opacity}`
      );
      console.log(
        `     - position: ${printCSSAudit.headerComputedStyles.position}`
      );
      console.log(
        `     - overflow: ${printCSSAudit.headerComputedStyles.overflow}`
      );
    }

    // AUDIT 4: Verify page clipping
    console.log("\n5️⃣  AUDIT 4: PAGE CLIPPING DETECTION");
    console.log("   Measuring first page container...");

    const clippingAudit = await page.evaluate(() => {
      const firstPage = document.querySelector(".resume-page");
      if (!firstPage) return { error: "No .resume-page found" };

      const rect = firstPage.getBoundingClientRect();
      const headerEl = firstPage.querySelector("header");
      const headerRect = headerEl
        ? headerEl.getBoundingClientRect()
        : { top: 0, bottom: 0, height: 0 };

      return {
        firstPageRect: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          width: rect.width,
        },
        headerRect: {
          top: headerRect.top,
          bottom: headerRect.bottom,
          height: headerRect.height,
        },
        headerTopRelativeToPage: headerRect.top - rect.top,
        scrollHeight: firstPage.scrollHeight,
        clientHeight: firstPage.clientHeight,
        offsetHeight: firstPage.offsetHeight,
        headerIsAbovePageBoundary:
          headerRect.top < rect.top || headerRect.bottom > rect.bottom,
      };
    });

    writeDebugFile("4-clipping-audit.json", clippingAudit);
    if (!clippingAudit.error) {
      console.log(
        `   ✓ First page height: ${clippingAudit.scrollHeight}px (client: ${clippingAudit.clientHeight}px)`
      );
      console.log(
        `   ✓ Header relative to page top: ${clippingAudit.headerTopRelativeToPage}px`
      );
      console.log(
        `   ✓ Header clipped: ${clippingAudit.headerIsAbovePageBoundary}`
      );
    }

    // AUDIT 5: Take screenshot before PDF
    console.log("\n6️⃣  AUDIT 5: SCREENSHOT BEFORE PDF");
    console.log("   Capturing full page screenshot...");

    await page.screenshot({
      path: path.join(debugDir, "5-before-pdf-fullpage.png"),
      fullPage: true,
    });
    console.log("   ✓ Screenshot saved: 5-before-pdf-fullpage.png");

    await page.screenshot({
      path: path.join(debugDir, "5-before-pdf-viewport.png"),
      fullPage: false,
    });
    console.log("   ✓ Viewport screenshot saved: 5-before-pdf-viewport.png");

    // AUDIT 6: Verify print route
    console.log("\n7️⃣  AUDIT 6: PRINT ROUTE VERIFICATION");
    console.log("   Checking component structure...");

    const routeAudit = await page.evaluate(() => {
      return {
        url: window.location.href,
        mode: new URLSearchParams(window.location.search).get("mode"),
        bodyClasses: document.body.className,
        htmlClasses: document.documentElement.className,
        hasResumeDocument: !!document.querySelector(".resume-document-shell"),
        hasThemedTemplate: !!document.querySelector(".resume-theme-root"),
        pdfRenderMode: document.documentElement.classList.contains(
          "pdf-render-mode"
        ),
      };
    });

    writeDebugFile("6-route-audit.json", routeAudit);
    console.log(`   ✓ URL: ${routeAudit.url}`);
    console.log(`   ✓ Mode param: ${routeAudit.mode}`);
    console.log(`   ✓ PDF render mode active: ${routeAudit.pdfRenderMode}`);
    console.log(`   ✓ Component structure intact: ${routeAudit.hasThemedTemplate}`);

    // AUDIT 7: Generate PDF and log details
    console.log("\n8️⃣  AUDIT 7: PDF GENERATION");
    console.log("   Generating PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
      scale: 1,
    });

    writeBinaryFile("7-generated.pdf", pdfBuffer);
    console.log(`   ✓ PDF generated: ${pdfBuffer.length} bytes`);

    // AUDIT 8: Final verdict
    console.log("\n9️⃣  AUDIT 8: FINAL VERDICT");
    const hasHeaderInDOM = domSnapshot.hasHeader && domSnapshot.hasNameElement;
    const hasHeaderOnFirstPage = paginationStatus.pages[0]?.hasHeader;

    writeDebugFile("8-audit-summary.json", {
      timestamp: new Date().toISOString(),
      templateId,
      headerInDOM: hasHeaderInDOM,
      headerOnFirstPage: hasHeaderOnFirstPage,
      paginationOccurred:
        paginationStatus.pageCount > 1 ||
        paginationStatus.pages.some((p) => p.scrollHeight > A4_HEIGHT_PX),
      diagnostics: {
        domSnapshot,
        paginationStatus,
        printCSSAudit,
        clippingAudit,
        routeAudit,
      },
    });

    console.log("\n=== DIAGNOSIS ===\n");
    if (!hasHeaderInDOM) {
      console.log(
        "❌ ISSUE FOUND: Header not in DOM before PDF generation"
      );
      console.log("   The print route is not rendering ResumeHeader properly");
      return { issue: "HEADER_NOT_IN_DOM", severity: "CRITICAL" };
    }

    if (!hasHeaderOnFirstPage) {
      console.log("❌ ISSUE FOUND: Header present in DOM but not on first page");
      console.log("   Pagination may be removing the header from page 1");
      return {
        issue: "HEADER_REMOVED_BY_PAGINATION",
        severity: "HIGH",
      };
    }

    if (clippingAudit.headerIsAbovePageBoundary) {
      console.log("❌ ISSUE FOUND: Header extends above page boundary");
      console.log("   Page container may be clipping header content");
      return { issue: "HEADER_CLIPPED_BY_PAGE", severity: "HIGH" };
    }

    console.log(
      "✅ No issues detected! Header is present in DOM and should appear in PDF"
    );
    console.log("\n   Review the generated screenshots and PDF to verify output");
    console.log("   Check 5-before-pdf-fullpage.png for visual confirmation");

    return { issue: "NONE", severity: "OK" };
  } catch (error) {
    console.error("\n❌ Audit failed:", error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log(`\n📁 Debug files written to: ${debugDir}`);
    console.log("   Review these files for detailed diagnostics:");
    console.log("   - 1-dom-snapshot.json");
    console.log("   - 2-pagination-status.json");
    console.log("   - 3-print-css-audit.json");
    console.log("   - 4-clipping-audit.json");
    console.log("   - 5-before-pdf-*.png");
    console.log("   - 6-route-audit.json");
    console.log("   - 8-audit-summary.json");
  }
};

export default debugPDFHeaderLoss;
