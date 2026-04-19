import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
const DEBUG_SCREENSHOT_PATH = "debug.png";

export const generateResumePDF = async ({ resumeId, renderToken }) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const pdfUrl = `${FRONTEND_URL}/resume/${resumeId}/pdf?pdfToken=${encodeURIComponent(renderToken)}`;

    page.on("console", (message) => {
      const text = message.text();
      if (text.startsWith("RESUME_METRICS")) {
        return;
      }
      console.log(`[PDF page console:${message.type()}] ${text}`);
    });

    page.on("pageerror", (error) => {
      console.error("[PDF page error]", error);
    });

    page.on("requestfailed", (request) => {
      console.error(
        `[PDF request failed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText}`
      );
    });

    page.on("response", async (response) => {
      const url = response.url();

      if (
        url.includes("/api/resumes/") &&
        (url.includes("/render-data") || url.includes(`/${resumeId}`))
      ) {
        console.log(`[PDF API response] ${response.status()} ${url}`);
      }
    });

    await page.goto(pdfUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    console.log(`Opened PDF route: ${pdfUrl}`);
    console.log("Waiting for resume render...");
    await page.waitForSelector("#resume-ready", {
      timeout: 60000,
    });

    await page.waitForFunction(() => window.__RESUME_METRICS__ !== undefined && window.__RESUME_METRICS__ !== null, {
      timeout: 60000,
    });

    const metrics = await page.evaluate(() => window.__RESUME_METRICS__);
    console.log("Resume Layout Metrics:");
    console.log(JSON.stringify(metrics, null, 2));

    const renderState = await page.waitForFunction(
      () => {
        if (window.__RESUME_ERROR__) {
          return {
            ready: false,
            error: window.__RESUME_ERROR__,
          };
        }

        if (window.__RESUME_READY__ === true) {
          return {
            ready: true,
            error: null,
          };
        }

        return null;
      },
      {
        timeout: 60000,
      }
    );

    const resolvedRenderState = await renderState.jsonValue();

    if (!resolvedRenderState?.ready) {
      throw new Error(
        `Resume page failed before render ready: ${resolvedRenderState?.error || "unknown error"}`
      );
    }

    await page.evaluateHandle("document.fonts.ready");
    await page.screenshot({ path: DEBUG_SCREENSHOT_PATH, fullPage: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Resume render detected.");

    await page.emulateMediaType("screen");

    return await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });
  } catch (error) {
    if (browser) {
      console.error("PDF generation browser flow failed:", error);
    }

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
