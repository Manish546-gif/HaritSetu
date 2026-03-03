import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import {
    Globe,
    Sprout,
    TrendingUp,
    ArrowRight,
    ShieldCheck,
    Building2,
    Factory,
    Mountain,
    AlertCircle
} from "lucide-react";

export default function About() {
    const BASE_PRICE = 1400;
    const industrialData = [
        { sector: "Coal-based Power Generation", activities: "Thermal power plants", annual: "1,000–1,200", monthly: "83–100", percentage: "38%" },
        { sector: "Steel Industry", activities: "Blast furnaces, rolling mills", annual: "250–300", monthly: "21–25", percentage: "18%" },
        { sector: "Cement Industry", activities: "Clinker production, grinding", annual: "200–230", monthly: "17–19", percentage: "14%" },
        { sector: "Chemical Industry", activities: "Fertilizers, plastics, chemicals", annual: "80–100", monthly: "7–8", percentage: "8%" },
        { sector: "Oil & Gas Refining", activities: "Refineries, petrochemicals", annual: "70–90", monthly: "6–8", percentage: "7%" },
        { sector: "Mining Industry", activities: "Coal, iron ore extraction", annual: "40–50", monthly: "3–4", percentage: "4%" },
        { sector: "Textile Industry", activities: "Dyeing, processing, spinning", annual: "25–30", monthly: "2–2.5", percentage: "3%" },
        { sector: "Food Processing", activities: "Packaging, cold storage", annual: "15–25", monthly: "1–2", percentage: "2.5%" },
        { sector: "Aluminium Industry", activities: "Smelting, processing", annual: "15–20", monthly: "1–1.7", percentage: "1.5%" },
        { sector: "Automobile Mfg", activities: "Vehicle assembly plants", annual: "10–15", monthly: "0.8–1.2", percentage: "1%" },
        { sector: "IT & Service Sector", activities: "Offices, data centers", annual: "8–12", monthly: "0.6–1", percentage: "0.8%" },
    ];

    const agriculturalData = [
        { crop: "Rice (Paddy)", duration: "110–150 days", hectare: "~3.5 – 5", acre: "~1.4 – 2", ecoValue: "High Biomass Sink" },
        { crop: "Wheat", duration: "120–140 days", hectare: "~2.5 – 3.5", acre: "~1 – 1.4", ecoValue: "Major Rabi Sink" },
        { crop: "Maize (Corn)", duration: "90–120 days", hectare: "~3 – 4", acre: "~1.2 – 1.6", ecoValue: "Fast Photo-Synthesis" },
        { crop: "Sugarcane", duration: "10–14 months", hectare: "~12 – 18", acre: "~5 – 7", ecoValue: "Highest Efficiency" },
        { crop: "Cotton", duration: "150–180 days", hectare: "~3 – 5", acre: "~1.2 – 2", ecoValue: "Long Duration Sink" },
        { crop: "Soybean", duration: "90–110 days", hectare: "~2 – 3", acre: "~0.8 – 1.2", ecoValue: "Soil Carbon Booster" },
        { crop: "Mustard", duration: "110–130 days", hectare: "~1.5 – 2.5", acre: "~0.6 – 1", ecoValue: "Moderate Biomass" },
        { crop: "Potato", duration: "90–110 days", hectare: "~2 – 3", acre: "~0.8 – 1.2", ecoValue: "Short Lifecycle" },
        { crop: "Vegetables (Mixed)", duration: "60–90 days", hectare: "~1 – 2", acre: "~0.4 – 0.8", ecoValue: "Density Based" },
        { crop: "Millets", duration: "80–100 days", hectare: "~2 – 3", acre: "~0.8 – 1.2", ecoValue: "Climate Resilient" },
        { crop: "Agroforestry Crops", duration: "Multi-year", hectare: "~8 – 25 / yr", acre: "~3 – 10 / yr", ecoValue: "High Permanence" },
    ];

    return (
        <div className="min-h-screen bg-[#fafdfa]">
            <Header />

            <main className="container mx-auto px-4 py-20">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mx-auto mb-20 space-y-8">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-6 py-1.5 rounded-full text-sm font-black tracking-widest uppercase">
                        Platform Economics 2026
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-green-950 leading-[0.9] tracking-tighter">
                        The High-Value <br /> <span className="text-green-600">Carbon Standard</span>
                    </h1>
                    <p className="text-xl text-green-800/70 font-medium leading-relaxed">
                        HaritSetu is the world's first platform to move beyond micro-credits.
                        We facilitate industrial-scale ecological transformation by redefining the
                        base unit of green finance.
                    </p>
                </section>

                {/* Valuation Box */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <div className="bg-green-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                            <Mountain className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-green-400 mb-6">Standard Unit</h3>
                        <div className="text-6xl font-black mb-4">1 Credit</div>
                        <div className="text-2xl font-bold text-green-100 mb-8">= 1 Tonne CO₂e</div>
                        <p className="text-green-100/60 leading-relaxed font-medium">
                            By standardizing at a high-volume unit, we allow sovereign-scale enterprises
                            and global conglomerates to offset entire production cycles with clarity and ease.
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border-2 border-green-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-green-600 group-hover:-rotate-12 transition-transform duration-500">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-green-600 mb-6">Market Value</h3>
                        <div className="text-6xl font-black text-green-950 mb-4 tracking-tighter">₹1400+</div>
                        <div className="text-2xl font-bold text-green-700/60 mb-8">Baseline Trading Price</div>
                        <p className="text-green-800/60 leading-relaxed font-medium">
                            Every credit represents a significant capital injection into rural ecosystems.
                            Our pricing model ensures that regenerative farming is more profitable than
                            extractive agricultural methods.
                        </p>
                    </div>
                </section>

                {/* Industrial Table */}
                <section className="mb-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-green-950 flex items-center gap-4">
                                <Factory className="text-green-600" />
                                Industrial Emission Profiles
                            </h2>
                            <p className="text-green-700/60 font-bold mt-1 text-sm tracking-wide">STATE OF THE INDIAN ECONOMY (ANNUAL)</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-green-50 shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-green-50 text-green-900">
                                <tr>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Sector / Category</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Example Activities</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Annual (MtCO₂e)</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Monthly Avg</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Impact Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                                {industrialData.map((row, i) => (
                                    <tr key={i} className="hover:bg-green-50/50 transition-colors">
                                        <td className="px-8 py-6 font-bold text-green-950">{row.sector}</td>
                                        <td className="px-8 py-6 text-sm font-medium text-green-800/70">{row.activities}</td>
                                        <td className="px-8 py-6 font-black text-green-700">{row.annual}</td>
                                        <td className="px-8 py-6 font-bold text-green-600">{row.monthly}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500" style={{ width: row.percentage }} />
                                                </div>
                                                <span className="text-sm font-black text-green-900">{row.percentage}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Agricultural Table */}
                <section className="mb-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-green-950 flex items-center gap-4">
                                <Sprout className="text-green-600" />
                                Sequestration Potential
                            </h2>
                            <p className="text-green-700/60 font-bold mt-1 text-sm tracking-wide">REGENERATIVE CAPACITY BY CROP TYPE</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-green-50 shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-[#f0f9f0] text-green-900">
                                <tr>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Crop / Ecosystem</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Average Duration</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">C-Absorbed / Ha</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">C-Absorbed / Acre</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Eco-Logic</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                                {agriculturalData.map((row, i) => (
                                    <tr key={i} className="hover:bg-green-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-green-950">{row.crop}</div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-green-700/70">{row.duration}</td>
                                        <td className="px-8 py-6 font-black text-emerald-600">{row.hectare} t</td>
                                        <td className="px-8 py-6 font-bold text-green-700/80">{row.acre} t</td>
                                        <td className="px-8 py-6">
                                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-1 rounded-xl whitespace-nowrap">
                                                {row.ecoValue}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="bg-green-100 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-dot-pattern opacity-10" />
                    <AlertCircle className="w-16 h-16 text-green-600 mx-auto" />
                    <h2 className="text-4xl font-black text-green-950 relative z-10">Verification Protocol</h2>
                    <p className="max-w-2xl mx-auto text-lg text-green-800/70 font-medium relative z-10">
                        Every credit is verified using multi-spectral satellite imagery and verified on the MRV
                        (Measuring, Reporting, and Verification) blockchain ledger. We ensure 100% permanence
                        and zero-leakage in our carbon pools.
                    </p>
                    <div className="pt-4">
                        <button className="bg-green-900 text-white font-black px-12 py-5 rounded-2xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl shadow-green-900/40 opacity-90 group">
                            View Governance Ledger
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
