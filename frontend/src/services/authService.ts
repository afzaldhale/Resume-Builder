import api from "@/api/axios";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "user" | "admin";
  candidateType: "fresher" | "experienced";
  profileImageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class AuthService {
  async signup(name: string, email: string, password: string) {
    const res = await api.post("/auth/signup", { name, email, password });
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  }

  async logout() {
    const res = await api.post("/auth/logout");
    window.localStorage.removeItem("token");
    return res.data;
  }

  async getUserProfile() {
    const res = await api.get("/auth/me");
    return res.data?.user || null;
  }
}

export const authService = new AuthService();
