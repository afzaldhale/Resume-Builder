import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "@/api/axios";

export interface AuthUser {
  uid: string;
  name: string;
  email: string | null;
  role: string;
  candidateType: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data?.user;

        if (userData) {
          setUser({
            uid: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            candidateType: "experienced",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      window.localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      setUser,
      logout,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};
