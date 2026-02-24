import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import {
  Leaf,
  Calculator,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Shield,
  Globe,
  Sprout,
  Trophy,
  Recycle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import EcoGlobe from "@/components/EcoGlobe";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/auth";
import { toast } from "sonner";

// Error boundary so a Three.js crash won't blank the whole page
class GlobeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-64 h-64 rounded-full flex items-center justify-center animate-pulse-ring"
          style={{ background: "radial-gradient(circle, #c8e6c9, #a5d6a7)" }}>
          <Leaf className="w-20 h-20 text-green-600 animate-leaf-sway" />
        </div>
      );
    }
    return this.props.children;
  }
}

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-6 text-center fade-in-up">
    <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
    <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
      {icon}
      {label}
    </div>
  </div>
);

const FeatureCard = ({
  icon, title, desc, delay
}: { icon: React.ReactNode; title: string; desc: string; delay: string }) => (
  <div
    className="glass-card rounded-2xl p-8 flex flex-col items-center text-center fade-in-up perspective-tilt"
    style={{ animationDelay: delay }}
  >
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
      style={{ background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", border: "1px solid #a5d6a7" }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-green-900 mb-3">{title}</h3>
    <p className="text-green-700/80 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isLiteMode = localStorage.getItem("haritsetu-lite-mode") === "true";

  const handleProtectedAction = (type: "calculator" | "marketplace") => {
    const user = authService.getCurrentUser();
    if (!user) {
      toast.info("Authentication Required", {
        description: "Please login to access this feature."
      });
      navigate("/login");
      return;
    }

    const destinations: Record<string, string> = {
      farmer: "/farmer",
      business: "/business",
      admin: "/admin"
    };

    const dest = destinations[user.role] || "/login";
    navigate(dest, { state: { activeTab: type } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
          {/* Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #dcedc8 100%)",
            }}
          />
          {/* Decorative blobs */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full -z-10 opacity-40"
            style={{ background: "radial-gradient(circle, #a5d6a7, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full -z-10 opacity-30"
            style={{ background: "radial-gradient(circle, #8bc34a, transparent 70%)" }}
          />

          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
              {/* Text */}
              <div className="flex flex-col justify-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 eco-badge w-fit fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Sustainable Future for India
                </div>

                <h1
                  className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight fade-in-up"
                  style={{ color: "#1b5e20", animationDelay: "0.2s" }}
                >
                  {t("हरितसेतु", "HaritSetu")} <br />
                  <span className="gradient-text">{t("उन्नत कार्बन प्रबंधन", "Advanced Carbon Management")}</span>
                </h1>

                <p
                  className="text-lg text-green-800/80 mb-10 leading-relaxed max-w-xl fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t(
                    "किसानों को टिकाऊ प्रथाओं के लिए सशक्त बनाना और उद्योगों को कार्बन ऑफसेट समाधान प्रदान करना।",
                    "Empowering farmers for sustainable practices and providing carbon offset solutions to industries."
                  )}
                </p>

                <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <Button
                    onClick={() => handleProtectedAction("calculator")}
                    size="lg"
                    className="rounded-xl px-8 bg-green-700 hover:bg-green-800 shadow-lg shadow-green-900/20"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <Calculator className="w-5 h-5" />
                      {t("अभी गणना करें", "Calculate Now")}
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleProtectedAction("marketplace")}
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-8 border-2 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <ShoppingCart className="w-5 h-5" />
                      {t("मार्केटप्लेस", "Marketplace")}
                    </div>
                  </Button>
                </div>

                {/* Stats row */}
                <div
                  className="mt-10 grid grid-cols-3 gap-4 fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  {[
                    { v: "12K+", l: "Farmers" },
                    { v: "₹4.2Cr", l: "Earnings" },
                    { v: "18K", l: "Tonnes CO₂" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="text-2xl font-extrabold" style={{ color: "#2e7d32" }}>{s.v}</div>
                      <div className="text-xs text-green-600 font-medium mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Visual Column */}
              <div className="flex items-center justify-center relative fade-in-up" style={{ animationDelay: "0.5s" }}>
                {!isLiteMode ? (
                  <GlobeErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="w-64 h-64 rounded-full flex items-center justify-center animate-pulse"
                          style={{ background: "radial-gradient(circle, #c8e6c9, #a5d6a7)" }}>
                          <Leaf className="w-20 h-20 text-green-600 opacity-20" />
                        </div>
                      }
                    >
                      <EcoGlobe />
                    </Suspense>
                  </GlobeErrorBoundary>
                ) : (
                  <div className="w-64 h-64 rounded-full flex items-center justify-center animate-pulse"
                    style={{ background: "radial-gradient(circle, #c8e6c9, #a5d6a7)" }}>
                    <Leaf className="w-32 h-32 text-green-600 opacity-40" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Wave divider - Smoother Multi-layer */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
            {/* Layer 1: Foreground */}
            <div className="absolute inset-0 w-[200%] flex animate-wave">
              <div className="w-1/2 h-full opacity-60">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                  <path d="M0 40 C360 80 1080 0 1440 40 V100 H0 Z" />
                </svg>
              </div>
              <div className="w-1/2 h-full opacity-60">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                  <path d="M0 40 C360 80 1080 0 1440 40 V100 H0 Z" />
                </svg>
              </div>
            </div>

            {/* Layer 2: Middle ground */}
            <div className="absolute inset-0 w-[200%] flex animate-wave-reverse opacity-40">
              <div className="w-1/2 h-full">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                  <path d="M0 60 C360 20 1080 100 1440 60 V100 H0 Z" />
                </svg>
              </div>
              <div className="w-1/2 h-full">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full fill-white">
                  <path d="M0 60 C360 20 1080 100 1440 60 V100 H0 Z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-green-900 mb-4">{t("हमारी विशेषताएं", "Our Key Features")}</h2>
              <p className="text-green-700/60 font-medium tracking-wide">
                Bridging the gap between agricultural tradition and digital innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Calculator className="w-8 h-8 text-green-600" />}
                title={t("कार्बन कैलकुलेटर", "Carbon Calculator")}
                desc={t("अपनी कृषि पद्धतियों के कार्बन अवशोषण की सटीकता से गणना करें।", "Accurately calculate the carbon sequestration of your farming practices.")}
                delay="0.1s"
              />
              <FeatureCard
                icon={<Wallet className="w-8 h-8 text-green-600" />}
                title={t("डिजिटल वॉलेट", "Digital Wallet")}
                desc={t("अपने कार्बन क्रेडिट स्टोर करें और सुरक्षित रूप से लेनदेन करें।", "Store your carbon credits and transact securely.")}
                delay="0.2s"
              />
              <FeatureCard
                icon={<ShoppingCart className="w-8 h-8 text-green-600" />}
                title={t("मार्केटप्लेस", "Carbon Marketplace")}
                desc={t("पारदर्शी तरीके से कार्बन क्रेडिट खरीदें और बेचें।", "Buy and sell carbon credits in a transparent marketplace.")}
                delay="0.3s"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-green-600" />}
                title={t("ब्लॉकचेन सुरक्षा", "Blockchain Security")}
                desc={t("पूरी पारदर्शिता के साथ एक सुरक्षित श्रृंखला पर ट्रैक किए गए क्रेडिट।", "Credits tracked on a secure chain with total transparency.")}
                delay="0.4s"
              />
            </div>
          </div>
        </section>

        {/* ── Trust Section ── */}
        <section className="py-20 bg-green-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div className="flex items-center gap-3 text-green-600 font-bold uppercase tracking-widest text-xs">
                  <div className="w-10 h-0.5 bg-green-600" />
                  Verified Impact
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-green-900 leading-[1.1]">
                  Building Trust in <br /> <span className="text-green-600">Green Assets</span>
                </h2>
                <p className="text-lg text-green-800/70 leading-relaxed">
                  HaritSetu uses advanced satellite imagery and blockchain technology to verify every carbon credit generated by Indian farmers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {[
                    { i: <Globe className="w-5 h-5" />, t: "Global Standards", d: "Aligned with international MRV protocols." },
                    { i: <TrendingUp className="w-5 h-5" />, t: "Market Growth", d: "Growing carbon economy in rural India." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        {item.i}
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900">{item.t}</h4>
                        <p className="text-xs text-green-700/60 mt-1">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="link" className="text-green-700 font-bold p-0 flex items-center gap-2 group">
                  Learn about our verification method
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="aspect-square rounded-[40px] bg-green-200 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop"
                        alt="Lush green field"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 bg-green-800 rounded-[40px] text-white shadow-xl -rotate-2 hover:rotate-0 transition-transform duration-500">
                      <div className="text-4xl font-black mb-2">98%</div>
                      <div className="text-xs font-bold opacity-60 uppercase tracking-widest leading-tight">Verification Accuracy via Satellite</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-8 bg-white rounded-[40px] border border-green-100 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="text-xl font-bold text-green-900 mb-1">Double-Spend Prevention</div>
                      <div className="text-xs text-green-700/60 leading-relaxed">Secured by immutable blockchain ledger.</div>
                    </div>
                    <div className="aspect-[4/5] rounded-[40px] bg-green-100 overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img
                        src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1000&auto=format&fit=crop"
                        alt="Farmer in India"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-600/5 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission (Merged from About) ── */}
        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="fade-in-up">
                <span className="eco-badge text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold">Our Purpose</span>
                <h2 className="text-4xl md:text-5xl font-black mt-6 mb-8 text-green-900 leading-tight">
                  {t("हमारा मिशन", "Our Mission")}
                </h2>
                <div className="space-y-6 text-lg text-green-700/80 leading-relaxed">
                  <p>
                    {t(
                      "हरितसेतु किसानों को अपनी टिकाऊ प्रथाओं को मुद्रीकृत करने के लिए सशक्त बनाने के साथ-साथ व्यवसायों को उनके पर्यावरणीय लक्ष्यों को पूरा करने में मदद करने के लिए समर्पित है।",
                      "HaritSetu is dedicated to empowering farmers to monetize their sustainable practices while helping businesses meet their environmental goals."
                    )}
                  </p>
                  <p>
                    {t(
                      "हमारा प्लेटफ़ॉर्म कृषि कार्बन अवशोषण और व्यवसायों के बीच अंतर को पाटता है।",
                      "Our platform bridges the gap between agricultural carbon sequestration and businesses seeking to offset their carbon footprint, creating a win-win ecosystem for people and the planet."
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-[3rem] p-10 border border-green-100 shadow-2xl shadow-green-900/5 fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="space-y-8">
                  {[
                    {
                      icon: <Globe className="h-6 w-6 text-green-600" />,
                      title: t("पर्यावरणीय प्रभाव", "Environmental Impact"),
                      desc: t(
                        "हमने किसानों को 50,000 से अधिक मीट्रिक टन CO₂ को अवशोषित करने में मदद की है।",
                        "We've helped farmers sequester over 50,000 metric tons of CO₂ through sustainable practices."
                      ),
                    },
                    {
                      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
                      title: t("आर्थिक अवसर", "Economic Opportunity"),
                      desc: t(
                        "हमारे प्लेटफॉर्म ने 1.2 मिलियन डॉलर से अधिक का अतिरिक्त राजस्व उत्पन्न किया है।",
                        "Our platform has generated over $1.2 million in additional revenue for sustainable farmers."
                      ),
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-green-50 text-green-600">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-green-900">{item.title}</h3>
                        <p className="text-green-700/60 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How Credits Work (Merged from About) ── */}
        <section className="py-24 bg-green-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="eco-badge text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold">Process</span>
              <h2 className="text-4xl md:text-5xl font-black mt-6 text-green-900">
                {t("कार्बन क्रेडिट कैसे काम करते हैं", "How Carbon Credits Work")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: 1,
                  icon: <Leaf className="h-6 w-6" />,
                  title: t("कार्बन अवशोषण", "Carbon Sequestration"),
                  desc: t(
                    "किसान टिकाऊ प्रथाओं को लागू करते हैं जो वातावरण से कार्बन को पकड़ते हैं।",
                    "Farmers implement sustainable practices like cover crops and reduced tillage that capture carbon."
                  ),
                },
                {
                  step: 2,
                  icon: <Calculator className="h-6 w-6" />,
                  title: t("सत्यापन और गणना", "Verification & Calculation"),
                  desc: t(
                    "अवशोषित कार्बन की मात्रा को वैज्ञानिक पद्धतियों का उपयोग करके मापा और सत्यापित किया जाता है।",
                    "Amount sequestered is measured based on international standard methodologies."
                  ),
                },
                {
                  step: 3,
                  icon: <ShoppingCart className="h-6 w-6" />,
                  title: t("मार्केटप्लेस ट्रेडिंग", "Marketplace Trading"),
                  desc: t(
                    "इन कार्बन क्रेडिट्स को उन व्यवसायों को बेचा जा सकता है जो अपने उत्सर्जन को ऑफसेट करना चाहते हैं।",
                    "Credits are sold to businesses seeking to offset footprint, funding green practices."
                  ),
                },
                {
                  step: 4,
                  icon: <Trophy className="h-6 w-6" />,
                  title: t("पर्यावरणीय सुधार", "Environmental Impact"),
                  desc: t(
                    "परिणामस्वरूप वातावरण में ग्रीनहाउस गैसों में कमी और किसानों के लिए नए राजस्व स्रोत हैं।",
                    "Resulting in reduced GHGs and new income for rural Indian communities."
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-3xl p-8 flex items-start gap-6 border border-green-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-green-900">{item.title}</h3>
                    <p className="text-green-700/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Call to Action ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-900 -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-800 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full blur-3xl -z-10 opacity-30 -translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <Sprout className="w-16 h-16 text-green-400 mx-auto animate-bounce-slow" />
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Ready to Join the <br /> <span className="text-green-400">Green Revolution?</span>
              </h2>
              <p className="text-lg text-green-100/60 font-medium">
                Whether you're a farmer looking to earn or a business aiming for net zero,
                HaritSetu is your gateway to the future.
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <Button asChild size="lg" className="bg-green-500 hover:bg-green-400 text-green-950 font-black px-10 rounded-2xl h-16 shadow-2xl shadow-green-500/20">
                  <Link to="/login" className="flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white/20 text-white hover:bg-white/10 font-bold px-10 rounded-2xl h-16 backdrop-blur-sm">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Impact Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4 px-4 py-1 rounded-full text-sm font-bold">REAL-TIME IMPACT</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-green-900 mb-6 leading-tight">
              Healing the Earth, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">One Credit at a Time</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ImpactMetric value="1.2M+" label="Metric Tons CO2 Offset" sub="Verified by Blockchain" />
            <ImpactMetric value="45K+" label="Active Farmers" sub="Empowered Rural Communities" />
            <ImpactMetric value="₹85Cr+" label="Total Payouts" sub="Sustainable Income Generated" />
            <ImpactMetric value="220" label="Partner Companies" sub="Driving Corporate ESG" />
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 bg-green-900 text-white rounded-[3rem] mx-4 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Our Green Journey</h2>
            <p className="text-green-100/60 max-w-2xl mx-auto">Scaling verified carbon credits to every corner of India by 2027.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <RoadmapItem
              year="2024"
              title="State Expansion"
              desc="Onboarding 50,000 farmers across Maharashtra and Punjab with local government support."
            />
            <RoadmapItem
              year="2025"
              title="AI Soil Analysis"
              desc="Integrating satellite imagery and AI to predict carbon sequestration with 99% accuracy."
              active
            />
            <RoadmapItem
              year="2026"
              title="Global Exchange"
              desc="Launching the world's first decentralized exchange for retail verified agricultural credits."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm transition-transform hover:scale-110">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-green-900 tracking-tighter">HaritSetu</span>
            </div>

            <div className="flex gap-10 text-sm font-bold text-green-800/60 uppercase tracking-widest text-center md:text-left flex-wrap justify-center">
              <a href="#about" className="hover:text-green-600 transition-colors">Vision</a>
              <button onClick={() => handleProtectedAction("calculator")} className="hover:text-green-600 transition-colors">Calculator</button>
              <button onClick={() => handleProtectedAction("marketplace")} className="hover:text-green-600 transition-colors">Market</button>
              <Link to="/login" className="hover:text-green-600 transition-colors">Portal</Link>
            </div>

            <p className="text-xs text-green-700/40 font-bold">
              © 2026 HaritSetu • Empowering Rural India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ImpactMetric({ value, label, sub }: { value: string, label: string, sub: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-xl shadow-green-900/5 text-center transform hover:-translate-y-2 transition-all duration-300">
      <h3 className="text-5xl font-black text-green-600 mb-2">{value}</h3>
      <p className="font-bold text-green-900 text-lg mb-1">{label}</p>
      <p className="text-xs text-green-600/60 font-semibold uppercase tracking-wider">{sub}</p>
    </div>
  );
}

function RoadmapItem({ year, title, desc, active = false }: { year: string, title: string, desc: string, active?: boolean }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border ${active ? "bg-white/10 border-white/20" : "bg-transparent border-white/5"} relative`}>
      {active && <div className="absolute top-4 right-8 px-3 py-1 bg-green-500 rounded-full text-[10px] font-bold">CURRENT PHASE</div>}
      <span className="text-6xl font-black opacity-10 absolute -top-4 left-4">{year}</span>
      <h4 className="text-2xl font-bold mb-4 relative z-10">{title}</h4>
      <p className="text-green-100/60 leading-relaxed text-sm relative z-10">{desc}</p>
    </div>
  );
}
