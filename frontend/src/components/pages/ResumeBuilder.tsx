import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Briefcase,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Plus,
  Send,
  X,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { resumeService } from "@/services/resumeService";
import UserSidebar from "@/components/UserSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyTemplate from "@/components/resume-templates/EmptyTemplate";
import ResumeRenderer from "@/components/resume-templates/ResumeRenderer";
import { TemplateSelector } from "@/components/resume-templates/TemplateSelector";
import { premiumTemplateOptions } from "@/components/resume-templates/premiumShared";
import type {
  CertificationItem,
  LanguageItem,
  SocialLink,
} from "@/components/resume-templates/types";
import {
  CandidateType,
  FormData,
  clearFormData,
  convertFromTemplateData,
  convertToTemplateData,
  generateSampleData,
} from "../../types/resumeDataConverter";
import { SmartTextareaField } from "./resume-builder/SmartTextareaField";

const defaultFormData: FormData = {
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
  referenceNotes: "",
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthContext();
  const editingResumeId = id;

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [candidateType, setCandidateType] = useState<CandidateType>("experienced");
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { language: "English", level: "Native" },
    { language: "Hindi", level: "Fluent" },
  ]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    { name: "AWS Certified", issuer: "Amazon", year: "2023" },
    { name: "React Expert", issuer: "Meta", year: "2022" },
  ]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "LinkedIn", url: "linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "github.com/johndoe" },
    { platform: "Portfolio", url: "johndoeportfolio.com" },
  ]);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [previewScale, setPreviewScale] = useState(0.62);
  const previewShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const draft = localStorage.getItem("resume-builder-draft");

    if (!editingResumeId && draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) {
          setFormData({
            ...defaultFormData,
            ...parsed.formData,
          });
        }
        if (parsed.languages) setLanguages(parsed.languages);
        if (parsed.certifications) setCertifications(parsed.certifications);
        if (parsed.socialLinks) setSocialLinks(parsed.socialLinks);
        if (parsed.candidateType) setCandidateType(parsed.candidateType);
        setSelectedTemplate(parsed.selectedTemplate ?? 1);
      } catch {
        localStorage.removeItem("resume-builder-draft");
      }
    }
  }, [editingResumeId]);

  useEffect(() => {
    if (!editingResumeId || !user?.uid) return;

    const loadResume = async () => {
      try {
        setIsLoadingResume(true);
        const resume = await resumeService.getResumeById(user.uid, editingResumeId);

        if (!resume) {
          throw new Error("Resume not found");
        }

        const parsed = convertFromTemplateData(resume.resumeData);
        setFormData({
          ...defaultFormData,
          ...parsed.formData,
        });
        setLanguages(parsed.languages);
        setCertifications(parsed.certifications);
        setSocialLinks(parsed.socialLinks);
        setCandidateType(parsed.candidateType);
        setSelectedTemplate(Number(resume.templateId) || 1);
      } catch (error: unknown) {
        console.error("Load resume error:", error);
        toast.error("Failed to load resume");
      } finally {
        setIsLoadingResume(false);
      }
    };

    loadResume();
  }, [editingResumeId, user?.uid]);

  useEffect(() => {
    setSaveStatus("saving");

    const timer = window.setTimeout(() => {
      localStorage.setItem(
        "resume-builder-draft",
        JSON.stringify({
          formData,
          languages,
          certifications,
          socialLinks,
          candidateType,
          selectedTemplate,
        }),
      );
      setSaveStatus("saved");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [candidateType, certifications, formData, languages, selectedTemplate, socialLinks]);

  useEffect(() => {
    const node = previewShellRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const maxPreviewWidth = Math.min(entry.contentRect.width - 32, 520);
      const nextScale = Math.min(0.72, maxPreviewWidth / 794);
      if (nextScale > 0) {
        setPreviewScale(Number(nextScale.toFixed(3)));
      }
    });

    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const templateData = useMemo(
    () =>
      convertToTemplateData(
        formData,
        languages,
        certifications,
        socialLinks,
        candidateType,
      ),
    [candidateType, certifications, formData, languages, socialLinks],
  );

  const selectedTemplateMeta = premiumTemplateOptions.find(
    (template) => template.id === selectedTemplate,
  );

  const handleLoadSampleData = () => {
    const sampleData = generateSampleData(candidateType);
    setFormData({
      ...defaultFormData,
      ...sampleData.formData,
    });
    setLanguages(sampleData.languages);
    setCertifications(sampleData.certifications);
    setSocialLinks(sampleData.socialLinks);
    toast.success(`${candidateType === "experienced" ? "Experienced" : "Fresher"} sample data loaded`);
  };

  const handleClearForm = () => {
    if (!window.confirm("Are you sure you want to clear all form data?")) return;

    const cleared = clearFormData(candidateType);
    setFormData({
      ...defaultFormData,
      ...cleared.formData,
    });
    setLanguages(cleared.languages);
    setCertifications(cleared.certifications);
    setSocialLinks(cleared.socialLinks);
    localStorage.removeItem("resume-builder-draft");
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
      const title = `${formData.fullName} Resume - ${
        candidateType === "experienced" ? "Experienced" : "Fresher"
      }`;
      let resumeId = editingResumeId;

      if (editingResumeId) {
        await resumeService.updateResume(user.uid, editingResumeId, {
          title,
          resumeData: templateData,
          templateId: selectedTemplate,
        });
        toast.success("Resume updated successfully");
      } else {
        const result = await resumeService.createResume(
          user.uid,
          templateData,
          selectedTemplate,
          title,
        );
        resumeId = result.id;
        toast.success("Resume created successfully");
      }

      if (resumeId) {
        await resumeService.requestDownload(user.uid, resumeId);
      }

      localStorage.removeItem("resume-builder-draft");
      navigate("/requests");
    } catch (error: unknown) {
      console.error("Submit error:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLanguage = () => {
    if (!newLanguage.language.trim()) return;
    setLanguages((prev) => [...prev, { ...newLanguage }]);
    setNewLanguage({ language: "", level: "Intermediate" });
    toast.success("Language added");
  };

  const addCertification = () => {
    if (!newCertification.name.trim()) return;
    setCertifications((prev) => [...prev, { ...newCertification }]);
    setNewCertification({ name: "", issuer: "", year: "" });
    toast.success("Certification added");
  };

  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) return;
    setSocialLinks((prev) => [...prev, { ...newSocialLink }]);
    setNewSocialLink({ platform: "LinkedIn", url: "" });
    toast.success("Social link added");
  };

  const removeLanguage = (index: number) => {
    setLanguages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 p-4 pt-20 md:p-8 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-950">Resume Builder</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <p>
                {editingResumeId
                  ? "Edit and refine your saved resume"
                  : "Create a premium recruiter-ready resume in one polished page"}
              </p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                {isLoadingResume
                  ? "Loading..."
                  : saveStatus === "saving"
                  ? "Saving draft..."
                  : "Draft saved"}
              </span>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(380px,0.82fr)]">
            <Card className="h-fit max-h-[calc(100vh-2rem)] space-y-6 overflow-y-auto rounded-[28px] border-slate-200 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Build Your Resume</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Better spacing, richer writing fields, and premium one-page templates.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleLoadSampleData} variant="outline" size="sm">
                    Load Sample
                  </Button>
                  <Button onClick={handleClearForm} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>

              <section className="space-y-3">
                <Label>Candidate Type</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant={candidateType === "experienced" ? "default" : "outline"}
                    onClick={() => setCandidateType("experienced")}
                    className="h-11"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Experienced
                  </Button>
                  <Button
                    type="button"
                    variant={candidateType === "fresher" ? "default" : "outline"}
                    onClick={() => setCandidateType("fresher")}
                    className="h-11"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Fresher
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  {candidateType === "experienced"
                    ? "Optimized for candidates with professional work history."
                    : "Optimized for students, graduates, interns, and entry-level roles."}
                </p>
              </section>

              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Avery Morgan"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="avery@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role / Title</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "Senior Software Engineer"
                        : "Frontend Developer"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
              </section>

              <section className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Content Sections</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    These fields are designed for longer paragraphs, bullet points, and cleaner ATS-ready storytelling.
                  </p>
                </div>

                <SmartTextareaField
                  id="summary"
                  label={candidateType === "experienced" ? "Professional Summary" : "Career Objective"}
                  value={formData.summary}
                  onChange={(value) => handleInputChange("summary", value)}
                  placeholder={
                    candidateType === "experienced"
                      ? "Write 3-5 lines about your strengths, domain experience, leadership, and measurable value.\nExample:\nProduct-minded engineer with 6+ years building SaaS platforms, improving performance, and mentoring distributed teams."
                      : "Write 3-5 lines about your career goals, strengths, and how you add value.\nExample:\nRecent computer science graduate with internship experience in React and a strong interest in building accessible, high-quality web products."
                  }
                  helper="Open with your most marketable strengths and connect them to the role you want."
                  recommended="280-420 characters"
                  maxLength={700}
                />

                <SmartTextareaField
                  id="skills"
                  label="Skills"
                  value={formData.skills}
                  onChange={(value) => handleInputChange("skills", value)}
                  placeholder="List skills separated by commas or new lines.\nExample:\nReact, TypeScript, Node.js, PostgreSQL, AWS, Design Systems"
                  helper="Lead with hard skills most relevant to your target role."
                  recommended="10-18 skills"
                  maxLength={450}
                  minHeightClassName="min-h-[110px]"
                />

                <SmartTextareaField
                  id="education"
                  label="Education"
                  value={formData.education}
                  onChange={(value) => handleInputChange("education", value)}
                  placeholder="Use one entry per block.\nExample:\nB.Tech in Computer Science | ABC University | 2020 | 2024 | 8.7 CGPA\n\n12th Grade | City Public School | 2018 | 2020 | 91%"
                  helper="Format each entry as Degree | School | Start Year | End Year | GPA/CGPA."
                  recommended="1-3 entries"
                  maxLength={650}
                />

                <SmartTextareaField
                  id="experience"
                  label={
                    candidateType === "experienced"
                      ? "Work Experience Description"
                      : "Internship / Training Description"
                  }
                  value={formData.experience}
                  onChange={(value) => handleInputChange("experience", value)}
                  placeholder={
                    candidateType === "experienced"
                      ? "Create one block per role.\nExample:\nSenior Software Engineer at TechCorp\n2021 - Present\n• Led migration to a shared design system across 4 squads\n• Reduced page load time by 31% through performance optimization\n• Used React, TypeScript, Node.js, and AWS"
                      : "Create one block per internship or training program.\nExample:\nFrontend Intern at TechCorp\nJun 2023 - Aug 2023\n• Built reusable React components for the admin dashboard\n• Partnered with QA to close 20+ UI bugs before release\n• Used React, Tailwind CSS, and Git"
                  }
                  helper="Describe responsibilities, tools used, impact, ownership, and measurable outcomes."
                  recommended="2-4 bullets per role"
                  maxLength={1800}
                  minHeightClassName="min-h-[190px]"
                />

                <SmartTextareaField
                  id="projects"
                  label="Project Description"
                  value={formData.projects}
                  onChange={(value) => handleInputChange("projects", value)}
                  placeholder="Create one block per project.\nExample:\nResume Builder Platform\n• Designed a responsive builder with PDF export and live preview\n• Built with React, TypeScript, Tailwind CSS, and Firebase\n• Improved completion rate by 24% during beta testing"
                  helper="Explain the project purpose, technologies used, your role, and measurable results."
                  recommended="2-3 strong projects"
                  maxLength={1200}
                  minHeightClassName="min-h-[170px]"
                />

                <SmartTextareaField
                  id="strengths"
                  label="Custom Section Description"
                  value={formData.strengths}
                  onChange={(value) => handleInputChange("strengths", value)}
                  placeholder="Use this flexible field for strengths, achievements, responsibilities, leadership, awards, or other highlights.\nExample:\n• Mentored 3 junior developers\n• Employee of the Quarter, Q3 2025\n• Strong stakeholder communication and roadmap ownership"
                  helper="Great for achievements, responsibilities highlights, leadership notes, or differentiators."
                  recommended="3-5 concise bullets"
                  maxLength={600}
                />

                <SmartTextareaField
                  id="hobbies"
                  label="Achievements / Interests"
                  value={formData.hobbies}
                  onChange={(value) => handleInputChange("hobbies", value)}
                  placeholder="Add notable extracurriculars, competitions, volunteer work, or professional interests.\nExample:\n• Hackathon finalist\n• Open source contributor\n• Volunteer mentor for coding bootcamp students"
                  helper="Keep entries professional and relevant. Specific achievements are stronger than generic hobbies."
                  recommended="2-4 entries"
                  maxLength={450}
                />

                <SmartTextareaField
                  id="referenceNotes"
                  label="Reference Notes (optional)"
                  value={formData.referenceNotes}
                  onChange={(value) => handleInputChange("referenceNotes", value)}
                  placeholder="Add short reference notes only when helpful.\nExample:\nReferences available upon request\nProf. Maria Chen - Faculty Mentor, Computer Science Department"
                  helper="Short notes are enough. Most resumes do not need full reference details."
                  recommended="0-2 lines"
                  maxLength={260}
                  minHeightClassName="min-h-[96px]"
                />
              </section>

              <section className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>

                <div className="space-y-3">
                  <Label>Languages</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Language"
                      value={newLanguage.language}
                      onChange={(e) =>
                        setNewLanguage((prev) => ({ ...prev, language: e.target.value }))
                      }
                    />
                    <Select
                      value={newLanguage.level}
                      onValueChange={(
                        value: "Native" | "Fluent" | "Intermediate" | "Beginner",
                      ) => setNewLanguage((prev) => ({ ...prev, level: value }))}
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
                  <Button onClick={addLanguage} size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Language
                  </Button>
                  <StackedList
                    items={languages.map((item) => ({
                      title: item.language,
                      subtitle: item.level,
                    }))}
                    onRemove={removeLanguage}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Certifications</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Certification Name"
                      value={newCertification.name}
                      onChange={(e) =>
                        setNewCertification((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Issuer"
                      value={newCertification.issuer}
                      onChange={(e) =>
                        setNewCertification((prev) => ({ ...prev, issuer: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Year"
                      value={newCertification.year}
                      onChange={(e) =>
                        setNewCertification((prev) => ({ ...prev, year: e.target.value }))
                      }
                    />
                  </div>
                  <Button onClick={addCertification} size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Certification
                  </Button>
                  <StackedList
                    items={certifications.map((item) => ({
                      title: item.name,
                      subtitle: [item.issuer, item.year].filter(Boolean).join(" • "),
                    }))}
                    onRemove={removeCertification}
                  />
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
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="md:col-span-2"
                      placeholder="URL"
                      value={newSocialLink.url}
                      onChange={(e) =>
                        setNewSocialLink((prev) => ({ ...prev, url: e.target.value }))
                      }
                    />
                  </div>
                  <Button onClick={addSocialLink} size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Social Link
                  </Button>
                  <div className="space-y-2">
                    {socialLinks.map((item, index) => (
                      <div
                        key={`${item.platform}-${index}`}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
                      >
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          {item.platform === "LinkedIn" ? (
                            <Linkedin className="h-4 w-4 text-blue-600" />
                          ) : item.platform === "GitHub" ? (
                            <Github className="h-4 w-4" />
                          ) : (
                            <Globe className="h-4 w-4 text-emerald-600" />
                          )}
                          <span className="font-medium">{item.platform}</span>
                          <span className="truncate text-slate-500">{item.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="text-rose-500 transition hover:text-rose-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-5">
                <div className="rounded-[24px] border border-blue-200 bg-blue-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
                    <Send className="h-4 w-4" />
                    Submit for Approval
                  </h3>
                  <p className="text-sm text-blue-800">
                    Your resume will be reviewed and exported as a polished PDF. These templates are designed to stay premium, readable, and ATS-safe on a single page.
                  </p>
                </div>

                <Button
                  onClick={handleRequestDownload}
                  disabled={isSubmitting || !formData.fullName || !formData.email}
                  className="h-12 w-full text-lg"
                  size="lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Submitting Request..." : "Submit for Admin Approval"}
                </Button>

                <div className="text-center text-xs text-slate-500">
                  Candidate Type:{" "}
                  <span className="font-semibold text-slate-700">
                    {candidateType === "experienced" ? "Experienced" : "Fresher"}
                  </span>
                </div>
              </section>
            </Card>

            <Card className="sticky top-8 h-fit rounded-[28px] border-slate-200 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] xl:max-w-[640px] xl:justify-self-end">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                    <FileText className="h-5 w-5" />
                    Live Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Responsive A4 preview with one-page premium layout rules.
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {selectedTemplateMeta?.name || `Template ${selectedTemplate}`}
                  </span>
                </div>
              </div>

              <div
                ref={previewShellRef}
                className="max-h-[72vh] overflow-auto rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc,#eef2ff)] p-3 sm:p-4"
              >
                {formData.fullName ? (
                  <div
                    className="mx-auto origin-top"
                    style={{
                      height: `${1123 * previewScale}px`,
                      width: `${794 * previewScale}px`,
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: "top center",
                        width: "794px",
                      }}
                    >
                      <ResumeRenderer templateId={selectedTemplate} data={templateData} mode="preview" />
                    </div>
                  </div>
                ) : (
                  <EmptyTemplate />
                )}
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Current Template</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedTemplateMeta?.name || "Premium Template"} keeps the resume inside the A4 frame while adjusting spacing and typography as content grows.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const StackedList = ({
  items,
  onRemove,
}: {
  items: Array<{ title: string; subtitle?: string }>;
  onRemove: (index: number) => void;
}) => (
  <div className="space-y-2">
    {items.map((item, index) => (
      <div
        key={`${item.title}-${index}`}
        className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
      >
        <div>
          <p className="font-medium text-slate-800">{item.title}</p>
          {item.subtitle ? <p className="text-sm text-slate-500">{item.subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-rose-500 transition hover:text-rose-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
);

export default ResumeBuilder;
