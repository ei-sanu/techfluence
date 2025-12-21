import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="font-decorative text-4xl royal-text-gradient mb-2">Terms and Conditions</h1>
                        <p className="text-muted-foreground font-sans">Last updated: December 2024</p>
                    </div>

                    <div className="parchment-bg royal-border rounded-xl p-6 md:p-10 space-y-8">
                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">1. Acceptance of Terms</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                By registering for TECH FLUENCE 6.0, you agree to be bound by these Terms and Conditions.
                                If you do not agree to these terms, please do not register for the event.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">2. Event Registration</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>2.1. Registration is on a first-come, first-served basis and subject to availability.</p>
                                <p>2.2. Each participant can only register once for the event.</p>
                                <p>2.3. You must provide accurate and complete information during registration.</p>
                                <p>2.4. Registration is non-transferable without prior approval from the organizers.</p>
                                <p>2.5. A unique check-in code will be provided upon successful registration, which must be presented at the event venue.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">3. Hackathon Participation</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>3.1. Hackathon teams must consist of exactly 4 members (1 leader + 3 members).</p>
                                <p>3.2. Each team member can only be part of one team.</p>
                                <p>3.3. Team names must be unique and appropriate.</p>
                                <p>3.4. All team members must be present at the venue for participation.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">4. Code of Conduct</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>4.1. Participants must behave professionally and respectfully throughout the event.</p>
                                <p>4.2. Any form of harassment, discrimination, or inappropriate behavior will not be tolerated.</p>
                                <p>4.3. Participants must follow all instructions from event organizers and volunteers.</p>
                                <p>4.4. Violation of the code of conduct may result in immediate disqualification and removal from the venue.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">5. Intellectual Property</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>5.1. Participants retain ownership of their original work created during the hackathon.</p>
                                <p>5.2. By participating, you grant the organizers the right to photograph and record the event for promotional purposes.</p>
                                <p>5.3. Any pre-existing intellectual property used must be properly attributed.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">6. Liability</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>6.1. The organizers are not responsible for any personal belongings lost or damaged during the event.</p>
                                <p>6.2. Participants attend the event at their own risk.</p>
                                <p>6.3. The organizers reserve the right to modify event schedules, activities, or cancel the event if necessary.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">7. Modifications</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                The organizers reserve the right to modify these terms and conditions at any time.
                                Participants will be notified of any significant changes via email.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">8. Contact</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                For any questions regarding these terms, please contact us at{" "}
                                <a href="mailto:techfluence@example.com" className="text-primary hover:underline">
                                    techfluence@example.com
                                </a>
                            </p>
                        </section>

                        <div className="pt-6 border-t border-border text-center">
                            <Link to="/privacy-policy" className="text-primary hover:underline font-sans">
                                View Privacy Policy →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
