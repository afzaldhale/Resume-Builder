import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  FileText,
  Github,
  Globe,
  Linkedin,
  Plus,
  Save,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import UserSidebar from "@/components/UserSidebar";
import EmptyTemplate from "@/components/resume-templates/EmptyTemplate";
import ResumeDocument from "@/components/resume-templates/ResumeDocument";

import {
  CertificationItem,
  LanguageItem,
  ResumeThemeConfigData,
  SocialLink,
} from "@/components/resume-templates/types";
import {
  getTemplateById,
} from "@/components/resume-templates/TemplateSelector";
import {
  PROFESSIONAL_COLOR_PRESETS,
  getTemplateThemeConfig,
  hasThemeContrastWarning,
  mergeThemeColors,
  type TemplateColorKey,
} from "@/components/resume-templates/themeConfig";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { resumeService } from "@/services/resumeService";
import {
  CandidateType,
  FormData,
  clearFormData,
  convertFromTemplateData,
  convertToTemplateData,
  generateSampleData,
} from "@/types/resumeDataConverter";

const DRAFT_STORAGE_KEY = "resume-builder-draft";
const PREVIEW_SCALE = 0.75;

const createDefaultFormData = (): FormData => ({
  fullName: "",
  email: "",
  phone: "",
  role: "",
  address: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
  projects: "",
  strengths: "",
  hobbies: "",
});

