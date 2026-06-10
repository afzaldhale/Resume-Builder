import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const outputDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./compare-modern-parity-output");
await fs.promises.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
page.on("console", (msg) => {
  console.log("[PAGE]", msg.text());
});
page.on("pageerror", (err) => {
  console.error("[PAGEERROR]", err.message);
});

const url = process.env.COMPARE_URL || "http://127.0.0.1:8080/compare-modern-parity.html";
console.log(`Navigating to ${url}`);
await page.goto(url, { waitUntil: ["load", "networkidle0"], timeout: 60000 });
await page.waitForFunction("window.__comparisonReport__ && window.__comparisonReport__.length === 5", { timeout: 60000 });

const report = await page.evaluate(() => window.__comparisonReport__);

for (const entry of report) {
  const { templateId } = entry;
  const sharedRoot = await page.$(`#shared-${templateId} .resume-theme-root`);
  const modernRoot = await page.$(`#modern-${templateId} .resume-theme-root`);
  if (!sharedRoot || !modernRoot) {
    throw new Error(`Could not find renderer roots for template ${templateId}`);
  }

  const sharedPath = path.join(outputDir, `template-${templateId}-shared.png`);
  const modernPath = path.join(outputDir, `template-${templateId}-modern.png`);
  const sharedBuffer = await sharedRoot.screenshot({ omitBackground: true });
  const modernBuffer = await modernRoot.screenshot({ omitBackground: true });
  await fs.promises.writeFile(sharedPath, sharedBuffer);
  await fs.promises.writeFile(modernPath, modernBuffer);

  const bytesMatch = sharedBuffer.length === modernBuffer.length && sharedBuffer.equals(modernBuffer);
  entry.screenshotMatch = bytesMatch;
  if (!bytesMatch) {
    const diffPath = path.join(outputDir, `template-${templateId}-diff.txt`);
    await fs.promises.writeFile(diffPath, `Shared size: ${sharedBuffer.length}\nModern size: ${modernBuffer.length}`);
  }
}

const jsonPath = path.join(outputDir, "comparison-report.json");
await fs.promises.writeFile(jsonPath, JSON.stringify(report, null, 2));
console.log(`Comparison report written to ${jsonPath}`);
await browser.close();
