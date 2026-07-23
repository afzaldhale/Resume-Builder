import puppeteer from "puppeteer";
import { logger } from "../logger.js";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const FRONTEND_RENDER_URL =
  process.env.PDF_RENDER_URL ||
  process.env.FRONTEND_URL ||
  "http://127.0.0.1:8080";

const TEMPLATE_NAMES = {
  1: "Recruiter Choice",
  2: "Premium Executive",
  3: "Prime Executive",
  4: "Elite Executive",
  5: "Executive Signature",
  6: "Executive Edge",
  7: "Classic Executive",
  8: "Corporate Standard",
  9: "Career Pro",
  10: "Classic Professional",
  11: "Corporate Professional",
  12: "Modern Professional",
  13: "Career Essential",
  14: "Career Prime",
  15: "Executive Prestige",
};

const normalizeResumeData = (resumeData = {}) => ({
  ...resumeData,
  fullName: resumeData.fullName || "",
  role: resumeData.role || "",
  email: resumeData.email || "",
  phone: resumeData.phone || "",
  address: resumeData.address || "",
  summary: resumeData.summary || "",
  careerObjective: resumeData.careerObjective || "",
  candidateType:
    resumeData.candidateType ||
    ((resumeData.experience || []).length === 0 ? "fresher" : "experienced"),
  education: Array.isArray(resumeData.education) ? resumeData.education : [],
  experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
  projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
  skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
  certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
  languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
  strengths: Array.isArray(resumeData.strengths) ? resumeData.strengths : [],
  hobbies: Array.isArray(resumeData.hobbies) ? resumeData.hobbies : [],
  achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
  references: Array.isArray(resumeData.references) ? resumeData.references : [],
  customSections: Array.isArray(resumeData.customSections) ? resumeData.customSections : [],
  socialLinks: Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks : [],
  theme: resumeData.theme || undefined,
});

const getSafeTemplateId = (templateId) => {
  const id = Number.parseInt(templateId, 10);
  return Number.isInteger(id) && TEMPLATE_NAMES[id] ? id : 1;
};

const getPrintRenderUrl = (debugMode = false) =>
  `${FRONTEND_RENDER_URL.replace(/\/$/, "")}/print/resume?mode=pdf${debugMode ? "&debug=1" : ""}`;

let processDiagnosticsAttached = false;

const nowMs = () => Number(process.hrtime.bigint()) / 1_000_000;

const summarizeError = (error) => {
  if (!error) return null;

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code,
    cause: error.cause,
  };
};

const getPrimaryStackFrame = (error) => {
  const stack = error?.stack || "";
  const frame = stack
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("at ") && !line.includes("node:internal"));

  if (!frame) {
    return null;
  }

  const match =
    frame.match(/^at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)$/) ||
    frame.match(/^at\s+(.*?):(\d+):(\d+)$/);

  if (!match) {
    return { raw: frame };
  }

  if (match.length === 5) {
    return {
      functionName: match[1],
      file: match[2],
      line: Number(match[3]),
      column: Number(match[4]),
      raw: frame,
    };
  }

  return {
    functionName: "(anonymous)",
    file: match[1],
    line: Number(match[2]),
    column: Number(match[3]),
    raw: frame,
  };
};

const attachProcessDiagnostics = () => {
  if (processDiagnosticsAttached) {
    return;
  }

  processDiagnosticsAttached = true;

  process.on("unhandledRejection", (reason) => {
    logger.error("[pdf-diag][node][unhandledRejection]", {
      reason: summarizeError(reason instanceof Error ? reason : new Error(String(reason))),
    });
  });

  process.on("uncaughtException", (error) => {
    logger.error("[pdf-diag][node][uncaughtException]", {
      error: summarizeError(error),
      stackFrame: getPrimaryStackFrame(error),
    });
  });
};

