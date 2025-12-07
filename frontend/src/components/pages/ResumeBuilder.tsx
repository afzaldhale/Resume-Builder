import { useState } from "react";
import UserSidebar from "../UserSidebar";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    projects: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequestDownload = () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in at least your name and email");
      return;
    }
    toast.success("Your download request has been sent to admin for approval!");
    navigate("/requests");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="p-8 space-y-6 shadow-soft h-fit">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Brief overview of your professional background..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  placeholder="Your educational background..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="Your professional experience..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="Your key skills..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea
                  id="projects"
                  value={formData.projects}
                  onChange={(e) => handleInputChange("projects", e.target.value)}
                  placeholder="Notable projects..."
                  rows={3}
                />
              </div>

              <Button onClick={handleRequestDownload} className="w-full">
                Request Resume Download
              </Button>
            </Card>

            {/* Preview Section */}
            <Card className="p-8 shadow-soft sticky top-8 h-fit">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Live Preview
              </h2>
              
              <div className="space-y-6 bg-card border rounded-lg p-6">
                {formData.fullName && (
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold">{formData.fullName}</h1>
                    <div className="text-sm text-muted-foreground mt-2">
                      {formData.email && <span>{formData.email}</span>}
                      {formData.email && formData.phone && <span className="mx-2">•</span>}
                      {formData.phone && <span>{formData.phone}</span>}
                    </div>
                  </div>
                )}

                {formData.summary && (
                  <div>
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-sm text-muted-foreground">{formData.summary}</p>
                  </div>
                )}

                {formData.education && (
                  <div>
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.education}</p>
                  </div>
                )}

                {formData.experience && (
                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.experience}</p>
                  </div>
                )}

                {formData.skills && (
                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.skills}</p>
                  </div>
                )}

                {formData.projects && (
                  <div>
                    <h3 className="font-semibold mb-2">Projects</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{formData.projects}</p>
                  </div>
                )}

                {!formData.fullName && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Start filling the form to see your resume preview</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
