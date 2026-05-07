import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateResumePDF } from "../src/services/pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturePath = path.join(__dirname, "fixtures", "resume101.json");
const resumeData = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const run = async () => {
  const results = [];

  for (let templateId = 1; templateId <= 15; templateId += 1) {
    try {
      const pdf = await generateResumePDF(resumeData, templateId, { debugMode: false });
      results.push({ templateId, ok: true, size: pdf.length });
      console.log(`OK template ${templateId}: ${pdf.length} bytes`);
    } catch (error) {
      results.push({ templateId, ok: false, error: error.message });
      console.log(`FAIL template ${templateId}: ${error.message}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
