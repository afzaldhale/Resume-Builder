import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card } from '../ui/card'; 
import { Button } from '../ui/button'; 

const ContactUsPage = () => {
    // Basic state management for the form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // In a real application, you would send this data to an API endpoint.
        // For now, we'll just simulate a successful submission.
        
        console.log('Form Submitted:', formData);
        setStatus('success');
        
        // Clear form after submission
        setFormData({ name: '', email: '', message: '' });

        // Reset status after a few seconds
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <div className="min-h-screen bg-background pt-10">
            <div className="container mx-auto px-6 py-12">
                
                {/* Header Section */}
                <header className="text-center mb-12 space-y-3">
                    <h1 className="text-4xl font-bold text-foreground">
                        Get In Touch with Resume Builder Pro
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We're here to help! Send us a message, and we'll get back to you as soon as possible.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Contact Information (Left Column) */}
                    <div className="md:col-span-1 space-y-6">
                        <h2 className="text-2xl font-semibold text-primary mb-4">Contact Info</h2>
                        
                        <div className="flex items-start space-x-4">
                            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-foreground">Email Support</h3>
                                <p className="text-muted-foreground">support@resumebuilderpro.com</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-foreground">Phone Number</h3>
                                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-foreground">Office Location</h3>
                                <p className="text-muted-foreground">123 Career Lane, Resume City, 10001</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (Right Column) */}
                    <Card className="md:col-span-2 p-8 shadow-large">
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">Send Us a Message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-border rounded-lg bg-input resize-y focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            
                            {/* Submission Status */}
                            {status === 'success' && (
                                <p className="text-success font-medium">
                                    Thank you! Your message has been sent successfully. We will respond shortly.
                                </p>
                            )}

                            {/* Submit Button */}
                            <Button type="submit" className="w-full gap-2" disabled={status === 'success'}>
                                Send Message <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;