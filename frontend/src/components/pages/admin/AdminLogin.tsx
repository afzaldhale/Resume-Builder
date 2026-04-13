import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data?.user;
      const token = res.data?.token;

      if (!user || !token || user.role !== "admin") {
        toast.error("Admin access denied");
        return;
      }

      window.localStorage.setItem("token", token);
      setUser(user);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message as string);
      } else {
        toast.error("Admin login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-large">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Resume Requests & Users Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@resumepro.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              className="absolute top-9 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In as Admin"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
