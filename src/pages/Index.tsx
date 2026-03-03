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
import { Footer } from "@/components/Footer";

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


const CreditFlow = ({ t }: { t: any }) => (
  <section className="py-24 relative bg-dot-pattern text-green-900/10">
    <div className="container mx-auto px-4 relative z-10 text-foreground">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <Badge className="bg-green-100 text-green-700 mb-4 px-4 py-1 rounded-full text-sm font-bold">THE ECOSYSTEM</Badge>
        <h2 className="text-4xl md:text-5xl font-black text-green-900 leading-tight">
          A Digital Currency for the <br /> <span className="text-green-600">Green Revolution</span>
        </h2>
        <p className="text-green-800/60 mt-4 text-lg">
          Bridging the gap between agricultural stewardship and industrial responsibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Field Side */}
        <div className="group relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative glass-card rounded-[3rem] overflow-hidden border-green-100/50">
            <div className="aspect-[16/10] overflow-hidden">
              <img src="/farm-field.png" alt="Lush Indian Farm" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-transparent" />
            </div>
            <div className="p-8 absolute bottom-0 left-0 right-0 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Sprout className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-black">{t("किसान पक्ष", "The Farmer")}</h3>
              </div>
              <p className="text-green-50/80 text-sm leading-relaxed">
                Farmers implement regenerative practices that sequester CO₂. Every 1 Tonne of carbon pulled from the atmosphere is minted as 1 Digital Carbon Credit.
              </p>
            </div>
          </div>
        </div>

        {/* Action / Arrow */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-green-50 animate-pulse-soft">
            <ArrowRight className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Factory Side */}
        <div className="group relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative glass-card rounded-[3rem] overflow-hidden border-green-100/50">
            <div className="aspect-[16/10] overflow-hidden">
              <img src="/factory.png" alt="Eco Industrial" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
            </div>
            <div className="p-8 absolute bottom-0 left-0 right-0 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-black">{t("उद्योग पक्ष", "The Industry")}</h3>
              </div>
              <p className="text-emerald-50/80 text-sm leading-relaxed">
                Enterprises purchase these credits to offset their unavoidable emissions, channeling financial support directly back to the rural guardians of our soil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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
  const [farmerCount, setFarmerCount] = React.useState(0);

  React.useEffect(() => {
    const users = authService.getUsers();
    setFarmerCount(users.filter(u => u.role === "farmer").length);
  }, []);

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
          {/* Decorative shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/40 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-float" />

          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
              {/* Text */}
              <div className="flex flex-col justify-center relative z-10">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 eco-badge w-fit fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  India's Premier Carbon Ledger
                </div>

                <h1
                  className="text-5xl md:text-8xl font-black mb-6 tracking-tighter fade-in-up leading-[0.9]"
                  style={{ color: "#1b5e20", animationDelay: "0.2s" }}
                >
                  {t("हरितसेतु", "HaritSetu")} <br />
                  <span className="gradient-text">{t("उन्नत कार्बन प्रबंधन", "Future of Green Finance")}</span>
                </h1>

                <p
                  className="text-xl text-green-800/70 mb-10 leading-relaxed max-w-xl fade-in-up font-medium"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t(
                    "किसानों को टिकाऊ प्रथाओं के लिए सशक्त बनाना और उद्योगों को कार्बन ऑफसेट समाधान प्रदान करना।",
                    "Turning agricultural stewardship into a valuable digital currency. Join the world's most transparent carbon credit marketplace."
                  )}
                </p>

                <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: "0.4s" }}>
                  <Button
                    onClick={() => handleProtectedAction("calculator")}
                    size="lg"
                    className="rounded-2xl px-10 h-16 bg-green-700 hover:bg-green-800 shadow-2xl shadow-green-900/20 group"
                  >
                    <div className="flex items-center gap-3 font-bold text-lg">
                      <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      {t("अभी गणना करें", "Start Calculating")}
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleProtectedAction("marketplace")}
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-10 h-16 border-2 border-green-200 text-green-700 hover:bg-green-50 shadow-xl"
                  >
                    <div className="flex items-center gap-3 font-bold text-lg">
                      <ShoppingCart className="w-6 h-6 font-bold" />
                      {t("मार्केटप्लेस", "Browse Market")}
                    </div>
                  </Button>
                </div>

                {/* Live Data Mini Section */}
                <div className="mt-12 flex items-center gap-8 fade-in-up" style={{ animationDelay: "0.6s" }}>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-green-600 flex items-center justify-center text-[10px] text-white font-bold">
                      {farmerCount > 0 ? `+${farmerCount}` : "0"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-green-900">Live Active Farmers</p>
                    <p className="text-xs text-green-600/60 font-bold">Empowering rural communities</p>
                  </div>
                </div>
              </div>

              {/* 3D Visual Column */}
              <div className="flex items-center justify-center relative fade-in-up" style={{ animationDelay: "0.5s" }}>
                <div className="absolute inset-0 bg-green-400/20 blur-[120px] rounded-full animate-breathing" />
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

          {/* Live Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
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
          </div>
        </section>

        {/* ── Credit Flow Visual ── */}
        <CreditFlow t={t} />

        {/* ── Carbon Credit Education Section ── */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
                <div className="relative space-y-4">
                  {[
                    { q: "What is 1 Carbon Credit?", a: "It is a certificate representing the reduction or removal of one metric tonne of carbon dioxide (CO₂) from the atmosphere.", icon: <Shield className="w-5 h-5" /> },
                    { q: "How Farmers Earn?", a: "By using 'Regenerative Agriculture' which fixes carbon into the soil instead of releasing it into the air.", icon: <Sprout className="w-5 h-5" /> },
                    { q: "The Currency Aspect", a: "Credits can be traded like currency. Businesses buy them to achieve 'Net Zero' goals, funding the farmer's transition.", icon: <Wallet className="w-5 h-5" /> }
                  ].map((item, i) => (
                    <div key={i} className="p-8 glass-card rounded-[2rem] border-green-50 shadow-xl hover:-translate-y-1 transition-all">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-green-100 rounded-xl text-green-600">{item.icon}</div>
                        <h4 className="font-black text-green-900 text-lg">{item.q}</h4>
                      </div>
                      <p className="text-green-800/60 text-sm leading-relaxed font-medium">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-8">
                <Badge className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">LEARN & GROW</Badge>
                <h2 className="text-4xl md:text-6xl font-black text-green-900 leading-[0.9]">
                  Demystifying the <br /> <span className="text-green-600">Green Ledger</span>
                </h2>
                <p className="text-lg text-green-800/70 leading-relaxed font-medium">
                  Carbon credits aren't just certificates; they are the financial oxygen for a cleaner planet. By giving carbon a price, we create an incentive to save Earth's atmosphere.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
                    <div className="text-3xl font-black text-green-900">1 CR</div>
                    <div className="text-[10px] uppercase font-bold text-green-600 tracking-widest mt-1">Equals</div>
                    <div className="text-sm font-bold text-green-800/60 mt-1">1 Tonne CO₂</div>
                  </div>
                  <div className="w-px h-16 bg-green-200" />
                  <p className="text-sm font-bold text-green-900 leading-snug">
                    "A win-win ecosystem where environmental <br className="hidden sm:block" /> health translates to rural wealth."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 bg-green-50/30 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-green-900 mb-4">{t("हमारी विशेषताएं", "Cutting Edge Features")}</h2>
              <p className="text-green-700/60 font-bold tracking-wide flex items-center justify-center gap-2">
                <div className="w-8 h-0.5 bg-green-200" />
                TECHNOLOGY FOR PLANET
                <div className="w-8 h-0.5 bg-green-200" />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Calculator className="w-8 h-8 text-green-600" />}
                title={t("कार्बन कैलकुलेटर", "Dynamic Calculator")}
                desc={t("अपनी कृषि पद्धतियों के कार्बन अवशोषण की सटीकता से गणना करें।", "Proprietary algorithms verified by MRV protocols for zero-leakage counts.")}
                delay="0.1s"
              />
              <FeatureCard
                icon={<Wallet className="w-8 h-8 text-green-600" />}
                title={t("डिजिटल वॉलेट", "Secure Ledger")}
                desc={t("अपने कार्बन क्रेडिट स्टोर करें और सुरक्षित रूप से लेनदेन करें।", "Military-grade encryption for your digital green assets and payouts.")}
                delay="0.2s"
              />
              <FeatureCard
                icon={<ShoppingCart className="w-8 h-8 text-green-600" />}
                title={t("मार्केटप्लेस", "Fair-Trade Market")}
                desc={t("पारदर्शी तरीके से कार्बन क्रेडिट खरीदें और बेचें।", "Remove the middleman. Direct-to-farmer trades with real-time price discovery.")}
                delay="0.3s"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-green-600" />}
                title={t("ब्लॉकचेन सुरक्षा", "Immutable Trust")}
                desc={t("पूरी पारदर्शिता के साथ एक सुरक्षित श्रृंखला पर ट्रैक किए गए क्रेडिट।", "Every credit is a unique NFT on the ledger, preventing double-counting forever.")}
                delay="0.4s"
              />
            </div>
          </div>
        </section>

        {/* ── Call to Action ── */}
        <section className="py-32 relative overflow-hidden mx-4 mb-12 rounded-[4rem]">
          <div className="absolute inset-0 bg-green-950 -z-10" />
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-green-600/10 rounded-full blur-[100px] -z-10 animate-float" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-600/5 rounded-full blur-[100px] -z-10 animate-pulse-soft" />

          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="inline-block p-4 bg-green-900/50 backdrop-blur-xl border border-green-800 rounded-3xl mb-4">
                <Sprout className="w-12 h-12 text-green-400 animate-bounce-slow" />
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Lead the <br /> <span className="text-green-400 text-glow-green italic">Green Economy</span>
              </h2>
              <p className="text-xl text-green-100/60 font-medium max-w-2xl mx-auto leading-relaxed">
                Empower your land, fulfill your corporate ESG commitments, and be part of the most significant environmental shift of our century.
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-6">
                <Button asChild size="lg" className="bg-green-500 hover:bg-green-400 text-green-950 font-black px-12 rounded-[2rem] h-20 shadow-2xl shadow-green-500/40 text-xl group transition-all">
                  <Link to="/login" className="flex items-center gap-3">
                    Launch Portal
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white/20 text-white hover:bg-white/10 font-black px-12 rounded-[2rem] h-20 backdrop-blur-md text-xl">
                  <Link to="/about">Join Waitlist</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
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
