import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";
import UserSidebar from "@/components/UserSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TemplateSelector,
  getTemplateById,
} from "@/components/resume-templates/TemplateSelector";
import { CandidateType } from "@/types/resumeDataConverter";

const DRAFT_STORAGE_KEY = "resume-builder-draft";

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [candidateType, setCandidateType] = useState<CandidateType>("fresher");
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  useEffect(() => {
    const queryType = searchParams.get("type");
    const queryTemplate = Number(searchParams.get("template"));

    if (queryType === "fresher" || queryType === "experienced") {
      setCandidateType(queryType);
    }

    if (Number.isInteger(queryTemplate) && queryTemplate > 0) {
      setSelectedTemplate(queryTemplate);
      return;
    }

    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!draft) {
      return;
    }

    try {
      const parsed = JSON.parse(draft);

      if (parsed.candidateType === "fresher" || parsed.candidateType === "experienced") {
        setCandidateType(parsed.candidateType);
      }

      if (Number.isInteger(parsed.selectedTemplate) && parsed.selectedTemplate > 0) {
        setSelectedTemplate(parsed.selectedTemplate);
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, [searchParams]);

  const handleUseTemplate = (templateId: number) => {
    const nextTemplate = getTemplateById(templateId);

    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || "{}"),
        candidateType,
        selectedTemplate: nextTemplate.id,
      })
    );

    navigate(`/builder/editor?template=${nextTemplate.id}&type=${candidateType}`);
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)]">
      <UserSidebar />

      <main className="flex-1 px-4 pb-10 pt-20 md:px-8 md:pt-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Choose Resume Template
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 md:text-base">
              Select a professional template to start building your resume.
            </p>
          </div>

          <Card className="border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Candidate Type</p>
                <p className="text-sm text-slate-500">
                  Choose the flow that matches your resume stage.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={candidateType === "fresher" ? "default" : "outline"}
                  className="h-auto justify-start gap-3 px-4 py-3"
                  onClick={() => setCandidateType("fresher")}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-left">
                    <span className="block text-sm font-semibold">Fresher</span>
                    <span className="block text-xs opacity-80">Students and early-career candidates</span>
                  </span>
                </Button>

                <Button
                  type="button"
                  variant={candidateType === "experienced" ? "default" : "outline"}
                  className="h-auto justify-start gap-3 px-4 py-3"
                  onClick={() => setCandidateType("experienced")}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="text-left">
                    <span className="block text-sm font-semibold">Experienced</span>
                    <span className="block text-xs opacity-80">Professionals with work history</span>
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Available Templates</h2>
                <p className="text-sm text-slate-500">
                  Preview layouts, then jump straight into the editor.
                </p>
              </div>

              <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
                {candidateType === "fresher" ? "Fresher flow" : "Experienced flow"}
              </span>
            </div>

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onUseTemplate={handleUseTemplate}
              actionLabel="Use Template"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateSelectionPage;
