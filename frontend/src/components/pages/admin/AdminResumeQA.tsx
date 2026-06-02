import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCheck, CircleCheck, AlertTriangle, XSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeDocument from "@/components/resume-templates/ResumeDocument";
import { STRESS_RESUME_DATASETS } from "@/components/resume-templates/stressDatasets";
import { templateThemes } from "@/components/resume-templates/templateThemes";
import { A4_HEIGHT_PX } from "@/constants/resumeDesignSystem";
import type { ResumeData } from "@/components/resume-templates/types";

const themeIds = Object.keys(templateThemes).map(Number).sort((a, b) => a - b);

interface TestCase {
  caseId: string;
  templateId: number;
  themeName: string;
  datasetId: string;
  datasetLabel: string;
  data: ResumeData;
}

interface TestMetrics {
  scrollHeight: number;
  offsetHeight: number;
  clientHeight: number;
  initialScrollHeight: number;
  finalScrollHeight: number;
  overflowBefore: boolean;
  overflowAfter: boolean;
  compactLevel: number;
  a4Overflow: boolean;
  sidebarOverflow: boolean;
  hiddenContent: boolean;
  duplicateContent: boolean;
  textClipping: boolean;
  pageHeightValidation: boolean;
  status: "PASS" | "WARNING" | "FAIL";
  notes: string[];
}

const buildTestCases = (): TestCase[] => {
  return STRESS_RESUME_DATASETS.flatMap((dataset) =>
    themeIds.map((templateId) => ({
      caseId: `${dataset.id}-${templateId}`,
      templateId,
      themeName: templateThemes[templateId]?.name || `Template ${templateId}`,
      datasetId: dataset.id,
      datasetLabel: dataset.label,
      data: dataset.data,
    }))
  );
};

const buildStatus = ({
  a4Overflow,
  pageHeightValidation,
  sidebarOverflow,
  textClipping,
  hiddenContent,
  duplicateContent,
}: Omit<TestMetrics, "scrollHeight" | "offsetHeight" | "clientHeight" | "status" | "notes">) => {
  if (a4Overflow || pageHeightValidation || sidebarOverflow || textClipping) {
    return "FAIL" as const;
  }

  if (hiddenContent || duplicateContent) {
    return "WARNING" as const;
  }

  return "PASS" as const;
};

const openPrintWindow = (templateId: number, resumeData: ResumeData) => {
  const printWindow = window.open("/print/resume?mode=pdf", "_blank");
  if (!printWindow) {
    return;
  }

  try {
    printWindow.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData };
    printWindow.dispatchEvent(new CustomEvent("resume-print-payload"));
    printWindow.focus();
  } catch {
    // ignore cross-window assignment errors if unexpected origin mismatch
  }
};

