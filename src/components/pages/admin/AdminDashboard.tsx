import AdminSidebar from "../../AdminSidebar";
import { Card } from "../../ui/card";
import { Users, FileText, Clock, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "156", icon: Users, color: "text-primary" },
    { title: "Total Requests", value: "45", icon: FileText, color: "text-secondary" },
    { title: "Pending Requests", value: "12", icon: Clock, color: "text-warning" },
    { title: "Approved Resumes", value: "33", icon: CheckCircle, color: "text-success" },
  ];

  const recentActivity = [
    { user: "John Doe", action: "Submitted resume request", time: "10 minutes ago" },
    { user: "Jane Smith", action: "Resume approved", time: "1 hour ago" },
    { user: "Bob Johnson", action: "Created new account", time: "2 hours ago" },
    { user: "Alice Williams", action: "Submitted resume request", time: "3 hours ago" },
    { user: "Charlie Brown", action: "Resume rejected", time: "5 hours ago" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of system metrics and recent activity</p>
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

          <Card className="p-8 shadow-soft">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;