const createThemePayload = (
  templateId: number,
  colors: Record<string, string>
): ResumeThemeConfigData => ({
  templateId,
  colors: mergeThemeColors(templateId, colors),
});

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();

  const editingResumeId = id;
  const requestedTemplateParam = searchParams.get("template");
  const requestedTemplateId = Number(requestedTemplateParam);
  const requestedTypeParam = searchParams.get("type");
  const requestedCandidateType: CandidateType =
    requestedTypeParam === "experienced" ? "experienced" : "fresher";

  const [selectedTemplate, setSelectedTemplate] = useState(
    Number.isFinite(requestedTemplateId) && requestedTemplateId > 0
      ? getTemplateById(requestedTemplateId).id
      : 1
  );
  const [candidateType, setCandidateType] = useState<CandidateType>(requestedCandidateType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeStatus, setResumeStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [formData, setFormData] = useState<FormData>(createDefaultFormData());
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { language: "English", level: "Native" },
  ]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [themeColors, setThemeColors] = useState<Record<string, string>>(
    mergeThemeColors(
      Number.isFinite(requestedTemplateId) && requestedTemplateId > 0
        ? getTemplateById(requestedTemplateId).id
        : 1,
      {}
    )
  );
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(true);
  const [newLanguage, setNewLanguage] = useState<LanguageItem>({
    language: "",
    level: "Intermediate",
  });
  const [newCertification, setNewCertification] = useState<CertificationItem>({
    name: "",
    issuer: "",
    year: "",
  });
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "LinkedIn",
    url: "",
  });

  useEffect(() => {
    if (!editingResumeId && !requestedTemplateParam) {
      navigate("/builder", { replace: true });
    }
  }, [editingResumeId, navigate, requestedTemplateParam]);

  useEffect(() => {
    if (editingResumeId) {
      return;
    }

    const nextTemplateId = getTemplateById(requestedTemplateId).id;
    setSelectedTemplate(nextTemplateId);
    setCandidateType(requestedCandidateType);
    setThemeColors((prev) => mergeThemeColors(nextTemplateId, prev));
    setResumeStatus(null);
  }, [editingResumeId, requestedCandidateType, requestedTemplateId]);

  const persistDraft = (options?: { showToast?: boolean }) => {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        formData,
        languages,
        certifications,
        socialLinks,
        candidateType,
        selectedTemplate,
        themeColors,
      })
    );
    setSaveStatus("saved");

    if (options?.showToast) {
      toast.success("Draft saved");
    }
  };

  useEffect(() => {
    if (editingResumeId) {
      return;
    }

    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!draft) {
      return;
    }

    try {
      const parsed = JSON.parse(draft);
      if (parsed.formData) setFormData(parsed.formData);
      if (parsed.languages) setLanguages(parsed.languages);
      if (parsed.certifications) setCertifications(parsed.certifications);
      if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
      if (parsed.themeColors) {
        setThemeColors(mergeThemeColors(getTemplateById(requestedTemplateId).id, parsed.themeColors));
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, [editingResumeId]);

  useEffect(() => {
    if (!editingResumeId || !user?.uid) {
      return;
    }

    const loadResume = async () => {
      try {
        setIsLoadingResume(true);
        const resume = await resumeService.getResumeById(user.uid, editingResumeId);

        if (!resume) {
          throw new Error("Resume not found");
        }

        const parsed = convertFromTemplateData(resume.resumeData);
        setFormData(parsed.formData);
        setLanguages(parsed.languages);
        setCertifications(parsed.certifications);
        setSocialLinks(parsed.socialLinks);
        setCandidateType(parsed.candidateType);
        const nextTemplateId = getTemplateById(Number(resume.templateId) || 1).id;
        setSelectedTemplate(nextTemplateId);
        setThemeColors(mergeThemeColors(nextTemplateId, parsed.theme?.colors));
        setResumeStatus(resume.status || null);
      } catch (error) {
        console.error("Load resume error:", error);
        toast.error("Failed to load resume");
        navigate("/builder", { replace: true });
      } finally {
        setIsLoadingResume(false);
      }
    };

    loadResume();
  }, [editingResumeId, navigate, user?.uid]);

  useEffect(() => {
    setSaveStatus("saving");

    const timer = window.setTimeout(() => {
      persistDraft();
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [candidateType, certifications, formData, languages, selectedTemplate, socialLinks, themeColors]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadSampleData = () => {
    const sampleData = generateSampleData(candidateType);
    setFormData(sampleData.formData);
    setLanguages(sampleData.languages);
    setCertifications(sampleData.certifications);
    setSocialLinks(sampleData.socialLinks);
    toast.success(`${candidateType === "experienced" ? "Experienced" : "Fresher"} sample data loaded`);
  };

  const handleClearForm = () => {
    if (!window.confirm("Are you sure you want to clear all form data?")) {
      return;
    }

    const clearedData = clearFormData(candidateType);
    setFormData(clearedData.formData);
    setLanguages(clearedData.languages);
    setCertifications(clearedData.certifications);
    setSocialLinks(clearedData.socialLinks);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setSaveStatus("idle");
    toast.info("Form cleared");
  };

  const handleRequestDownload = async () => {
    if (!user?.uid) {
      toast.error("Please log in to save your resume");
      return;
    }

    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in at least your name and email");
      return;
    }

    setIsSubmitting(true);

    try {
      const resumeData = convertToTemplateData(
        formData,
        languages,
        certifications,
        socialLinks,
        candidateType,
        createThemePayload(selectedTemplate, themeColors)
      );

      const title = `${formData.fullName} Resume - ${
        candidateType === "experienced" ? "Experienced" : "Fresher"
      }`;

      let resumeId = editingResumeId;

      if (editingResumeId) {
        await resumeService.updateResume(user.uid, editingResumeId, {
          title,
          resumeData,
          templateId: selectedTemplate,
        });
        toast.success("Resume updated successfully");
      } else {
        const result = await resumeService.createResume(
          user.uid,
          resumeData,
          selectedTemplate,
          title
        );
        resumeId = result.id;
        toast.success("Resume created successfully");
      }

      if (resumeId) {
        await resumeService.requestDownload(user.uid, resumeId);
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      navigate("/requests");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!editingResumeId) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      window.open(`${API_BASE_URL}/api/resumes/${editingResumeId}/pdf`, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Unable to open PDF download");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const addLanguage = () => {
    if (!newLanguage.language.trim()) {
      return;
    }

    setLanguages((prev) => [...prev, { ...newLanguage }]);
    setNewLanguage({ language: "", level: "Intermediate" });
    toast.success("Language added");
  };

  const removeLanguage = (index: number) => {
    setLanguages((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const addCertification = () => {
    if (!newCertification.name.trim()) {
      return;
    }

    setCertifications((prev) => [...prev, { ...newCertification }]);
    setNewCertification({ name: "", issuer: "", year: "" });
    toast.success("Certification added");
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) {
      return;
    }

    setSocialLinks((prev) => [...prev, { ...newSocialLink }]);
    setNewSocialLink({ platform: "LinkedIn", url: "" });
    toast.success("Social link added");
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const templateData = useMemo(
    () =>
      convertToTemplateData(
        formData,
        languages,
        certifications,
        socialLinks,
        candidateType,
        createThemePayload(selectedTemplate, themeColors)
      ),
    [candidateType, certifications, formData, languages, selectedTemplate, socialLinks, themeColors]
  );

  const deferredTemplateData = useDeferredValue(templateData);
  const deferredSelectedTemplate = useDeferredValue(selectedTemplate);
  const selectedTemplateMeta = getTemplateById(selectedTemplate);
  const themeConfig = getTemplateThemeConfig(selectedTemplate);
  const mergedThemeColors = mergeThemeColors(selectedTemplate, themeColors);
  const showThemeWarning = hasThemeContrastWarning(selectedTemplate, themeColors);

  const handleThemeColorChange = (key: TemplateColorKey, value: string) => {
    setThemeColors((prev) => ({
      ...prev,
      ...mergeThemeColors(selectedTemplate, prev),
      [key]: value,
    }));
  };

  const handleResetThemeColors = () => {
    setThemeColors(mergeThemeColors(selectedTemplate, {}));
    toast.success("Template colors reset");
  };

  const formPanel = (
    <div className="space-y-6">
      <Card className="border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Resume Form</h2>
            <p className="text-sm text-slate-500">
              Complete your details and the preview updates automatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleLoadSampleData}>
              Load Sample
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleClearForm}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 p-5 shadow-sm">
        <div className="space-y-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setIsThemePanelOpen((prev) => !prev)}
          >
            <div>
              <h3 className="text-base font-semibold text-slate-900">Customize Colors</h3>
              <p className="text-sm text-slate-500">
                Adjust only the colors that apply to {selectedTemplateMeta.name}.
              </p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                isThemePanelOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isThemePanelOpen ? (
            <div className="space-y-5">
              {themeConfig.editableColors.map((field) => (
                <div key={field.key} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`theme-${field.key}`}>{field.label}</Label>
                    <span className="font-mono text-xs text-slate-500">
                      {themeColors[field.key] || mergedThemeColors[field.key] || "#000000"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Input
                      id={`theme-${field.key}`}
                      type="color"
                      value={mergedThemeColors[field.key] || "#000000"}
                      onChange={(event) => handleThemeColorChange(field.key, event.target.value)}
                      className="h-11 w-16 cursor-pointer p-1"
                    />
                    <Input
                      value={themeColors[field.key] || mergedThemeColors[field.key] || "#000000"}
                      onChange={(event) => handleThemeColorChange(field.key, event.target.value)}
                      placeholder="#2563EB"
                      className="font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PROFESSIONAL_COLOR_PRESETS.map((preset) => (
                      <button
                        key={`${field.key}-${preset.value}`}
                        type="button"
                        className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
                        style={{ backgroundColor: preset.value }}
                        title={preset.label}
                        onClick={() => handleThemeColorChange(field.key, preset.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {showThemeWarning ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  This color may reduce resume readability.
                </p>
              ) : null}

              <Button type="button" variant="outline" size="sm" onClick={handleResetThemeColors}>
                Reset to Default
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="border-slate-200 p-5 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(event) => handleInputChange("fullName", event.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) => handleInputChange("email", event.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(event) => handleInputChange("phone", event.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Title</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(event) => handleInputChange("role", event.target.value)}
              placeholder={
                candidateType === "experienced"
                  ? "Senior Software Engineer"
                  : "Software Developer (Fresher)"
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(event) => handleInputChange("address", event.target.value)}
              placeholder="Your City / Location"
            />
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 p-5 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Content Sections</h3>

          <div className="space-y-2">
            <Label htmlFor="summary">
              {candidateType === "experienced" ? "Professional Summary" : "Career Objective"}
            </Label>
            <Textarea
              id="summary"
              rows={4}
              value={formData.summary}
              onChange={(event) => handleInputChange("summary", event.target.value)}
              placeholder={
                candidateType === "experienced"
                  ? "Brief overview of your professional background and achievements..."
                  : "Career goals, academic achievements, and what you bring as a fresher..."
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              rows={3}
              value={formData.skills}
              onChange={(event) => handleInputChange("skills", event.target.value)}
              placeholder="JavaScript, React, Node.js, AWS, Communication"
            />
            <p className="text-xs text-slate-500">Separate skills with commas.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              rows={5}
              value={formData.education}
              onChange={(event) => handleInputChange("education", event.target.value)}
              placeholder="Degree | School | Start Year | End Year | GPA"
            />
            <p className="text-xs text-slate-500">
              Add one education item per line using the `|` separator.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              {candidateType === "experienced"
                ? "Work Experience"
                : "Experience (Internships / Training)"}
            </Label>
            <Textarea
              id="experience"
              rows={7}
              value={formData.experience}
              onChange={(event) => handleInputChange("experience", event.target.value)}
              placeholder={
                candidateType === "experienced"
                  ? "Senior Developer at TechCorp\n2021 - Present\nLed development of web applications..."
                  : "Summer Intern at TechCorp\nJun 2023 - Aug 2023\nAssisted in frontend development..."
              }
            />
            <p className="text-xs text-slate-500">
              Separate each role with a blank line.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects">Projects / Achievements</Label>
            <Textarea
              id="projects"
              rows={6}
              value={formData.projects}
              onChange={(event) => handleInputChange("projects", event.target.value)}
              placeholder="Project Name\nDescription\nTechnologies: React, Node.js, MongoDB"
            />
          </div>

          {candidateType === "fresher" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="strengths">Strengths</Label>
                <Textarea
                  id="strengths"
                  rows={3}
                  value={formData.strengths}
                  onChange={(event) => handleInputChange("strengths", event.target.value)}
                  placeholder="Quick learner, Team player, Problem-solving"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies / Interests</Label>
                <Textarea
                  id="hobbies"
                  rows={3}
                  value={formData.hobbies}
                  onChange={(event) => handleInputChange("hobbies", event.target.value)}
                  placeholder="Coding competitions, Reading tech blogs, Sports"
                />
              </div>
            </>
          ) : null}
        </div>
      </Card>

      <Card className="border-slate-200 p-5 shadow-sm">
        <div className="space-y-5">
          <h3 className="text-base font-semibold text-slate-900">Additional Information</h3>

          <div className="space-y-3">
            <Label>Languages</Label>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Language"
                value={newLanguage.language}
                onChange={(event) =>
                  setNewLanguage((prev) => ({ ...prev, language: event.target.value }))
                }
              />

              <Select
                value={newLanguage.level}
                onValueChange={(value: "Native" | "Fluent" | "Intermediate" | "Beginner") =>
                  setNewLanguage((prev) => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Language
            </Button>

            <div className="space-y-2">
              {languages.map((language, index) => (
                <div
                  key={`${language.language}-${index}`}
                  className="flex items-center justify-between rounded-xl border bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {language.language} ({language.level})
                  </span>
                  <button type="button" onClick={() => removeLanguage(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Certifications</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                placeholder="Certification Name"
                value={newCertification.name}
                onChange={(event) =>
                  setNewCertification((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <Input
                placeholder="Issuer"
                value={newCertification.issuer}
                onChange={(event) =>
                  setNewCertification((prev) => ({ ...prev, issuer: event.target.value }))
                }
              />
              <Input
                placeholder="Year"
                value={newCertification.year}
                onChange={(event) =>
                  setNewCertification((prev) => ({ ...prev, year: event.target.value }))
                }
              />
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addCertification}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>

            <div className="space-y-2">
              {certifications.map((certification, index) => (
                <div
                  key={`${certification.name}-${index}`}
                  className="flex items-center justify-between rounded-xl border bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {certification.name} by {certification.issuer} ({certification.year})
                  </span>
                  <button type="button" onClick={() => removeCertification(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Social Links</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <Select
                value={newSocialLink.platform}
                onValueChange={(value) =>
                  setNewSocialLink((prev) => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Portfolio">Portfolio</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                </SelectContent>
              </Select>

              <Input
                className="md:col-span-2"
                placeholder="URL"
                value={newSocialLink.url}
                onChange={(event) =>
                  setNewSocialLink((prev) => ({ ...prev, url: event.target.value }))
                }
              />
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
              <Plus className="mr-2 h-4 w-4" />
              Add Social Link
            </Button>

            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div
                  key={`${link.platform}-${index}`}
                  className="flex items-center justify-between rounded-xl border bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    {link.platform === "LinkedIn" ? <Linkedin className="h-4 w-4 text-blue-600" /> : null}
                    {link.platform === "GitHub" ? <Github className="h-4 w-4" /> : null}
                    {link.platform === "Portfolio" || link.platform === "Website" ? (
                      <Globe className="h-4 w-4 text-emerald-600" />
                    ) : null}
                    <span>{link.platform}: {link.url}</span>
                  </div>
                  <button type="button" onClick={() => removeSocialLink(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-blue-200 bg-blue-50/80 p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-blue-900">
              <Send className="h-4 w-4" />
              Submit for Approval
            </h3>
            <p className="mt-1 text-sm text-blue-800">
              Your resume will be saved and sent to the team for final PDF review.
            </p>
          </div>

          <Button
            type="button"
            className="h-11 w-full"
            onClick={handleRequestDownload}
            disabled={isSubmitting || !formData.fullName || !formData.email}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting Request..." : "Submit for Admin Approval"}
          </Button>
        </div>
      </Card>
    </div>
  );

  const previewPanel = (
    <Card className="border-slate-200 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <FileText className="h-5 w-5" />
            Live Preview
          </h2>
          <p className="text-sm text-slate-500">Rendering {selectedTemplateMeta.name}</p>
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          {selectedTemplateMeta.category}
        </span>
      </div>

      <div className="resume-preview-container min-h-[760px] rounded-2xl border">
        {formData.fullName ? (
          <div
            className="resume-preview-outer"
            style={{
              ["--preview-scale" as string]: PREVIEW_SCALE,
            }}
          >
            <div
              className="resume-preview-inner"
            >
              <ResumeDocument
                templateId={deferredSelectedTemplate}
                data={deferredTemplateData}
                renderMode="editor-preview"
              />
            </div>
          </div>
        ) : (
          <EmptyTemplate />
        )}
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <UserSidebar />

      <main className="flex-1 px-4 pb-10 pt-20 md:px-8 md:pt-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <Card className="border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto px-0 text-slate-600 hover:bg-transparent hover:text-slate-900"
                  onClick={() =>
                    navigate(`/builder?template=${selectedTemplate}&type=${candidateType}`)
                  }
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Templates
                </Button>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {editingResumeId ? "Edit Resume" : "Resume Editor"}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium">
                      {selectedTemplateMeta.name}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                      {candidateType === "experienced" ? "Experienced" : "Fresher"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {isLoadingResume
                        ? "Loading resume..."
                        : saveStatus === "saving"
                        ? "Saving draft..."
                        : "Draft saved"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => persistDraft({ showToast: true })}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>

                {editingResumeId && resumeStatus === "approved" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloadingPdf ? "Opening PDF..." : "Download PDF"}
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>

          <div className="lg:hidden">
            <Tabs defaultValue="form" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="form">{formPanel}</TabsContent>
              <TabsContent value="preview">{previewPanel}</TabsContent>
            </Tabs>
          </div>

          <div className="hidden gap-6 lg:grid lg:grid-cols-2">
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">{formPanel}</div>
            <div className="sticky top-8 self-start">{previewPanel}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
