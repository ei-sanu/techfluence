
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CalendarPlus,
    Check,
    Code,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Shield,
    Sparkles,
    User
} from "lucide-react";
import { useState } from "react";

// Social Media Icons
const InstagramIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TwitterIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedInIcon = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// Gear component for loading animation
const Gear = ({ size, delay, className = "" }: { size: number; delay: number; className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={`animate-spin ${className}`}
        style={{
            animationDelay: `${delay}ms`,
            animationDuration: "2s",
        }}
        fill="currentColor"
    >
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path
            fillRule="evenodd"
            d="M9.25 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019.25 1zm5.5 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM3.5 12a8.5 8.5 0 1117 0 8.5 8.5 0 01-17 0zm7.75-10.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM1 9.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 011 9.25zm0 5.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm19.5-5.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm0 5.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9.25 21a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm5.5 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
        />
    </svg>
);

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [stage, setStage] = useState(0);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    name: formData.name,
                    email: formData.email,
                    subject: `TECHFLUENCE 6: ${formData.subject}`,
                    message: formData.message,
                    from_name: "TECHFLUENCE 6 Contact Form",
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                // Animate through stages
                setTimeout(() => setStage(1), 300);
                setTimeout(() => setStage(2), 800);
                setTimeout(() => setStage(3), 1300);
            } else {
                throw new Error("Form submission failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSuccess(false);
        setStage(0);
    };

    const addToGoogleCalendar = () => {
        const event = {
            text: "TECHFLUENCE 6 - Premier Tech Event",
            dates: "20260130T090000/20260202T180000",
            details: "Join us for TECHFLUENCE 6 - The Hub of Innovation! Experience hackathons, tech events, and more.",
            location: "Lovely Professional University, Jalandhar - Delhi G.T. Road, Phagwara, Punjab",
        };
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
        window.open(url, "_blank");
    };

    const downloadICS = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TECHFLUENCE 6//EN
BEGIN:VEVENT
DTSTART:20260130T090000
DTEND:20260202T180000
SUMMARY:TECHFLUENCE 6 - Premier Tech Event
DESCRIPTION:Join us for TECHFLUENCE 6 - The Hub of Innovation! Experience hackathons, tech events, and more.
LOCATION:GIET University, Gunupur, Odisha
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "techfluence-6.ics";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="font-decorative text-4xl md:text-5xl tech-text-gradient mb-4">
                            Contact Us
                        </h1>
                        <p className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg">
                            Have questions about TECHFLUENCE 6? We're here to help! Reach out to our team and we'll respond promptly.
                        </p>
                    </div>

                    {/* Top Section - Contact Info, Event Details, FAQ in horizontal layout */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Event Date Card */}
                        <Card className="overflow-hidden tech-border">
                            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-primary/20 rounded-lg">
                                        <CalendarPlus className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-cinzel text-xl font-semibold">Mark Your Calendar</h3>
                                        <p className="text-sm text-muted-foreground">Don't miss the tech event!</p>
                                    </div>
                                </div>
                                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-primary">30</p>
                                            <p className="text-lg font-semibold">Jan 2026</p>
                                        </div>
                                        <div className="text-center px-2">
                                            <p className="text-2xl font-bold text-primary">&</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">2</p>
                                            <p className="text-base font-semibold">Feb 2026</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button onClick={addToGoogleCalendar} className="w-full gap-2">
                                        <CalendarPlus className="w-4 h-4" />
                                        Add to Google Calendar
                                    </Button>
                                    <Button onClick={downloadICS} variant="outline" className="w-full gap-2">
                                        <CalendarPlus className="w-4 h-4" />
                                        Download .ics
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Contact Information */}
                        <Card className="tech-border">
                            <CardContent className="p-6 h-full">
                                <h3 className="font-cinzel text-xl font-semibold flex items-center gap-2 mb-4">
                                    <Code className="w-5 h-5 text-primary" />
                                    Contact Information
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                            <MapPin className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Event Venue</p>
                                            <p className="text-muted-foreground text-sm">Lovely Professional University,
                                                Jalandhar - Delhi G.T. Road, Phagwara, Punjab
                                            </p>
                                            <p className="text-muted-foreground text-sm">Punjab, India - 144411</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                            <Mail className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Email Us</p>
                                            <a href="mailto:techfluence@lpu.in" className="text-primary hover:underline text-sm">
                                                techfluence@lpu.in
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                            <Phone className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Call Us</p>
                                            <a href="tel:+918273165573" className="text-primary hover:underline text-sm">
                                                +91 82731 65573
                                            </a>
                                            <p className="text-xs text-muted-foreground">Divyansh Goyal</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links with Icons */}
                                <div className="mt-4 pt-4 border-t border-border/50">
                                    <p className="text-sm text-muted-foreground mb-3">Follow us</p>
                                    <div className="flex gap-3">
                                        <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg hover:from-pink-500/30 hover:to-purple-500/30 transition-all group"
                                            aria-label="Instagram"
                                        >
                                            <InstagramIcon className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                                        </a>
                                        <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-lg hover:from-slate-400/30 hover:to-slate-600/30 transition-all group"
                                            aria-label="Twitter/X"
                                        >
                                            <TwitterIcon className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
                                        </a>
                                        <a
                                            href="https://linkedin.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg hover:from-blue-600/30 hover:to-blue-800/30 transition-all group"
                                            aria-label="LinkedIn"
                                        >
                                            <LinkedInIcon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Quick Links */}
                        <Card className="tech-border md:col-span-2 lg:col-span-1">
                            <CardContent className="p-6 h-full">
                                <h3 className="font-cinzel text-xl font-semibold mb-4">Common Questions</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium text-sm">How do I register for the event?</p>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Click on "Register Now" in the navigation and fill out the form.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium text-sm">Can I participate in both hackathon and events?</p>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Yes! Select "Both" during registration to participate in everything.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium text-sm">What is the team size for hackathon?</p>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Each team must have exactly 4 members (1 leader + 3 members).
                                        </p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium text-sm">Is there a registration fee?</p>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Registration details and fees will be provided after form submission.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form - Full Width Below */}
                    <div className="relative overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

                        <Card className="tech-border relative backdrop-blur-sm bg-background/50">
                            <CardContent className="p-0">
                                {/* Success Animation Overlay */}
                                {isSuccess && (
                                    <div className="absolute inset-0 bg-background/98 backdrop-blur-md z-10 flex items-center justify-center rounded-lg">
                                        <div className="text-center p-8">
                                            {/* Gears Animation */}
                                            <div className={`relative w-32 h-32 mx-auto mb-6 transition-opacity duration-500 ${stage >= 2 ? "opacity-0 absolute" : "opacity-100"}`}>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary">
                                                    <Gear size={48} delay={0} />
                                                </div>
                                                <div className="absolute bottom-4 left-2 text-primary/70">
                                                    <Gear size={36} delay={200} className="animate-spin-reverse" />
                                                </div>
                                                <div className="absolute bottom-4 right-2 text-primary/70">
                                                    <Gear size={36} delay={400} />
                                                </div>
                                            </div>

                                            {/* Success Seal */}
                                            <div className={`transition-all duration-700 ${stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                                                <div className="relative inline-block">
                                                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center tech-glow animate-scale-in shadow-2xl shadow-primary/50">
                                                        <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                                                {stage >= 3 ? (
                                                                    <Check className="w-12 h-12 text-primary-foreground animate-scale-in" />
                                                                ) : (
                                                                    <Send className="w-8 h-8 text-primary-foreground" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
                                                    <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-accent animate-pulse" />
                                                    <Sparkles className="absolute top-1/2 -left-4 w-5 h-5 text-primary/70 animate-pulse delay-300" />
                                                </div>
                                            </div>

                                            {/* Success Message */}
                                            <div className={`mt-8 transition-all duration-500 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                                <h3 className="font-decorative text-3xl tech-text-gradient mb-3">
                                                    Message Sent Successfully!
                                                </h3>
                                                <p className="text-muted-foreground mb-6 text-lg">
                                                    Your message has been delivered. Our team will respond within 24 hours!
                                                </p>
                                                <Button onClick={resetForm} variant="outline" className="gap-2 group">
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    Send Another Message
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form Header */}
                                <div className="relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
                                    <div className="relative p-8 border-b border-border/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-cinzel text-2xl font-bold flex items-center gap-3">
                                                <div className="p-2 bg-primary/20 rounded-lg">
                                                    <Send className="w-6 h-6 text-primary" />
                                                </div>
                                                Get in Touch
                                            </h3>
                                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                        <p className="text-muted-foreground ml-14">
                                            We're here to help! Share your thoughts, questions, or feedback with us.
                                        </p>
                                    </div>
                                </div>

                                {/* Form - Modern Layout */}
                                <form onSubmit={handleSubmit} className="p-8 relative">
                                    {/* Loading Overlay */}
                                    {isSubmitting && (
                                        <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-10 flex items-center justify-center rounded-lg">
                                            <div className="text-center">
                                                <div className="relative w-28 h-28 mx-auto mb-6">
                                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                                    <div className="relative top-0 left-1/2 -translate-x-1/2 text-primary">
                                                        <Gear size={48} delay={0} />
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 text-primary/70">
                                                        <Gear size={32} delay={150} className="animate-spin-reverse" />
                                                    </div>
                                                    <div className="absolute bottom-2 right-2 text-primary/70">
                                                        <Gear size={32} delay={300} />
                                                    </div>
                                                </div>
                                                <h4 className="font-cinzel text-xl mb-2">Sending Message...</h4>
                                                <p className="text-muted-foreground animate-pulse">
                                                    Please wait while we process your request
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form Fields - Modern Grid */}
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
                                                <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 border-border/50 hover:border-primary/50"
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                                                <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                </div>
                                                Email Address *
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 border-border/50 hover:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6 group">
                                        <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold">
                                            <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                            </div>
                                            Subject *
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder="What would you like to discuss?"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 border-border/50 hover:border-primary/50"
                                        />
                                    </div>

                                    <div className="space-y-2 mb-8 group">
                                        <Label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold">
                                            <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                            </div>
                                            Your Message *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us more about your inquiry, feedback, or questions..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 resize-none border-border/50 hover:border-primary/50"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formData.message.length} / 1000 characters
                                        </p>
                                    </div>

                                    {/* Submit Section */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
                                        <p className="text-sm text-muted-foreground order-2 sm:order-1">
                                            <span className="inline-flex items-center gap-1">
                                                <Shield className="w-4 h-4 text-primary" />
                                                Protected by our{" "}
                                                <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                                                    Privacy Policy
                                                </a>
                                            </span>
                                        </p>
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto gap-2 h-14 px-10 text-base order-1 sm:order-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                                            disabled={isSubmitting}
                                        >
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Send Message
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
