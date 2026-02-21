'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/constants';

export default function ContactPage() {
    return (
        <div className="animate-fade-in">
            {/* Header */}
            <section className="bg-beige-100 py-20 text-center">
                <div className="container-elegant">
                    <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">Contact Us</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have questions about our products or your order? We're here to help.
                        Get in touch with the {APP_NAME} team.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container-elegant">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gold-100/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-gold-100" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email Us</p>
                                            <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gold-100/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-gold-100" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Call Us</p>
                                            <p className="text-sm text-muted-foreground">{SUPPORT_PHONE}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gold-100/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-gold-100" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Visit Our Office</p>
                                            <p className="text-sm text-muted-foreground">
                                                123 Islamic Center Plaza<br />
                                                Suite 456, Heritage District
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Card className="bg-charcoal-100 text-white">
                                <CardContent className="p-6">
                                    <h4 className="font-semibold mb-2">Customer Support Hours</h4>
                                    <p className="text-sm text-white/70">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <form className="space-y-6 bg-white p-8 rounded-2xl border border-beige-200" onSubmit={(e) => {
                                e.preventDefault();
                                alert('Thank you for your message. We will get back to you soon!');
                            }}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="Order Inquiry" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" required />
                                </div>
                                <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                                    Send Message
                                    <Send className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
