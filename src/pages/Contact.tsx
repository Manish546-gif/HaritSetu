import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    ArrowRight,
    Github,
    Twitter,
    Linkedin,
    Globe,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            toast.success("Message sent successfully!", {
                description: "Our protocol officers will contact you shortly."
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-6 py-1.5 rounded-full text-sm font-black tracking-widest uppercase">
                            Connect with Protocol
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                            Let's Build the <br /> <span className="text-green-600">Green Future</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Have questions about carbon minting, industrial compliance, or rural partnerships? Our global desk is here to assist.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Contact Information */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-10">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                                    Global Headquarters
                                </h3>

                                <div className="space-y-8">
                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 group-hover:border-green-100 transition-all duration-300">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Location</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                Green Innovation Hub, 42nd Floor<br />
                                                Cyber City, Gurgaon, Haryana<br />
                                                India - 122002
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 group-hover:border-green-100 transition-all duration-300">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Protocol Email</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                support@haritsetu.org<br />
                                                compliance@haritsetu.org
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 group-hover:border-green-100 transition-all duration-300">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-2">Direct Desk</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                +91 1800-HARIT-SETU (Toll Free)<br />
                                                +91 124 5550 2026 (Global)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence */}
                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                    <Globe className="w-32 h-32" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-green-400 mb-6">Social Nodes</h4>
                                <div className="flex gap-4 relative z-10">
                                    <Button size="icon" className="bg-white/10 hover:bg-green-600 w-12 h-12 rounded-2xl transition-all"><Twitter className="w-5 h-5" /></Button>
                                    <Button size="icon" className="bg-white/10 hover:bg-green-600 w-12 h-12 rounded-2xl transition-all"><Github className="w-5 h-5" /></Button>
                                    <Button size="icon" className="bg-white/10 hover:bg-green-600 w-12 h-12 rounded-2xl transition-all"><Linkedin className="w-5 h-5" /></Button>
                                    <Button size="icon" className="bg-white/10 hover:bg-green-600 w-12 h-12 rounded-2xl transition-all"><MessageSquare className="w-5 h-5" /></Button>
                                </div>
                                <p className="text-white/40 text-xs font-medium max-w-xs leading-relaxed">Follow our network status and real-time minting updates on our official social channels.</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-[4rem] p-10 md:p-16 border-2 border-slate-50 shadow-2xl shadow-green-900/5 relative overflow-hidden">
                                {submitted ? (
                                    <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-4">Transmission Successful</h2>
                                        <p className="text-slate-500 font-medium mb-8">Ref ID: #HS-{Math.floor(Math.random() * 90000) + 10000}</p>
                                        <Button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-green-600 hover:bg-green-700 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-xs"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                <input required type="text" placeholder="Janus Henderson" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</label>
                                                <input required type="email" placeholder="janus@esg-corp.com" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                                <select className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all appearance-none cursor-pointer">
                                                    <option>Investor Relations</option>
                                                    <option>Farmer Partnerships</option>
                                                    <option>Technical Support</option>
                                                    <option>Industrial Compliance</option>
                                                    <option>Media Inquiry</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
                                                <input required type="text" placeholder="India" className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Protocol</label>
                                            <textarea required rows={6} placeholder="Detailed inquiry regarding ESG credit integration..." className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all resize-none" />
                                        </div>

                                        <Button
                                            disabled={isSubmitting}
                                            className="w-full bg-green-700 hover:bg-green-800 h-20 rounded-[2rem] text-white font-black text-lg transition-all group flex gap-4"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Transmitting...
                                                </span>
                                            ) : (
                                                <>
                                                    Transmit Secure Message
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
