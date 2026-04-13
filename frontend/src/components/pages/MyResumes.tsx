import { useEffect, useState } from "react";
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { resumeService } from "@/services/resumeService";
import UserSidebar from "@/components/UserSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResumeItem {
  id: string;
  title: string;
  templateId: number;
  isPublished: boolean;
  createdAt: any;
  updatedAt: any;
}

const MyResumes = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const userResumes = await resumeService.getMyResumes(user.uid);
        setResumes(userResumes);
      } catch (error) {
        console.error('Load resumes error:', error);
        toast.error("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, [user?.uid]);

  const handleDeleteResume = async (resumeId: string) => {
    if (!user?.uid) return;

    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeService.deleteResume(user.uid, resumeId);
      setResumes(resumes.filter(r => r.id !== resumeId));
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error('Delete resume error:', error);
      toast.error("Failed to delete resume");
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Resumes</h1>
              <p className="text-muted-foreground">
                See how many resumes you have built.
              </p>
            </div>

            <Button onClick={() => navigate("/builder")}>
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          <Card className="p-8 shadow-soft">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No resumes yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Create your first resume to get started
                  </p>
                </div>
                <Button onClick={() => navigate("/builder")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resume.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Template {resume.templateId} • Created {formatDate(resume.createdAt)}
                          {resume.isPublished && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Published
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/builder/${resume.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/resume/${resume.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyResumes;
