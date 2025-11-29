import UserSidebar from "@/components/UserSidebar";
import { Card } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Resumes", value: "3", icon: FileText, color: "text-primary" },
    { title: "Pending Requests", value: "1", icon: Clock, color: "text-warning" },
    { title: "Approved", value: "2", icon: CheckCircle, color: "text-success" },
    { title: "Rejected", value: "0", icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground">Here's your resume building overview</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-6 shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 space-y-4 shadow-soft">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigate("/builder")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Resume
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/my-resumes")}>
                  <FileText className="mr-2 h-4 w-4" />
                  View My Resumes
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/requests")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Check Request Status
                </Button>
              </div>
            </Card>

            <Card className="p-8 space-y-4 shadow-soft">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Resume approved</p>
                    <p className="text-sm text-muted-foreground">Software Engineer Resume - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Request pending</p>
                    <p className="text-sm text-muted-foreground">Product Manager Resume - 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">Resume approved</p>
                    <p className="text-sm text-muted-foreground">Data Analyst Resume - 3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
