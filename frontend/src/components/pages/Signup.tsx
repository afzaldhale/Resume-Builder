import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuthContext } from "@/context/AuthContext";
import api from "@/api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", { name, email, password });
      const user = res.data?.user;
      const token = res.data?.token;

      if (!user || !token) {
        toast.error("Signup failed. Please try again.");
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

      toast.success(res.data?.message || "Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);

      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message || "Signup failed");
      } else {
        toast.error("Signup failed");
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

          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground">
            Start building your professional resume
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>

          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
