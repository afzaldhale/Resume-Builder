import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Users, CheckCircle, ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Star, Quote } from "lucide-react";
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
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 ${step1.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-150 ${step2.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-300 ${step3.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
                className={`relative mb-16 md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-500 ${step4.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
                className={`relative md:grid md:grid-cols-2 md:gap-8 items-center transition-all duration-700 delay-700 ${step5.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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

      {/* Statistics Section */}
      <section className="py-20 bg-background border-y">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-primary">10K+</div>
              <p className="text-muted-foreground">Resumes Created</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-secondary">95%</div>
              <p className="text-muted-foreground">Approval Rate</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-success">24h</div>
              <p className="text-muted-foreground">Average Response</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-accent">8K+</div>
              <p className="text-muted-foreground">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">About Resume Builder Pro</h2>
              <p className="text-lg text-muted-foreground">
                Empowering professionals to create outstanding resumes since 2020
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 shadow-soft">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  We believe everyone deserves a professional resume that showcases their unique talents.
                  Our mission is to make resume creation accessible, intuitive, and effective for job seekers
                  at every stage of their career journey.
                </p>
              </Card>

              <Card className="p-8 shadow-soft">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become the world's most trusted resume building platform, helping millions of
                  professionals land their dream jobs through quality-controlled, ATS-optimized resumes
                  that stand out to employers.
                </p>
              </Card>
            </div>

            <Card className="p-8 shadow-soft">
              <h3 className="text-xl font-semibold mb-4">Why We're Different</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <CheckCircle className="h-8 w-8 text-success mb-3" />
                  <h4 className="font-semibold mb-2">Quality First</h4>
                  <p className="text-sm text-muted-foreground">
                    Every resume goes through admin review to ensure the highest quality standards.
                  </p>
                </div>
                <div>
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Expert Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team of resume experts is always ready to help you succeed.
                  </p>
                </div>
                <div>
                  <FileText className="h-8 w-8 text-secondary mb-3" />
                  <h4 className="font-semibold mb-2">ATS Optimized</h4>
                  <p className="text-sm text-muted-foreground">
                    Built with applicant tracking systems in mind for maximum visibility.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied professionals who landed their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="p-8 shadow-soft hover:shadow-medium transition-all space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="text-muted-foreground italic">
                "Resume Builder Pro helped me land my dream job at a Fortune 500 company.
                The approval process ensured my resume was perfect before I sent it out!"
              </p>
              <div className="pt-4 border-t">
                <p className="font-semibold text-foreground">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Software Engineer</p>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-8 shadow-soft hover:shadow-medium transition-all space-y-4 bg-gradient-card">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-secondary/20" />
              <p className="text-muted-foreground italic">
                "The intuitive builder and real-time preview made resume creation effortless.
                I got my resume approved within 24 hours and received 3 interview calls!"
              </p>
              <div className="pt-4 border-t">
                <p className="font-semibold text-foreground">Michael Chen</p>
                <p className="text-sm text-muted-foreground">Marketing Manager</p>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-8 shadow-soft hover:shadow-medium transition-all space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-success/20" />
              <p className="text-muted-foreground italic">
                "As a recent graduate, I was lost on how to create a professional resume.
                This platform guided me through every step and the admin feedback was invaluable!"
              </p>
              <div className="pt-4 border-t">
                <p className="font-semibold text-foreground">Emily Rodriguez</p>
                <p className="text-sm text-muted-foreground">Recent Graduate</p>
              </div>
            </Card>
          </div>

          {/* Additional testimonials row */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {/* Testimonial 4 */}
            <Card className="p-8 shadow-soft hover:shadow-medium transition-all space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-accent/20" />
              <p className="text-muted-foreground italic">
                "The ATS-optimized format helped my resume get past automated filters.
                I went from 0 responses to 5 interviews in just two weeks!"
              </p>
              <div className="pt-4 border-t">
                <p className="font-semibold text-foreground">David Thompson</p>
                <p className="text-sm text-muted-foreground">Data Analyst</p>
              </div>
            </Card>

            {/* Testimonial 5 */}
            <Card className="p-8 shadow-soft hover:shadow-medium transition-all space-y-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="text-muted-foreground italic">
                "Professional, easy to use, and the quality control is outstanding.
                This is the only resume builder you'll ever need!"
              </p>
              <div className="pt-4 border-t">
                <p className="font-semibold text-foreground">Jessica Martinez</p>
                <p className="text-sm text-muted-foreground">Project Manager</p>
              </div>
            </Card>
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

      {/* Enhanced Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-primary">Resume Builder Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create professional resumes that get you hired. Quality-controlled and ATS-optimized.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => navigate("/signup")} className="text-muted-foreground hover:text-primary transition-colors story-link">
                    Get Started
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/login")} className="text-muted-foreground hover:text-primary transition-colors story-link">
                    Login
                  </button>
                </li>
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors story-link">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors story-link">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">FAQ</li>
                <li className="text-muted-foreground">Help Center</li>
                <li className="text-muted-foreground">Privacy Policy</li>
                <li className="text-muted-foreground">Terms of Service</li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contact Us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@resumepro.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>New York, NY 10001</span>
                </li>
              </ul>

              {/* Social Media Icons */}
              <div className="flex gap-3 pt-2">
                <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Linkedin className="h-4 w-4 text-primary" />
                </button>
                <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Twitter className="h-4 w-4 text-primary" />
                </button>
                <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Facebook className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © 2025 Resume Builder Pro. Developed By{" "}
              <a
                href="https://vtechnex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                VTechnex
              </a>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Landing;