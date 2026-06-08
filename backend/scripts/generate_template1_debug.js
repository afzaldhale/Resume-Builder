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

const run = async () => {
  try {
    console.log("Generating debug PDF for template 1...");
    const pdf = await generateResumePDF(resumeData, 1, { debugMode: true });
    const outPath = path.join(outDir, `resume-template-1-debug.pdf`);
    fs.writeFileSync(outPath, pdf);
    console.log(`Saved ${outPath} (${pdf.length} bytes)`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
};

run();
