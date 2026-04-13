import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/api/axios";
import { useAuthContext } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      const user = res.data?.user;
      const token = res.data?.token;

      if (!user || !token) {
        toast.error("Login failed. Please try again.");
        return;
      }

      window.localStorage.setItem("token", token);
      setUser({
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        candidateType: "experienced",
      });

      toast.success(res.data?.message || "Login successful!");

      const redirectPath =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname || (user.role === "admin" ? "/admin/dashboard" : "/dashboard");

      navigate(redirectPath);
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-large">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your resumes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </div>

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

export default Login;
