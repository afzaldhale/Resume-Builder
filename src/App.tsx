import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Dashboard from "./components/pages/Dashboard";
import ResumeBuilder from "./components/pages/ResumeBuilder";
import MyResumes from "./components/pages/MyResumes";
import Requests from "./components/pages/Requests";
import AdminLogin from "./components/pages/admin/AdminLogin";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminRequests from "./components/pages/admin/AdminRequests";
// import AdminUsers from "../src/components/pages/admin/AdminUsers";
import NotFound from "../src/components/pages/NotFound";
import PrivacyPolicyPage from "./components/pages/PrivacyPolicy";
import TermsOfService from "./components/pages/TermsOfService";
import ContactUsPage from "./components/pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/my-resumes" element={<MyResumes />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUsPage />} />
          {/* <Route path="/admin/users" element={<AdminUsers />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;