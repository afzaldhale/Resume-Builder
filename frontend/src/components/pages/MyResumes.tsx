import UserSidebar from "../UserSidebar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, Eye } from "lucide-react";

const MyResumes = () => {
  const resumes = [
    { id: 1, title: "Software Engineer Resume", date: "2025-01-15", status: "approved" },
    { id: 2, title: "Product Manager Resume", date: "2025-01-20", status: "pending" },
    { id: 3, title: "Data Analyst Resume", date: "2025-01-10", status: "approved" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-muted-foreground">Manage and view all your created resumes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="p-6 space-y-4 shadow-soft hover:shadow-medium transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{resume.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Created on {resume.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      resume.status === "approved"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {resume.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button className="flex-1" size="sm">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyResumes;