import React from 'react';
import { Card } from '../ui/card';
import { FileText, Calendar, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pt-10">
            <div className="container mx-auto px-6 py-12">
                
                {/* Header Section */}
                <header className="text-center mb-12 space-y-3">
                    <FileText className="h-10 w-10 text-secondary mx-auto" />
                    <h1 className="text-4xl font-bold text-foreground">
                        Terms of Service
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Effective Date: December 1, 2025</span>
                    </div>
                </header>

                <Card className="p-8 shadow-xl max-w-5xl mx-auto space-y-8">
                    
                    <p className="text-lg text-muted-foreground">
                        Welcome to Resume Builder Pro! These Terms of Service ("Terms") govern your use of the Resume Builder Pro website, products, and services ("Service"). By accessing or using the Service, you agree to be bound by these Terms.
                    </p>

                    {/* --- 1. Acceptance of Terms --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-secondary">1. Acceptance of Terms</h2>
                        <p className="text-foreground">
                            By creating an account or using the Service, you represent that you are at least 18 years old or are accessing the Service under the supervision of a parent or guardian. If you disagree with any part of the terms, then you may not access the Service.
                        </p>
                    </section>
                    
                    <hr className="border-border" />

                    {/* --- 2. User Accounts and Data --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-secondary">2. User Accounts and Data</h2>
                        
                        <h3 className="text-xl font-semibold mt-4">Account Responsibility:</h3>
                        <p className="text-muted-foreground">
                            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                        </p>

                        <h3 className="text-xl font-semibold mt-4">Resume Content Ownership:</h3>
                        <p className="text-muted-foreground">
                            You retain all rights to the text and data you input into the resume builder. You grant Resume Builder Pro a license to use this data solely for the purpose of generating, reviewing (via Admin Approval), and delivering the resume to you.
                        </p>
                    </section>
                    
                    <hr className="border-border" />

                    {/* --- 3. Admin Approval and Download --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-secondary">3. Admin Approval and Download</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>**Approval Process:** Resume submissions are subject to manual review by our administrators. This process is for quality control and does not guarantee employment.</li>
                            <li>**Service Guarantee:** We aim for an average approval time of 24 hours, but we reserve the right to extend this period based on volume.</li>
                            <li>**Final Output:** Downloads are provided in the final, approved PDF format.</li>
                        </ul>
                    </section>

                    <hr className="border-border" />

                    {/* --- 4. Termination --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-secondary">4. Termination</h2>
                        <p className="text-muted-foreground">
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    {/* --- Contact Information --- */}
                    <section className="pt-4 border-t border-border mt-8 space-y-4">
                        <h2 className="text-2xl font-bold text-secondary">Contact Information</h2>
                        <p className="text-muted-foreground">
                            Questions about the Terms of Service should be sent to us at:
                        </p>
                        <div className="flex items-center gap-2 font-medium text-foreground">
                            <Mail className="h-5 w-5 text-secondary" />
                            legal@resumebuilderpro.com
                        </div>
                    </section>
                </Card>
                
                {/* CTA */}
                <div className="text-center mt-10">
                    <Button onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;