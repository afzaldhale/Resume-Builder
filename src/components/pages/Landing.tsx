import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { FileText, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIntersectionObserver } from "../hooks/use-intersection-obser";

const Landing = () => {
  const navigate = useNavigate();
  
  const step1 = useIntersectionObserver({ threshold: 0.3 });
  const step2 = useIntersectionObserver({ threshold: 0.3 });
  const step3 = useIntersectionObserver({ threshold: 0.3 });
  const step4 = useIntersectionObserver({ threshold: 0.3 });
  const step5 = useIntersectionObserver({ threshold: 0.3 });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Resume Builder Pro</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-6 py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
              Build Your Perfect Resume in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
              Create professional, ATS-friendly resumes with our intuitive builder. 
              Get admin-approved downloads and stand out to employers.
            </p>
            <div className="flex gap-4 justify-center animate-fade-in [animation-delay:400ms]">
              <Button size="lg" onClick={() => navigate("/signup")} className="gap-2 hover-scale">
                Start Building Free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="hover-scale">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Resume Builder Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Resume Builder</h3>
              <p className="text-muted-foreground">
                Intuitive form-based builder with real-time preview. Create professional resumes effortlessly.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Admin Approval System</h3>
              <p className="text-muted-foreground">
                Quality-controlled downloads. Get your resume reviewed and approved by professionals.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Track Your Requests</h3>
              <p className="text-muted-foreground">
                Monitor the status of your download requests in real-time with our intuitive dashboard.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your professional resume in just a few simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-success transform -translate-x-1/2" />

              {/* Step 1 */}
              <div 
                ref={step1.ref}
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 ${
                  step1.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Card className="p-8 shadow-soft hover:shadow-medium transition-all md:text-right">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4 md:float-right md:ml-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Account & Login</h3>
                  <p className="text-muted-foreground">
                    Sign up for free and login to access the resume builder dashboard.
                  </p>
                </Card>
                <div className="hidden md:block" />
              </div>

              {/* Step 2 */}
              <div 
                ref={step2.ref}
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-150 ${
                  step2.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="hidden md:block" />
                <Card className="p-8 shadow-soft hover:shadow-medium transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Build Your Resume</h3>
                  <p className="text-muted-foreground">
                    Fill in your details using our intuitive form with live preview. Add your education, experience, skills, and projects.
                  </p>
                </Card>
              </div>

              {/* Step 3 */}
              <div 
                ref={step3.ref}
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-300 ${
                  step3.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Card className="p-8 shadow-soft hover:shadow-medium transition-all md:text-right">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-xl mb-4 md:float-right md:ml-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Request Download</h3>
                  <p className="text-muted-foreground">
                    Click "Request Resume Download" to submit your resume for admin approval.
                  </p>
                </Card>
                <div className="hidden md:block" />
              </div>

              {/* Step 4 */}
              <div 
                ref={step4.ref}
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-500 ${
                  step4.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="hidden md:block" />
                <Card className="p-8 shadow-soft hover:shadow-medium transition-all bg-gradient-card">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning text-warning-foreground font-bold text-xl mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Contact Admin for Approval</h3>
                  <p className="text-muted-foreground mb-4">
                    Call the admin to expedite your request approval:
                  </p>
                  <div className="inline-flex items-center gap-2 bg-background/50 px-4 py-2 rounded-lg border border-border">
                    <span className="text-lg font-semibold text-foreground">📞 +1 (555) 123-4567</span>
                  </div>
                </Card>
              </div>

              {/* Step 5 */}
              <div 
                ref={step5.ref}
                className={`relative md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-700 ${
                  step5.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Card className="p-8 shadow-soft hover:shadow-medium transition-all md:text-right bg-success/10 border-success/20">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success text-success-foreground font-bold text-xl mb-4 md:float-right md:ml-4">
                    5
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-success">Download Your Resume</h3>
                  <p className="text-muted-foreground">
                    Once approved, you'll be notified and can download your professionally formatted resume!
                  </p>
                </Card>
                <div className="hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <Card className="p-12 text-center space-y-6 shadow-large bg-gradient-card">
            <h2 className="text-3xl font-bold">Ready to Build Your Future?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have created stunning resumes with Resume Builder Pro.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
              Create Your Resume Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 Resume Builder Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
