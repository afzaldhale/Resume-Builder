// components/ResumeBuilder.tsx
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { resumeService } from "@/services/resumeService";
import UserSidebar from "@/components/UserSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, X, Plus, Globe, Linkedin, Github, Send, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { TemplateSelector } from "@/components/resume-templates/TemplateSelector";
import { LazyTemplateRenderer } from "@/components/resume-templates/TemplateRegistry";
import EmptyTemplate from "@/components/resume-templates/EmptyTemplate";
import { LanguageItem, CertificationItem, SocialLink } from "@/components/resume-templates/types";
import {
  convertFromTemplateData,
  convertToTemplateData,
  generateSampleData,
  clearFormData,
  FormData,
  CandidateType,
} from "../../types/resumeDataConverter";
import { fitResumeData } from "@/utils/fitResumeData";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthContext();
  const editingResumeId = id;
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const resumeRef = useRef<HTMLDivElement>(null);

  // Candidate type toggle
  const [candidateType, setCandidateType] = useState<CandidateType>("experienced");

  // Form state
  const [formData, setFormData] = useState<FormData>({
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

  // Dynamic sections state
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

  // New item states with proper typing for LanguageItem level
  const [newLanguage, setNewLanguage] = useState<LanguageItem>({
    language: "",
    level: "Intermediate"
  });

  const [newCertification, setNewCertification] = useState<CertificationItem>({
    name: "",
    issuer: "",
    year: ""
  });

  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "LinkedIn",
    url: ""
  });

  useEffect(() => {
    const draft = localStorage.getItem("resume-builder-draft");

    if (!editingResumeId && draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) setFormData(parsed.formData);
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
        setFormData(parsed.formData);
        setLanguages(parsed.languages);
        setCertifications(parsed.certifications);
        setSocialLinks(parsed.socialLinks);
        setCandidateType(parsed.candidateType);
        setSelectedTemplate(Number(resume.templateId) || 1);
      } catch (error: unknown) {
        console.error('Load resume error:', error);
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
        })
      );
      setSaveStatus("saved");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [candidateType, certifications, formData, languages, selectedTemplate, socialLinks]);

  // Handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        candidateType
      );

      const title = `${formData.fullName} Resume - ${candidateType === 'experienced' ? 'Experienced' : 'Fresher'}`;
      let resumeId = editingResumeId;

      if (editingResumeId) {
        // Update existing resume
        await resumeService.updateResume(user.uid, editingResumeId, {
          title,
          resumeData,
          templateId: selectedTemplate,
        });
        toast.success("Resume updated successfully!");
      } else {
        // Create new resume
        const result = await resumeService.createResume(
          user.uid,
          resumeData,
          selectedTemplate,
          title
        );
        resumeId = result.id;
        toast.success("Resume created successfully!");
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

  const handleLoadSampleData = () => {
    const sampleData = generateSampleData(candidateType);
    setFormData(sampleData.formData);
    setLanguages(sampleData.languages);
    setCertifications(sampleData.certifications);
    setSocialLinks(sampleData.socialLinks);
    toast.success(`${candidateType === 'experienced' ? 'Experienced' : 'Fresher'} sample data loaded!`);
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      const clearedData = clearFormData(candidateType);
      setFormData(clearedData.formData);
      setLanguages(clearedData.languages);
      setCertifications(clearedData.certifications);
      setSocialLinks(clearedData.socialLinks);
      localStorage.removeItem("resume-builder-draft");
      toast.info("Form cleared");
    }
  };

  // Dynamic section handlers
  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      setLanguages(prev => [...prev, { ...newLanguage }]);
      setNewLanguage({ language: "", level: "Intermediate" });
      toast.success("Language added");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
    toast.info("Language removed");
  };

  const addCertification = () => {
    if (newCertification.name.trim()) {
      setCertifications(prev => [...prev, { ...newCertification }]);
      setNewCertification({ name: "", issuer: "", year: "" });
      toast.success("Certification added");
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
    toast.info("Certification removed");
  };

  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      setSocialLinks(prev => [...prev, { ...newSocialLink }]);
      setNewSocialLink({ platform: "LinkedIn", url: "" });
      toast.success("Social link added");
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
    toast.info("Social link removed");
  };

  // Template rendering
  const templateData = fitResumeData(
    convertToTemplateData(
      formData,
      languages,
      certifications,
      socialLinks,
      candidateType
    )
  );

  // Template color schemes
  const templateColors = {
    1: "bg-blue-100 text-blue-800 border-blue-200",
    2: "bg-gray-100 text-gray-800 border-gray-200",
    3: "bg-green-100 text-green-800 border-green-200",
    4: "bg-indigo-100 text-indigo-800 border-indigo-200",
    5: "bg-red-100 text-red-800 border-red-200",
    6: "bg-purple-100 text-purple-800 border-purple-200",
    7: "bg-amber-100 text-amber-800 border-amber-200",
    8: "bg-slate-100 text-slate-800 border-slate-200",

    // 🔹 Newly added templates
    9: "bg-gray-900 text-gray-100 border-gray-700",
    10: "bg-gradient-to-r from-blue-100 to-emerald-100 text-emerald-800 border-emerald-200",
    11: "bg-indigo-50 text-indigo-900 border-indigo-200",
    12: "bg-emerald-50 text-emerald-900 border-emerald-200",
    13: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200",
    14: "bg-white text-slate-900 border-slate-300",
    15: "bg-slate-50 text-slate-900 border-slate-300",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <p>
                {editingResumeId ? "Edit and refine your saved resume" : "Create your professional resume in minutes"}
              </p>
              <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {isLoadingResume
                  ? "Loading..."
                  : saveStatus === "saving"
                  ? "Saving draft..."
                  : "Draft saved"}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Form Section */}
            <Card className="p-6 space-y-6 shadow-soft h-fit overflow-y-auto max-h-[calc(100vh-2rem)]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Build Your Resume</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleLoadSampleData}
                    variant="outline"
                    size="sm"
                  >
                    Load Sample
                  </Button>
                  <Button
                    onClick={handleClearForm}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Candidate Type Toggle */}
              <div className="space-y-3">
                <Label>Candidate Type</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={candidateType === "experienced" ? "default" : "outline"}
                    onClick={() => setCandidateType("experienced")}
                    className="flex-1"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Experienced
                  </Button>
                  <Button
                    type="button"
                    variant={candidateType === "fresher" ? "default" : "outline"}
                    onClick={() => setCandidateType("fresher")}
                    className="flex-1"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Fresher
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {candidateType === "experienced"
                    ? "For candidates with professional work experience"
                    : "For students, graduates, and entry-level candidates"}
                </p>
              </div>

              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
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
                    placeholder={candidateType === "experienced" ? "Senior Software Engineer" : "Software Developer (Fresher)"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Your City / Location"
                  />
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Content Sections</h3>

                <div className="space-y-2">
                  <Label htmlFor="summary">
                    {candidateType === "experienced" ? "Professional Summary" : "Career Objective"}
                  </Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "Brief overview of your professional background and achievements..."
                        : "Career goals, academic achievements, and what you bring as a fresher..."
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    {candidateType === "experienced"
                      ? "Highlight your experience, skills, and career achievements"
                      : "Focus on your educational background, skills, and career aspirations"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "JavaScript, React, Node.js, AWS, Docker, CI/CD"
                        : "Programming languages, frameworks, tools learned in academics/internships"
                    }
                    rows={2}
                  />
                  <p className="text-xs text-gray-500">
                    Separate skills with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "Bachelor of Computer Science | MIT | 2015 | 2019 | 3.8"
                        : "Bachelor of Computer Science | ABC University | 2020 | 2024 | 3.9"
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Format: Degree | School | Start Year | End Year | GPA (optional)<br />
                    Add multiple entries on separate lines
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">
                    {candidateType === "experienced" ? "Work Experience" : "Experience (Internships/Training)"}
                  </Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "Senior Developer at TechCorp&#10;2021 - Present&#10;Led development of web applications..."
                        : "Summer Intern at TechCorp&#10;Jun 2023 - Aug 2023&#10;Assisted in frontend development..."
                    }
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    {candidateType === "experienced"
                      ? "Format: Role at Company<br />Dates: Start - End<br />Description<br />Separate experiences with an empty line"
                      : "Include internships, industrial training, academic projects with real-world impact"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projects">Projects / Achievements</Label>
                  <Textarea
                    id="projects"
                    value={formData.projects}
                    onChange={(e) => handleInputChange("projects", e.target.value)}
                    placeholder={
                      candidateType === "experienced"
                        ? "E-commerce Platform&#10;Built full-stack platform with React and Node.js&#10;React, Node.js, MongoDB"
                        : "Student Management System&#10;Developed for final year project&#10;Java, MySQL, Spring Boot"
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Format: Project Name<br />
                    Description<br />
                    Technologies (comma-separated)<br />
                    Separate projects with an empty line
                  </p>
                </div>

                {/* Fresher-specific sections */}
                {candidateType === "fresher" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="strengths">Strengths</Label>
                      <Textarea
                        id="strengths"
                        value={formData.strengths}
                        onChange={(e) => handleInputChange("strengths", e.target.value)}
                        placeholder="Hardworking, Quick learner, Team player, Adaptable, Problem-solving"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500">
                        Personal and professional strengths that make you a good candidate
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hobbies">Hobbies / Interests</Label>
                      <Textarea
                        id="hobbies"
                        value={formData.hobbies}
                        onChange={(e) => handleInputChange("hobbies", e.target.value)}
                        placeholder="Coding competitions, Reading tech blogs, Open source contributions, Sports"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500">
                        Helps show personality and cultural fit
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Sections */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Additional Information</h3>

                {/* Languages Section */}
                <div className="space-y-3">
                  <Label>Languages</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Language (e.g., Spanish)"
                      value={newLanguage.language}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, language: e.target.value }))}
                    />
                    <Select
                      value={newLanguage.level}
                      onValueChange={(value: "Native" | "Fluent" | "Intermediate" | "Beginner") =>
                        setNewLanguage(prev => ({ ...prev, level: value }))
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
                  <Button onClick={addLanguage} size="sm" className="w-full">
                    <Plus size={16} className="mr-2" /> Add Language
                  </Button>

                  {/* Display Languages */}
                  <div className="space-y-2">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-sm text-gray-600 ml-3">({lang.level})</span>
                        </div>
                        <button
                          onClick={() => removeLanguage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-3">
                  <Label>Certifications</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Certification Name"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Issuer (e.g., Amazon)"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                    />
                    <Input
                      placeholder="Year"
                      value={newCertification.year}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, year: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addCertification} size="sm" className="w-full">
                    <Plus size={16} className="mr-2" /> Add Certification
                  </Button>

                  {/* Display Certifications */}
                  <div className="space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div>
                          <span className="font-medium">{cert.name}</span>
                          <span className="text-sm text-gray-600 ml-3">by {cert.issuer} ({cert.year})</span>
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="space-y-3">
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={newSocialLink.platform}
                      onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="GitHub">GitHub</SelectItem>
                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="col-span-2"
                      placeholder="URL"
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <Button onClick={addSocialLink} size="sm" className="w-full">
                    <Plus size={16} className="mr-2" /> Add Social Link
                  </Button>

                  {/* Display Social Links */}
                  <div className="space-y-2">
                    {socialLinks.map((link, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2">
                          {link.platform === "LinkedIn" && <Linkedin size={16} className="text-blue-600" />}
                          {link.platform === "GitHub" && <Github size={16} />}
                          {link.platform === "Portfolio" && <Globe size={16} className="text-green-600" />}
                          <span className="font-medium">{link.platform}:</span>
                          <span className="text-sm text-gray-600">{link.url}</span>
                        </div>
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Send size={16} />
                    Submit for Approval
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Our team will review your resume and send you a high-quality PDF within 24 hours.
                    {candidateType === "fresher" && " We'll help optimize it for entry-level positions."}
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Professional formatting & optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>ATS-friendly resume formatting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>24-hour turnaround time</span>
                    </li>
                    {candidateType === "fresher" && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Entry-level resume optimization</span>
                      </li>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={handleRequestDownload}
                  disabled={isSubmitting || !formData.fullName || !formData.email}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  size="lg"
                >
                  <Send size={20} className="mr-2" />
                  {isSubmitting ? "Submitting Request..." : "Submit for Admin Approval"}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>You will be redirected to your requests page after submission</p>
                  <p className="mt-1">Candidate Type: <span className="font-semibold">{candidateType === 'experienced' ? 'Experienced' : 'Fresher'}</span></p>
                </div>
              </div>
            </Card>

            {/* Live Preview Section */}
            <Card className="p-6 shadow-soft sticky top-8 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Live Preview
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${candidateType === 'experienced' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {candidateType === 'experienced' ? 'Experienced' : 'Fresher'}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full border ${templateColors[selectedTemplate as keyof typeof templateColors]}`}>
                    Template #{selectedTemplate}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border min-h-[800px] overflow-auto">
                {formData.fullName ? (
                  <div ref={resumeRef} className="w-full max-w-md mx-auto transform scale-75 origin-top">
                    <LazyTemplateRenderer templateId={selectedTemplate} data={templateData} />
                  </div>
                ) : (
                  <EmptyTemplate />
                )}
              </div>

              {/* Template Descriptions */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText size={16} />
                  Template Colors
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>#1: Classic Blue</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span>#2: Modern Gray</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>#3: Creative Green</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span>#4: Professional Indigo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>#5: Bold Red</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>#6: Elegant Purple</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>#7: Warm Amber</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                    <span>#8: Clean Slate</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                    <span>#9: Dark Professional</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>#10: Modern Gradient</span>
                  </div>

                  {/* New templates */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    <span>#11: Soft Indigo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span>#12: Fresh Emerald</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-fuchsia-400"></div>
                    <span>#13: Modern Fuchsia</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span>#14: Minimal White</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    <span>#15: Clean Professional</span>
                  </div>
                </div>
              </div>

              {/* Request Process Info */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Send size={16} />
                  How It Works
                </h3>
                <ol className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Select candidate type and fill in your details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Click "Submit for Admin Approval"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Our team reviews & optimizes your resume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>Receive high-quality PDF via email</span>
                  </li>
                </ol>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
