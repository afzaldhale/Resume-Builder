import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserSidebar from "@/components/UserSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { resumeService } from "@/services/resumeService";

import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";

type Stats = {
  totalResumes: number;
  published: number;
  drafts: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [stats, setStats] = useState<Stats>({
    totalResumes: 0,
    published: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get user's resumes from the backend
        const resumes = await resumeService.getMyResumes(user.uid);

        const totalResumes = resumes.length;
        const published = resumes.filter((r) => r.isPublished).length;
        const drafts = totalResumes - published;

        setStats({
          totalResumes,
          published,
          drafts,
        });
      } catch (error: unknown) {
        console.error('Dashboard error:', error);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.uid]);

  const statsList = useMemo(
    () => [
      {
        title: "Total Resumes",
        value: stats.totalResumes,
        icon: FileText,
        color: "text-primary",
      },
      {
        title: "Published",
        value: stats.published,
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        title: "Drafts",
        value: stats.drafts,
        icon: Clock,
        color: "text-yellow-500",
      },
      {
        title: "Templates",
        value: 15, // Static for now, could be dynamic later
        icon: FileText,
        color: "text-blue-500",
      },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <UserSidebar />
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 h-28 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s your resume activity overview
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {statsList.map((stat) => (
              <Card key={stat.title} className="p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>

              <Button
                className="w-full justify-start"
                onClick={() => navigate("/builder")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Resume
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/my-resumes")}
              >
                <FileText className="mr-2 h-4 w-4" />
                View My Resumes
              </Button>
            </Card>

            <Card className="p-8 space-y-4">
              <h2 className="text-xl font-semibold">Getting Started</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>1. Click "Create New Resume" to start building</p>
                <p>2. Choose from 15+ professional templates</p>
                <p>3. Fill in your details and customize</p>
                <p>4. Download or share your resume</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
