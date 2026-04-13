import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Dashboard from "./components/pages/Dashboard";
import ResumeBuilder from "./components/pages/ResumeBuilder";
import Requests from "./components/pages/Requests";
import MyResumes from "./components/pages/MyResumes";

import ResumePDF from "./components/pages/ResumePDF"; // ✅ NEW

import AdminLogin from "./components/pages/admin/AdminLogin";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminRequests from "./components/pages/admin/AdminRequests";

import NotFound from "./components/pages/NotFound";
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
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= USER ROUTES ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/:id"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-resumes"
            element={
              <ProtectedRoute>
                <MyResumes />
              </ProtectedRoute>
            }
          />

          {/* ================= PDF ROUTE ================= */}
          {/* This page triggers backend Puppeteer PDF */}
          <Route
            path="/resume/:resumeId/pdf"
            element={
              <ProtectedRoute>
                <ResumePDF />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute requireAdmin>
                <AdminRequests />
              </ProtectedRoute>
            }
          />

          {/* ================= LEGAL ================= */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
