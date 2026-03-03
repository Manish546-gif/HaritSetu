import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Twitter, Github, Linkedin, Mail, ArrowUpRight, ShieldCheck, Globe, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export const Footer = () => {
    const { t } = useLanguage();

    const footerLinks = {
        platform: [
            { name: "How it Works", path: "/#how-it-works" },
            { name: "E-Calculators", path: "/#calculator" },
            { name: "Marketplace", path: "/#marketplace" },
            { name: "Farmer Portal", path: "/farmer" },
        ],
        resources: [
            { name: "About Us", path: "/about" },
            { name: "Documentation", path: "/docs" },
            { name: "Support", path: "/contact" },
            { name: "Privacy Policy", path: "/privacy" },
        ],
        company: [
            { name: "Impact", path: "/impact" },
            { name: "Partners", path: "/partners" },
            { name: "Careers", path: "/careers" },
            { name: "Contact", path: "/contact" },
        ],
    };

    const socialLinks = [
        { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter" },
        { icon: <Github className="w-5 h-5" />, href: "#", name: "GitHub" },
        { icon: <Linkedin className="w-5 h-5" />, href: "#", name: "LinkedIn" },
        { icon: <Mail className="w-5 h-5" />, href: "mailto:contact@haritsetu.org", name: "Email" },
    ];

    return (
        <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-green-50">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-300">
                                <Leaf className="w-7 h-7" />
                            </div>
                            <span className="text-3xl font-black text-green-900 tracking-tighter">
                                Harit<span className="text-green-600 italic">Setu</span>
                            </span>
                        </Link>

                        <p className="text-green-800/60 leading-relaxed max-w-sm font-medium">
                            Empowering rural ecosystems through decentralized carbon verification and sustainable agriculture financing.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-6 gap-8">
                        <div className="space-y-6">
                            <h4 className="text-green-900 font-black uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-4">
                                {footerLinks.platform.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-green-800/60 hover:text-green-600 font-bold text-sm transition-colors flex items-center group">
                                            {link.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-green-900 font-black uppercase tracking-widest text-xs">Resources</h4>
                            <ul className="space-y-4">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-green-800/60 hover:text-green-600 font-bold text-sm transition-colors flex items-center group">
                                            {link.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-green-900 font-black uppercase tracking-widest text-xs">Company</h4>
                            <ul className="space-y-4">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-green-800/60 hover:text-green-600 font-bold text-sm transition-colors flex items-center group">
                                            {link.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all ml-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-green-900 font-black uppercase tracking-widest text-xs">Verified By</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-black text-green-900">Sovereign Audit</span>
                            </div>
                            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-center gap-3">
                                <Globe className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-black text-green-900">Global Standard</span>
                            </div>
                            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-center gap-3">
                                <Star className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-black text-green-900">ISO 14064-2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-green-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-green-800/40">
                        <span>© 2026 HaritSetu</span>
                        <span className="hidden md:inline">•</span>
                        <span>Rural Empowerment Protocol</span>
                        <span className="hidden md:inline">•</span>
                        <span>Decentralized & Verified</span>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest text-green-800/40 hover:text-green-600">
                            Terms
                        </Button>
                        <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest text-green-800/40 hover:text-green-600">
                            Privacy
                        </Button>
                        <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest text-green-800/40 hover:text-green-600">
                            Cookies
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
