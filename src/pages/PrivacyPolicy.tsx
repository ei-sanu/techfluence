import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="font-decorative text-4xl tech-text-gradient mb-2">Privacy Policy</h1>
                        <p className="text-muted-foreground font-sans">Last updated: 22 December 2025</p>
                    </div>

                    <div className="parchment-bg tech-border rounded-xl p-6 md:p-10 space-y-8">
                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">1. Information We Collect</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p><strong>Personal Information:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Full name and registration number</li>
                                    <li>Email address and contact number</li>
                                    <li>University/institution name</li>
                                    <li>Course and year of study</li>
                                    <li>Address, city, and pincode</li>
                                    <li>Technical skills (optional)</li>
                                    <li>Team details (for hackathon participants)</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">2. How We Use Your Information</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>We use the collected information for:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Processing and managing your event registration</li>
                                    <li>Communicating event-related updates and announcements</li>
                                    <li>Facilitating check-in at the event venue</li>
                                    <li>Creating participant badges and certificates</li>
                                    <li>Organizing hackathon teams and activities</li>
                                    <li>Improving our future events</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">3. Data Storage and Security</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>3.1. Your data is stored securely using industry-standard encryption.</p>
                                <p>3.2. We use Supabase for database management with row-level security enabled.</p>
                                <p>3.3. Access to personal data is restricted to authorized personnel only.</p>
                                <p>3.4. We implement appropriate technical measures to protect against unauthorized access.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">4. Data Sharing</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>4.1. We do not sell or rent your personal information to third parties.</p>
                                <p>4.2. We may share data with event sponsors for networking purposes (with your consent).</p>
                                <p>4.3. We may disclose information if required by law or to protect our rights.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">5. Your Rights</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>You have the right to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Access your personal data</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your data (subject to legal requirements)</li>
                                    <li>Withdraw consent for data processing</li>
                                    <li>Receive a copy of your data in a portable format</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">6. Cookies and Tracking</h2>
                            <div className="font-sans text-foreground leading-relaxed space-y-3">
                                <p>6.1. We use essential cookies for authentication and session management.</p>
                                <p>6.2. We may use analytics to understand website usage patterns.</p>
                                <p>6.3. You can manage cookie preferences through your browser settings.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">7. Data Retention</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                We retain your personal data for the duration of the event and up to 2 years thereafter
                                for record-keeping and future event invitations. You may request deletion at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">8. Changes to Privacy Policy</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                We may update this privacy policy from time to time. We will notify you of any significant
                                changes via email or through our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-decorative text-2xl text-primary mb-4">9. Contact Us</h2>
                            <p className="font-sans text-foreground leading-relaxed">
                                For privacy-related inquiries, please contact us at{" "}
                                <a href="mailto:privacy@techfluence.com" className="text-primary hover:underline">
                                    privacy@techfluence.com
                                </a>
                            </p>
                        </section>

                        <div className="pt-6 border-t border-border text-center">
                            <Link to="/terms-and-conditions" className="text-primary hover:underline font-sans">
                                ← View Terms and Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
