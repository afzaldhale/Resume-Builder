import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateResumePDF } from "../src/services/pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturePath = path.join(__dirname, "fixtures", "resume101.json");
const outDir = path.join(__dirname, "..", "artifacts");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const resumeData = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const templates = [1, 3, 6];

const run = async () => {
  for (const id of templates) {
    console.log(`Generating PDF for template ${id}...`);
    try {
      const pdf = await generateResumePDF(resumeData, id, { debugMode: false });
      const outPath = path.join(outDir, `resume-template-${id}.pdf`);
      fs.writeFileSync(outPath, pdf);
      console.log(`Saved ${outPath} (${pdf.length} bytes)`);
    } catch (err) {
      console.error(`Failed to generate template ${id}:`, err.message || err);
    }
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