const buildPdfDiagId = () =>
  `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createStageLogger = (diagId, scope, getLocals) => {
  let currentStage = `${scope}:init`;

  const log = (level, message, meta = {}) => {
    logger[level](`[pdf-diag][${diagId}][${scope}] ${message}`, meta);
  };

  const runStage = async (stageName, localValues, action) => {
    const startedAt = nowMs();
    currentStage = stageName;

    log("info", "Entered stage", {
      stage: stageName,
      locals: localValues,
      context: getLocals(),
    });

    try {
      const result = await action();
      log("info", "Completed stage", {
        stage: stageName,
        durationMs: Number((nowMs() - startedAt).toFixed(2)),
        locals: localValues,
        context: getLocals(),
      });
      return result;
    } catch (error) {
      log("error", "Stage threw exception", {
        stage: stageName,
        durationMs: Number((nowMs() - startedAt).toFixed(2)),
        locals: localValues,
        context: getLocals(),
        error: summarizeError(error),
        stackFrame: getPrimaryStackFrame(error),
      });
      throw error;
    }
  };

  return {
    log,
    runStage,
    getCurrentStage: () => currentStage,
  };
};

const collectPageDiagnostics = async (page) => {
  if (!page) {
    return {
      pageCount: null,
      resumePageCount: null,
      imageCount: null,
      pendingImageCount: null,
      failedImageCount: null,
      url: null,
      readyState: null,
      printReady: null,
    };
  }

  try {
    return await page.evaluate(() => {
      const images = Array.from(document.images || []);
      const failedImageCount = images.filter((img) => img.complete && img.naturalWidth === 0).length;
      const pendingImageCount = images.filter((img) => !img.complete).length;

      return {
        url: window.location.href,
        readyState: document.readyState,
        pageCount: document.querySelectorAll(".page").length,
        resumePageCount: document.querySelectorAll(".resume-page").length,
        imageCount: images.length,
        pendingImageCount,
        failedImageCount,
        fontStatus: document.fonts?.status || "unsupported",
        printReady: window.__RESUME_PRINT_READY__ === true,
      };
    });
  } catch (error) {
    return {
      pageCount: null,
      resumePageCount: null,
      imageCount: null,
      pendingImageCount: null,
      failedImageCount: null,
      url: null,
      readyState: null,
      printReady: null,
      diagnosticsError: summarizeError(error),
    };
  }
};

export const generateResumePDF = async (resumeData, templateId, options = {}) => {
  attachProcessDiagnostics();

  let browser;
  let page;
  const diagnostics = {
    consoleLogs: [],
    pageErrors: [],
    requestFailures: [],
    unhandledPageEvents: [],
  };
  const { debugMode = false } = options;
  const safeTemplateId = getSafeTemplateId(templateId);
  const normalizedResumeData = normalizeResumeData(resumeData);
  const renderUrl = getPrintRenderUrl(debugMode);
  const diagId = buildPdfDiagId();
  const startedAt = nowMs();
  const stageLogger = createStageLogger(diagId, "generateResumePDF", () => ({
    safeTemplateId,
    requestedTemplateId: templateId,
    renderUrl,
    debugMode,
    normalizedCounts: {
      education: normalizedResumeData.education.length,
      experience: normalizedResumeData.experience.length,
      projects: normalizedResumeData.projects.length,
      skills: normalizedResumeData.skills.length,
      certifications: normalizedResumeData.certifications.length,
      languages: normalizedResumeData.languages.length,
    },
  }));

  try {
    stageLogger.log("info", "Entered pipeline", {
      totalDurationMs: 0,
    });

    if (safeTemplateId !== Number.parseInt(templateId, 10)) {
      console.warn(
        `   Invalid or missing template ID "${templateId}" received. Falling back to template ${safeTemplateId}.`
      );
    }

    browser = await stageLogger.runStage(
      "Browser launch",
      {
        headless: debugMode ? false : "new",
        argsCount: 12,
      },
      () =>
        puppeteer.launch({
          headless: debugMode ? false : "new",
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer",
            "--force-color-profile=srgb",
            "--font-render-hinting=medium",
            "--disable-background-networking",
            "--disable-breakpad",
            "--disable-client-side-phishing-detection",
            "--disable-component-extensions-with-background-pages",
            "--disable-default-apps",
            "--disable-extensions",
          ],
          defaultViewport: null,
        })
    );

    page = await stageLogger.runStage("Create page", {}, async () => {
      const nextPage = await browser.newPage();

      nextPage.on("console", (msg) => {
        diagnostics.consoleLogs.push({
          type: msg.type(),
          text: msg.text(),
        });
      });
      nextPage.on("pageerror", (err) => {
        diagnostics.pageErrors.push({
          message: err.message,
          stack: err.stack,
        });
      });
      nextPage.on("requestfailed", (request) => {
        diagnostics.requestFailures.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
          failure: request.failure(),
        });
      });

      return nextPage;
    });

    await stageLogger.runStage(
      "Viewport setup",
      {
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX * 10,
      },
      async () => {
        await page.setViewport({
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX * 10,
          deviceScaleFactor: 1,
        });
        await page.emulateMediaType("screen");
      }
    );

    const gotoResponse = await stageLogger.runStage(
      "page.goto()",
      {
        renderUrl,
        waitUntil: ["domcontentloaded", "networkidle0"],
      },
      () =>
        page.goto(renderUrl, {
          waitUntil: ["domcontentloaded", "networkidle0"],
          timeout: 30000,
        })
    );

    stageLogger.log("info", "Completed stage", {
      stage: "Network idle",
      durationMs: 0,
      locals: {
        responseStatus: gotoResponse?.status() ?? null,
        responseOk: gotoResponse?.ok() ?? null,
        finalUrl: page.url(),
        redirectedFrom: gotoResponse?.request()?.redirectChain()?.map((request) => request.url()) || [],
      },
      context: {
        ...(await collectPageDiagnostics(page)),
      },
    });

    await stageLogger.runStage(
      "Dispatch print payload",
      {
        templateId: safeTemplateId,
      },
      () =>
        page.evaluate(
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
            nextTemplateId: safeTemplateId,
            nextResumeData: normalizedResumeData,
          }
        )
    );

    await stageLogger.runStage(
      "Pagination",
      {},
      async () => {
        await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, {
          timeout: 30000,
        });
      }
    );

    await stageLogger.runStage(
      "waitForSelector(\".resume-page\")",
      {},
      async () => {
        await page.waitForSelector(".resume-page", {
          timeout: 30000,
        });
      }
    );

    await stageLogger.runStage("Cleanup", {}, async () => {
      const pageStats = await collectPageDiagnostics(page);
      stageLogger.log("info", "Cleanup inspection", {
        stage: "Cleanup",
        locals: pageStats,
        context: {
          consoleLogCount: diagnostics.consoleLogs.length,
          pageErrorCount: diagnostics.pageErrors.length,
          requestFailureCount: diagnostics.requestFailures.length,
        },
      });
    });

    await stageLogger.runStage("Font loading", {}, async () => {
      const fontsReadyHandle = await page.evaluateHandle("document.fonts.ready");
      await fontsReadyHandle.jsonValue();
    });

    await stageLogger.runStage("Image loading", {}, async () => {
      const imageStats = await collectPageDiagnostics(page);
      stageLogger.log("info", "Image inspection", {
        stage: "Image loading",
        locals: imageStats,
        context: {},
      });
    });

    const pdfBuffer = await stageLogger.runStage("page.pdf()", {}, async () =>
      page.pdf({
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
      })
    );

    await stageLogger.runStage(
      "Buffer generation",
      {
        bufferBytes: pdfBuffer.length,
      },
      async () => {}
    );

    stageLogger.log("info", "Completed pipeline", {
      totalDurationMs: Number((nowMs() - startedAt).toFixed(2)),
      finalPageDiagnostics: await collectPageDiagnostics(page),
      browserConsoleLogs: diagnostics.consoleLogs,
      pageErrors: diagnostics.pageErrors,
      requestFailures: diagnostics.requestFailures,
    });

    return pdfBuffer;
  } catch (error) {
    stageLogger.log("error", "Pipeline threw", {
      totalDurationMs: Number((nowMs() - startedAt).toFixed(2)),
      currentStage: stageLogger.getCurrentStage(),
      error: summarizeError(error),
      stackFrame: getPrimaryStackFrame(error),
      localVariables: {
        safeTemplateId,
        requestedTemplateId: templateId,
        renderUrl,
        debugMode,
        pageDiagnostics: await collectPageDiagnostics(page),
      },
      browserConsoleLogs: diagnostics.consoleLogs,
      pageErrors: diagnostics.pageErrors,
      requestFailures: diagnostics.requestFailures,
    });
    throw error;
  } finally {
    if (browser) {
      const closeStart = nowMs();
      await browser.close();
      stageLogger.log("info", "Completed stage", {
        stage: "Browser close",
        durationMs: Number((nowMs() - closeStart).toFixed(2)),
      });
    }
  }
};

export const getAvailableTemplates = () =>
  Object.entries(TEMPLATE_NAMES).map(([id, name]) => ({
    id: Number(id),
    name,
    status: "available",
  }));

export const isValidTemplateId = (templateId) => {
  const id = Number.parseInt(templateId, 10);
  return Number.isInteger(id) && Boolean(TEMPLATE_NAMES[id]);
};

export const getTemplateInfo = (templateId) => {
  const id = getSafeTemplateId(templateId);
  if (!isValidTemplateId(id)) return null;

  return {
    id,
    name: TEMPLATE_NAMES[id],
    available: true,
  };
};

export const getTemplatePreview = (templateId) => {
  const id = getSafeTemplateId(templateId);
  return `<div>Preview is rendered by the frontend print route using template ${id}: ${TEMPLATE_NAMES[id]}</div>`;
};

export const getTemplateStatus = (templateId) => {
  return isValidTemplateId(templateId) ? "available" : "invalid";
};
