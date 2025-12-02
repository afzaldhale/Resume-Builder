import React from 'react';
import { Card } from '../ui/card';
import { Shield, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background pt-10">
            <div className="container mx-auto px-6 py-12">
                
                {/* Header Section */}
                <header className="text-center mb-12 space-y-3">
                    <Shield className="h-10 w-10 text-primary mx-auto" />
                    <h1 className="text-4xl font-bold text-foreground">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Last Updated: December 1, 2025</span>
                    </div>
                </header>

                <Card className="p-8 shadow-xl max-w-5xl mx-auto space-y-8">
                    
                    <p className="text-lg text-muted-foreground">
                        Your privacy is critically important to us. This Privacy Policy describes how Resume Builder Pro ("we," "us," or "our") collects, uses, and shares your personal information.
                    </p>

                    {/* --- 1. Information We Collect --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">1. Information We Collect</h2>
                        <p className="text-foreground">
                            We collect information in two main ways: information you provide to us directly and information collected automatically through our service.
                        </p>
                        
                        <h3 className="text-xl font-semibold mt-4">Information You Provide Directly:</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>**Account Data:** When you sign up, we collect your name and email address.</li>
                            <li>**Resume Data:** All information you enter into the Resume Builder (experience, education, skills, personal contact details) is stored to generate your resume.</li>
                            <li>**Communications:** Records of any correspondence with us, such as support requests or feedback.</li>
                        </ul>
                    </section>
                    
                    <hr className="border-border" />

                    {/* --- 2. How We Use Your Information --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">2. How We Use Your Information</h2>
                        <p className="text-foreground">
                            We use your personal data to operate, maintain, and provide the features of the service, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>To **create and generate** your requested resume documents.</li>
                            <li>To facilitate the **Admin Approval System** (sharing your resume data internally for review).</li>
                            <li>To send you **service-related communications** (e.g., password reset, download approval notification).</li>
                            <li>To improve our service and develop **new templates** and features.</li>
                        </ul>
                    </section>
                    
                    <hr className="border-border" />

                    {/* --- 3. Sharing Your Information --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">3. Sharing Your Information</h2>
                        <p className="text-foreground">
                            We do not sell or rent your personal information to third parties. We may share your information only in the following situations:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>**With Service Providers:** Third-party vendors who perform services on our behalf (e.g., hosting, analytics).</li>
                            <li>**For Legal Compliance:** When required by law or subpoena.</li>
                            <li>**Business Transfers:** In connection with a merger, sale of company assets, or acquisition.</li>
                        </ul>
                    </section>

                    <hr className="border-border" />

                    {/* --- 4. Your Rights --- */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">4. Your Data Protection Rights</h2>
                        <p className="text-foreground">
                            You have the right to access, update, or delete the personal information we hold about you. You can usually do this directly within your dashboard or by contacting us.
                        </p>
                    </section>

                    {/* --- Contact Information --- */}
                    <section className="pt-4 border-t border-border mt-8 space-y-4">
                        <h2 className="text-2xl font-bold text-primary">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="flex items-center gap-2 font-medium text-foreground">
                            <Mail className="h-5 w-5 text-primary" />
                            support@resumebuilderpro.com
                        </div>
                    </section>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;