const AdminResumeQA = () => {
  const testCases = useMemo(buildTestCases, []);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const [metricsMap, setMetricsMap] = useState<Record<string, TestMetrics>>({});

  useEffect(() => {
    const nextMetrics: Record<string, TestMetrics> = {};

    testCases.forEach((testCase) => {
      const container = refs.current[testCase.caseId];
      if (!container) {
        return;
      }

      const resumeRoot = container.querySelector<HTMLElement>(".resume-document-shell");
      const initialScrollHeight = Number(resumeRoot?.dataset.initialScrollHeight ?? 0);
      const finalScrollHeight = Number(resumeRoot?.dataset.finalScrollHeight ?? 0);
      const overflowBefore = resumeRoot?.dataset.initialOverflow === "true";
      const overflowAfter = resumeRoot?.dataset.finalOverflow === "true";
      const scrollHeight = resumeRoot ? finalScrollHeight : container.scrollHeight;
      const offsetHeight = container.offsetHeight;
      const clientHeight = container.clientHeight;
      const a4Overflow = overflowAfter || scrollHeight > A4_HEIGHT_PX || offsetHeight > A4_HEIGHT_PX || clientHeight > A4_HEIGHT_PX;
      const pageHeightValidation = offsetHeight > A4_HEIGHT_PX || finalScrollHeight > A4_HEIGHT_PX;

      const sidebarElement = container.querySelector<HTMLElement>(".resume-sidebar");
      const sidebarOverflow = Boolean(
        sidebarElement &&
          (sidebarElement.scrollWidth > sidebarElement.clientWidth + 1 ||
            sidebarElement.scrollHeight > sidebarElement.clientHeight + 1)
      );

      const hiddenContent = Array.from(container.querySelectorAll<HTMLElement>("*")).some((element) => {
        const style = getComputedStyle(element);
        return (
          (style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden") &&
          element.scrollHeight > element.clientHeight
        );
      });

      const rootText = container.innerText || "";
      const duplicateContent = (() => {
        const lines = rootText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 40);

        const counts = lines.reduce<Record<string, number>>((acc, line) => {
          acc[line] = (acc[line] || 0) + 1;
          return acc;
        }, {});

        return Object.values(counts).some((count) => count > 1);
      })();

      const textClipping = Array.from(container.querySelectorAll<HTMLElement>("*")).some((element) => {
        const style = getComputedStyle(element);
        return style.textOverflow === "ellipsis" && style.overflow === "hidden";
      });

      const status = buildStatus({
        a4Overflow,
        sidebarOverflow,
        hiddenContent,
        duplicateContent,
        textClipping,
        pageHeightValidation,
      });

      const compactLevel = Number(container.dataset.compactLevel ?? 0);
      const notes: string[] = [];
      if (a4Overflow) {
        notes.push("A4 overflow detected");
      }
      if (pageHeightValidation) {
        notes.push("Rendered height exceeds A4 page height");
      }
      if (sidebarOverflow) {
        notes.push("Sidebar overflow detected");
      }
      if (hiddenContent) {
        notes.push("Potential hidden content due to overflow:hidden");
      }
      if (duplicateContent) {
        notes.push("Duplicate content detected");
      }
      if (textClipping) {
        notes.push("Text clipping style detected");
      }

      nextMetrics[testCase.caseId] = {
        scrollHeight,
        offsetHeight,
        clientHeight,
        initialScrollHeight,
        finalScrollHeight,
        overflowBefore,
        overflowAfter,
        compactLevel,
        a4Overflow,
        sidebarOverflow,
        hiddenContent,
        duplicateContent,
        textClipping,
        pageHeightValidation,
        status,
        notes,
      };
    });

    setMetricsMap(nextMetrics);
  }, [testCases]);

  // Observe DOM changes inside each resume container so we can capture
  // final measurements after the resume auto-fit loop finishes.
  useEffect(() => {
    const observers: MutationObserver[] = [];

    testCases.forEach((testCase) => {
      const container = refs.current[testCase.caseId];
      if (!container) return;

      const target = container.querySelector<HTMLElement>('.resume-document-shell') || container;

      const obs = new MutationObserver(() => {
        const resumeRoot = container.querySelector<HTMLElement>('.resume-document-shell');
        const initialScrollHeight = Number(resumeRoot?.dataset.initialScrollHeight ?? 0);
        const finalScrollHeight = Number(resumeRoot?.dataset.finalScrollHeight ?? 0);
        const overflowBefore = resumeRoot?.dataset.initialOverflow === 'true';
        const overflowAfter = resumeRoot?.dataset.finalOverflow === 'true';
        const compactLevel = Number(resumeRoot?.dataset.compactLevel ?? 0);

        const scrollHeight = finalScrollHeight || container.scrollHeight;
        const offsetHeight = container.offsetHeight;
        const clientHeight = container.clientHeight;
        const a4Overflow = overflowAfter || scrollHeight > A4_HEIGHT_PX || offsetHeight > A4_HEIGHT_PX || clientHeight > A4_HEIGHT_PX;
        const pageHeightValidation = offsetHeight > A4_HEIGHT_PX || finalScrollHeight > A4_HEIGHT_PX;

        const sidebarElement = container.querySelector<HTMLElement>('.resume-sidebar');
        const sidebarOverflow = Boolean(
          sidebarElement &&
            (sidebarElement.scrollWidth > sidebarElement.clientWidth + 1 ||
              sidebarElement.scrollHeight > sidebarElement.clientHeight + 1)
        );

        const hiddenContent = Array.from(container.querySelectorAll<HTMLElement>('*')).some((element) => {
          const style = getComputedStyle(element);
          return (
            (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden') &&
            element.scrollHeight > element.clientHeight
          );
        });

        const rootText = container.innerText || '';
        const duplicateContent = (() => {
          const lines = rootText
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 40);

          const counts = lines.reduce<Record<string, number>>((acc, line) => {
            acc[line] = (acc[line] || 0) + 1;
            return acc;
          }, {});

          return Object.values(counts).some((count) => count > 1);
        })();

        const textClipping = Array.from(container.querySelectorAll<HTMLElement>('*')).some((element) => {
          const style = getComputedStyle(element);
          return style.textOverflow === 'ellipsis' && style.overflow === 'hidden';
        });

        const status = buildStatus({
          a4Overflow,
          sidebarOverflow,
          hiddenContent,
          duplicateContent,
          textClipping,
          pageHeightValidation,
        });

        const notes: string[] = [];
        if (a4Overflow) notes.push('A4 overflow detected');
        if (pageHeightValidation) notes.push('Rendered height exceeds A4 page height');
        if (sidebarOverflow) notes.push('Sidebar overflow detected');
        if (hiddenContent) notes.push('Potential hidden content due to overflow:hidden');
        if (duplicateContent) notes.push('Duplicate content detected');
        if (textClipping) notes.push('Text clipping style detected');

        setMetricsMap((prev) => ({
          ...prev,
          [testCase.caseId]: {
            scrollHeight,
            offsetHeight,
            clientHeight,
            initialScrollHeight,
            finalScrollHeight,
            overflowBefore: Boolean(overflowBefore),
            overflowAfter: Boolean(overflowAfter),
            compactLevel,
            a4Overflow,
            sidebarOverflow,
            hiddenContent,
            duplicateContent,
            textClipping,
            pageHeightValidation,
            status,
            notes,
          },
        }));
      });

      obs.observe(target, { attributes: true, subtree: true, childList: true, characterData: true });
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [testCases]);

  const totalRuns = testCases.length;
  const passCount = Object.values(metricsMap).filter((metrics) => metrics.status === "PASS").length;
  const warningCount = Object.values(metricsMap).filter((metrics) => metrics.status === "WARNING").length;
  const failCount = Object.values(metricsMap).filter((metrics) => metrics.status === "FAIL").length;
  const passRate = totalRuns ? Math.round((passCount / totalRuns) * 100) : 0;
  const overflowAfterLevel6Cases = testCases
    .filter((testCase) => {
      const metrics = metricsMap[testCase.caseId];
      return metrics?.overflowAfter && metrics.compactLevel >= 6;
    })
    .map((testCase) => `${testCase.themeName} — Dataset ${testCase.datasetId}`);

  return (
    <div className="admin-resume-qa px-6 py-6 space-y-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resume QA Dashboard</h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Internal QA route for validating all production resume themes against four stress datasets.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase text-muted-foreground">Themes</p>
              <p className="text-xl font-semibold">15</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase text-muted-foreground">Dataset runs</p>
              <p className="text-xl font-semibold">{totalRuns}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase text-muted-foreground">Pass rate</p>
              <p className="text-xl font-semibold">{passRate}%</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase text-muted-foreground">Warnings / Fails</p>
              <p className="text-xl font-semibold">{warningCount} / {failCount}</p>
            </div>
          </div>
        </div>
        {overflowAfterLevel6Cases.length > 0 ? (
          <div className="rounded-3xl border border-border bg-background p-4">
            <p className="text-sm font-semibold text-destructive">Still overflowing after compact level 6</p>
            <p className="mt-2 text-sm text-muted-foreground">
              These cases may need template-level tuning because the automatic fitting engine hit its maximum compaction.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {overflowAfterLevel6Cases.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {testCases.map((testCase) => {
          const metrics = metricsMap[testCase.caseId];
          const statusIcon =
            metrics?.status === "PASS"
              ? <CircleCheck className="h-5 w-5 text-emerald-600" />
              : metrics?.status === "WARNING"
              ? <AlertTriangle className="h-5 w-5 text-amber-600" />
              : <XSquare className="h-5 w-5 text-destructive" />;

          return (
            <section
              key={testCase.caseId}
              className="rounded-3xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Dataset {testCase.datasetId}</span>
                    <span>•</span>
                    <span>Theme {testCase.templateId}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{testCase.themeName}</h2>
                  <p className="text-sm text-muted-foreground">{testCase.datasetLabel}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                    {statusIcon}
                    {metrics?.status ?? "Pending"}
                  </span>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => openPrintWindow(testCase.templateId, testCase.data)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate PDF
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-border bg-background p-3">
                  <div
                    className="qa-resume-container overflow-hidden rounded-xl bg-white"
                    ref={(element) => {
                      refs.current[testCase.caseId] = element;
                    }}
                    style={{ width: `${A4_HEIGHT_PX * 0.65}px`, minHeight: `${A4_HEIGHT_PX * 0.65}px` }}
                  >
                    <ResumeDocument
                      templateId={testCase.templateId}
                      data={testCase.data}
                      className="mx-auto"
                      renderMode="pdf"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted p-3 text-sm">
                    <p className="font-semibold">Metrics</p>
                    <ul className="mt-2 space-y-1">
                      <li>Before: {metrics?.initialScrollHeight ? `${metrics.initialScrollHeight}px` : "—"}</li>
                      <li>After: {metrics?.finalScrollHeight ? `${metrics.finalScrollHeight}px` : "—"}</li>
                      <li>Compact level: {metrics?.compactLevel ?? 0}</li>
                      <li>Overflow before: {metrics?.overflowBefore ? "✗" : "✓"}</li>
                      <li>Overflow after: {metrics?.overflowAfter ? "✗" : "✓"}</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted p-3 text-sm">
                    <p className="font-semibold">Checks</p>
                    <ul className="mt-2 space-y-1">
                      <li>A4 overflow: {metrics?.a4Overflow ? "✗" : "✓"}</li>
                      <li>Hidden content: {metrics?.hiddenContent ? "✗" : "✓"}</li>
                      <li>Sidebar overflow: {metrics?.sidebarOverflow ? "✗" : "✓"}</li>
                      <li>Duplicate content: {metrics?.duplicateContent ? "⚠" : "✓"}</li>
                      <li>Page height: {metrics?.pageHeightValidation ? "✗" : "✓"}</li>
                      <li>Text clipping: {metrics?.textClipping ? "✗" : "✓"}</li>
                    </ul>
                  </div>
                </div>

                {metrics?.notes.length ? (
                  <div className="rounded-2xl border border-border bg-background p-3 text-sm text-destructive">
                    <p className="font-semibold">Notes</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      {metrics.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AdminResumeQA;
