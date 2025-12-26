import React from 'react';
import { Link } from 'react-router-dom';

const CrownIcon = ({ className = 'w-8 h-8' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 7l4 4 3-6 4 6 3-4 4 4v6H3V7z" fill="url(#g)" />
        <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#ff9a3c" />
                <stop offset="1" stopColor="#ff6a00" />
            </linearGradient>
        </defs>
    </svg>
);

const SocialIcon = ({ name }: { name: string }) => {
    const shared = 'w-5 h-5';
    switch (name) {
        case 'twitter':
            return (
                <svg className={shared} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20 7.5c-.6.3-1.2.5-1.8.6.6-.4 1-1 1.2-1.8-.6.4-1.3.6-2.1.8C16.8 6 15.9 5.5 15 5.5c-1.8 0-3.2 1.6-2.9 3.3C9.6 8.6 7.1 7.6 5 5.7c-.8 1.4-.1 3.3 1.3 4.2-.5 0-1-.2-1.5-.4v.1c0 1.5 1.1 2.8 2.5 3.1-.4.1-.8.1-1.2.1-.3 0-.6 0-.9-.1.6 2 2.4 3.4 4.6 3.4C9.6 20 7 20.7 4.5 20.7c-.6 0-1.3 0-1.9-.1 1.3.8 2.8 1.2 4.4 1.2 5.2 0 8.1-4.4 8.1-8.2v-.4c.6-.4 1.2-1 1.6-1.6z" fill="currentColor" />
                </svg>
            );
        case 'linkedin':
            return (
                <svg className={shared} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.95 5.5 1.86 5.5.94 4.6.94 3.5.94 2.39 1.86 1.5 2.95 1.5 4.06 1.5 4.98 2.39 4.98 3.5zM.78 8.5h4.38V24H.78V8.5zM8.57 8.5h4.2v2.1h.1c.6-1.1 2.1-2.3 4.4-2.3 4.7 0 5.6 3.1 5.6 7.1V24h-4.4v-7.1c0-1.7-.03-3.9-2.4-3.9-2.4 0-2.8 1.9-2.8 3.8V24H8.57V8.5z" fill="currentColor" />
                </svg>
            );
        case 'instagram':
            return (
                <svg className={shared} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zM18.2 6.6a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z" fill="currentColor" />
                </svg>
            );
        default:
            return (
                <svg className={shared} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.45.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.2-3.37-1.2-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.92 0-1.09.39-1.99 1.03-2.69-.1-.26-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0112 6.8c.85 0 1.71.11 2.51.32 1.9-1.3 2.74-1.03 2.74-1.03.55 1.39.2 2.41.1 2.67.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49A10 10 0 0022 12c0-5.52-4.48-10-10-10z" fill="currentColor" />
                </svg>
            );
    }
};

const NavItem = ({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) => (
    <Link to={to} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black/20 border border-orange-600/30 hover:shadow-sm hover:shadow-orange-600/10 transition-all duration-200">
        <span className="text-orange-400/90">{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
    </Link>
);

const FooterPremium: React.FC = () => {
    return (
        <footer className="premium-footer mt-8 text-white relative overflow-hidden">
            <div className="particles pointer-events-none" aria-hidden />

            <div className="max-w-6xl mx-auto px-6 py-6 md:py-10 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-1 rounded-full bg-gradient-to-br from-orange-400/8 to-amber-500/6 ring-1 ring-orange-500/8">
                        <CrownIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-display tracking-tight tech-text-gradient">TECH FLUENCE <span className="text-xs text-amber-200/80">6.0</span></h2>
                    <p className="text-xs text-amber-100/70">Innovation Meets Excellence</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    {['twitter', 'linkedin', 'instagram', 'github'].map((s) => (
                        <a key={s} href="#" aria-label={s} className="group w-9 h-9 flex items-center justify-center rounded-md bg-white/2 border border-orange-600/18 hover:scale-103 transform transition-all duration-180">
                            <span className="text-orange-300 group-hover:drop-shadow-[0_6px_18px_rgba(255,122,0,0.24)] text-opacity-95">
                                <SocialIcon name={s} />
                            </span>
                        </a>
                    ))}
                </div>

                <nav className="mt-6 w-full flex flex-wrap justify-center gap-2">
                    <NavItem to="/" label="Home" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" fill="currentColor" /></svg>} />
                    <NavItem to="/register" label="Register" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 00-7 7v3H3l9 7 9-7h-2V9a7 7 0 00-7-7z" fill="currentColor" /></svg>} />
                    <NavItem to="/activity" label="Activity" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3 8 4-16 3 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
                    <NavItem to="/privacy-policy" label="Privacy" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" fill="currentColor" /></svg>} />
                    <NavItem to="/contact" label="Contact" icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M21 8V7l-3 2-2-2-5 5 2 2 5-5 2 2 3-2V8z" fill="currentColor" /></svg>} />
                </nav>

                <div className="mt-6 w-full border-t border-orange-600/8 pt-4">
                    <p className="text-sm text-amber-200/60">© 2025 TECH FLUENCE. All Rights Reserved.</p>
                    <p className="text-xs text-amber-100/40 mt-1">Secured & Powered by Advanced Web Security</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterPremium;
