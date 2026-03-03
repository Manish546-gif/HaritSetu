import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    BookOpen,
    ChevronRight,
    Search,
    Terminal,
    ShieldCheck,
    Zap,
    Globe,
    Sprout,
    Wallet,
    Info,
    CheckCircle2,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sections = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        content: (
            <div className="space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed">
                    HaritSetu is a decentralized protocol for carbon management. It bridges the gap between rural agricultural stewardship and industrial environmental responsibility.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-2">For Farmers</h4>
                        <p className="text-sm text-slate-600">Register your fields, implement sustainable practices, and mint verified carbon credits.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-2">For Businesses</h4>
                        <p className="text-sm text-slate-600">Purchase high-quality offsets to meet ESG goals and fund rural ecosystem growth.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "valuation",
        title: "Credit Valuation",
        icon: <Wallet className="w-5 h-5 text-green-500" />,
        content: (
            <div className="space-y-6">
                <div className="p-8 bg-green-50 rounded-[2rem] border border-green-100">
                    <h4 className="text-2xl font-black text-green-900 mb-4">1 Credit = 1 Tonne CO₂e</h4>
                    <p className="text-green-800/70 font-medium">
                        Unlike traditional micro-credit systems, HaritSetu standardizes at a high-volume unit. This allows for sovereign-scale enterprise participation with clear, audit-ready metrics.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Current Market Baseline</h4>
                    <p className="text-slate-600">The baseline trading price is stabilized between ₹1,300 and ₹1,500 per credit to ensure fair compensation for farmers.</p>
                </div>
            </div>
        )
    },
    {
        id: "verification",
        title: "Verification Protocol",
        icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
        content: (
            <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed">
                    Our MRV (Measuring, Reporting, and Verification) system uses a multi-layered approach to ensure credit permanence and zero-leakage.
                </p>
                <div className="space-y-4">
                    <div className="flex gap-4 p-4 border-l-4 border-blue-500 bg-blue-50/50">
                        <div className="font-black text-blue-600">01</div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm italic">Satellite Imagery</h5>
                            <p className="text-xs text-slate-600">Multi-spectral analysis to verify crop growth and health.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 border-l-4 border-blue-500 bg-blue-50/50">
                        <div className="font-black text-blue-600">02</div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm italic">On-Ground IoT</h5>
                            <p className="text-xs text-slate-600">Soil sensors and verified photo uploads for local truth.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 border-l-4 border-blue-500 bg-blue-50/50">
                        <div className="font-black text-blue-600">03</div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm italic">AI Sequestration Model</h5>
                            <p className="text-xs text-slate-600">Calculating precise absorption based on crop lifecycle.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "farmer-onboarding",
        title: "Farmer Onboarding",
        icon: <Sprout className="w-5 h-5 text-emerald-500" />,
        content: (
            <div className="space-y-6">
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><span className="font-bold text-slate-900">Step 1: Account Creation.</span> Register with KCC (Kisan Credit Card) or basic identification.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><span className="font-bold text-slate-900">Step 2: Field Registration.</span> Digitally map your land using our GPS boundary tool.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><span className="font-bold text-slate-900">Step 3: Monitoring.</span> Our system audits the field during the growth cycle.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600"><span className="font-bold text-slate-900">Step 4: Minting.</span> Receive credits in your wallet upon verification.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "marketplace",
        title: "Marketplace Mechanics",
        icon: <Globe className="w-5 h-5 text-indigo-500" />,
        content: (
            <div className="space-y-6">
                <p className="text-slate-600">
                    The marketplace facilitates direct-to-farmer transactions, removing middlemen and ensuring 95% of value reaches the rural ecosystem.
                </p>
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black">2.5%</div>
                    <p className="text-sm font-medium text-indigo-900 italic">Platform fee strictly limited to maintain network infrastructure.</p>
                </div>
            </div>
        )
    }
];

export default function Docs() {
    const [activeSection, setActiveSection] = useState("getting-started");

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="container mx-auto px-4 py-32">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Documentation</h3>
                                <nav className="space-y-1">
                                    {sections.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                setActiveSection(s.id);
                                                window.scrollTo({ top: 120, behavior: "smooth" });
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === s.id
                                                    ? "bg-green-50 text-green-700 shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {s.icon}
                                                {s.title}
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                                <div className="p-3 bg-white/10 rounded-2xl w-fit">
                                    <Terminal className="w-6 h-6 text-green-400" />
                                </div>
                                <h4 className="font-bold">Need Developer API?</h4>
                                <p className="text-xs text-white/60 leading-relaxed">Access our on-chain data through our upcoming REST API and SDKs.</p>
                                <Button className="w-full bg-green-600 hover:bg-green-700 h-10 rounded-xl text-xs font-black uppercase tracking-widest">Join Beta</Button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 max-w-4xl">
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Docs</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-green-600">{sections.find(s => s.id === activeSection)?.title}</span>
                            </div>

                            {/* Section Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                        {sections.find(s => s.id === activeSection)?.icon}
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase tracking-widest text-[10px] font-black px-3 py-1 rounded-full">Official Protocol v1.4</Badge>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                                    {sections.find(s => s.id === activeSection)?.title}
                                </h2>
                            </div>

                            {/* Main Content */}
                            <div className="prose prose-slate max-w-none">
                                {sections.find(s => s.id === activeSection)?.content}
                            </div>

                            {/* Help Section */}
                            <div className="pt-20 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4 items-start group">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-green-600 transition-colors">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Found an error?</h4>
                                        <p className="text-sm text-slate-600 mb-2">Help us improve by reporting bugs in our documentation.</p>
                                        <button className="text-green-600 text-xs font-black uppercase tracking-widest hover:underline">Report Feedback</button>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start group">
                                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-green-600 transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Technical Audit</h4>
                                        <p className="text-sm text-slate-600 mb-2">Read our full technical ISO compliance audit report.</p>
                                        <button className="text-green-600 text-xs font-black uppercase tracking-widest hover:underline">View Report</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
