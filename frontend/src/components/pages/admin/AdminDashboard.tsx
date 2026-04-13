import { useState, useEffect, useMemo, FormEvent } from "react";
import AdminSidebar from "../../AdminSidebar";
import { Card } from "../../ui/card";
import { Users, FileText, Clock, CheckCircle, Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

/* =======================
   TYPES
======================= */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Request {
  id: number;
  user_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface UsersApiResponse {
  success: boolean;
  users: User[];
}

interface RequestsApiResponse {
  success: boolean;
  requests: Request[];
}

interface Activity {
  user: string;
  action: string;
  time: string;
}

/* =======================
   CONSTANTS
======================= */

const ACTIVITY_LIMIT = 100;
const PAGE_SIZE = 10;

/* =======================
   COMPONENT
======================= */

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Form states for creating user
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =======================
     FETCH DASHBOARD DATA
  ======================= */

  const fetchDashboardData = async () => {
    try {
      const [usersRes, requestsRes]: [
        AxiosResponse<UsersApiResponse>,
        AxiosResponse<RequestsApiResponse>
      ] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/requests"),
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (requestsRes.data.success) setRequests(requestsRes.data.requests);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  /* =======================
     CREATE USER
  ======================= */

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newUserPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setCreatingUser(true);
    try {
      const response = await api.post("/api/admin/users", {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
      });

      if (response.data.success) {
        toast.success("User created successfully");
        setUsers(prev => [response.data.user, ...prev]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  /* =======================
     USER MAP (FIX UNKNOWN)
  ======================= */

  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    users.forEach(user => map.set(user.id, user.name));
    return map;
  }, [users]);

  /* =======================
     RECENT ACTIVITY (SAFE)
  ======================= */

  const recentActivity: Activity[] = useMemo(() => {
    const userActivities: Activity[] = users.map(user => ({
      user: user.name,
      action: "Created new account",
      time: user.created_at,
    }));

    const requestActivities: Activity[] = requests.map(req => ({
      user: userMap.get(req.user_id) ?? "System",
      action:
        req.status === "approved"
          ? "Resume approved"
          : req.status === "rejected"
          ? "Resume rejected"
          : "Submitted resume request",
      time: req.created_at,
    }));

    return [...userActivities, ...requestActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, ACTIVITY_LIMIT);
  }, [users, requests, userMap]);

  /* =======================
     PAGINATION
  ======================= */

  const totalPages = Math.ceil(recentActivity.length / PAGE_SIZE);

  const paginatedActivity = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return recentActivity.slice(start, start + PAGE_SIZE);
  }, [page, recentActivity]);

  /* =======================
     STATS
  ======================= */

  const stats = [
    { title: "Total Users", value: users.length, icon: Users },
    { title: "Total Requests", value: requests.length, icon: FileText },
    { title: "Pending Requests", value: requests.filter(r => r.status === "pending").length, icon: Clock },
    { title: "Approved Resumes", value: requests.filter(r => r.status === "approved").length, icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading dashboard...
      </div>
    );
  }

  /* =======================
     UI
  ======================= */

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of system metrics and recent activity
            </p>
          </div>

          {/* CREATE USER FORM */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter user email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Enter password (min 8 chars)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={creatingUser}>
                {creatingUser ? "Creating..." : "Create User"}
              </Button>
            </form>
          </Card>

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <Card key={stat.title} className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </Card>
            ))}
          </div>

          {/* RECENT ACTIVITY */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity (Latest 100)
            </h2>

            <div className="space-y-4">
              {paginatedActivity.map((activity, index) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(activity.time).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>
              <span className="text-sm self-center">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
