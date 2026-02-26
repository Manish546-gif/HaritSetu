import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PanelLayout } from "@/components/PanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Building,
    Leaf,
    ShoppingCart,
    Activity,
    History,
    ArrowUpRight,
    Loader2,
    ExternalLink,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    LayoutDashboard,
    FileLineChart,
    Microscope,
    Download,
    PieChart,
    Truck,
    Globe,
    ShieldCheck,
    Settings
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useWeb3 } from "@/context/Web3Context";
import { ledgerService, Transaction } from "@/lib/ledger";
import { authService } from "@/lib/auth";
import { web3Service } from "@/lib/web3";
import { toast } from "sonner";
import { MarketplaceList } from "@/features/marketplace/components/MarketplaceList";
import { CarbonWallet } from "@/features/wallet/components/CarbonWallet";

export default function BusinessPanel() {
    const { t } = useLanguage();
    const user = authService.getCurrentUser();
    const { address, isConnected, connect } = useWeb3();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard");
    const [balance, setBalance] = useState(0);
    const [emissions, setEmissions] = useState(420);
    const [limit] = useState(500);
    const [isBuying, setIsBuying] = useState(false);
    const [recentTXs, setRecentTXs] = useState<Transaction[]>([]);

    useEffect(() => {
        if (user) {
            setBalance(ledgerService.getWalletBalance(user.walletAddress));
            setRecentTXs(ledgerService.getTransactions().filter(tx => tx.to === user.walletAddress || tx.from === user.walletAddress));
        }

        const interval = setInterval(() => {
            setEmissions(prev => Math.min(prev + Math.random() * 2, 600));
        }, 5000);

        return () => clearInterval(interval);
    }, [user?.id]);

    const handleBuyCredits = async () => {
        if (!isConnected) {
            toast.error("Please connect your wallet first", {
                action: { label: "Connect", onClick: connect }
            });
            return;
        }

        setIsBuying(true);
        try {
            const amount = 50;
            const targetAddress = address || user?.walletAddress || "";

            if (!targetAddress) {
                toast.error("No wallet address found. Please login again.");
                return;
            }

            const { hash } = await web3Service.buyCredits(amount, targetAddress);

            toast.success(`Purchased ${amount} Credits!`, {
                description: `Tx Hash: ${hash.slice(0, 10)}...`,
                action: {
                    label: "Verify",
                    onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
                }
            });

            setBalance(ledgerService.getWalletBalance(targetAddress));
            setRecentTXs(ledgerService.getTransactions().filter(tx => tx.to === targetAddress || tx.from === targetAddress));
        } catch (error) {
            toast.error("Purchase failed. Insufficient funds or network error.");
        } finally {
            setIsBuying(false);
        }
    };

    const emissionPercent = (emissions / limit) * 100;

    const DashboardView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    icon={<Activity className="w-5 h-5 text-red-600" />}
                    label={t("वर्तमान पदचिह्न", "Current Footprint")}
                    value={`${emissions.toFixed(1)} MT`}
                    sub="Monthly Tracking"
                    trend="-4.2% this year"
                />
                <StatsCard
                    icon={<Wallet className="w-5 h-5 text-green-600" />}
                    label={t("क्रेडिट बैलेंस", "Credit Balance")}
                    value={`${balance} CR`}
                    sub="Compliance Surplus"
                    trend="Target: 5,000"
                />
                <StatsCard
                    icon={<Building className="w-5 h-5 text-blue-600" />}
                    label={t("मासिक सीमा", "Monthly Limit")}
                    value={`${limit} MT`}
                    sub="Regulatory Target"
                    trend="Certified"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card overflow-hidden">
                    <div className="h-2 bg-red-500" />
                    <CardHeader className="bg-green-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-500" />
                            {t("अनुपालन मॉनिटर", "Compliance Monitor")}
                        </CardTitle>
                        <CardDescription>{t("भत्ता बनाम वास्तविक समय औद्योगिक CO2 उत्सर्जन ट्रैकिंग।", "Real-time industrial CO2 emission tracking vs allowance.")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-green-800">CO2 Allowance Used</span>
                                <span className={emissionPercent > 90 ? "text-red-600 animate-pulse" : "text-green-600"}>
                                    {emissionPercent.toFixed(1)}%
                                </span>
                            </div>
                            <Progress value={emissionPercent} className={`h-3 rounded-full ${emissionPercent > 90 ? "bg-red-100" : "bg-green-100"}`} />
                        </div>

                        {emissionPercent > 80 && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Compliance Warning</p>
                                    <p className="text-xs text-amber-800">You are approaching your emission limit. Consider purchasing offsets.</p>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={() => setActiveTab("marketplace")}
                            className="w-full bg-green-700 hover:bg-green-800 py-6 rounded-xl font-bold shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {t("क्रेडिट खरीदें", "Purchase Offset Credits")}
                        </Button>
                    </CardContent>
                </Card>

                <section className="bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-xl shadow-green-900/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-green-900 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            {t("ईएसजी तैयारी चेकलिस्ट", "ESG Readiness Checklist")}
                        </h3>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1.5 rounded-full font-bold">READY</Badge>
                    </div>
                    <div className="space-y-4">
                        <ComplianceCheck label="Carbon Disclosure" status="DONE" />
                        <ComplianceCheck label="Supply Chain Audit" status="PROGRESS" />
                        <ComplianceCheck label="Renewable Usage" status="DONE" />
                    </div>
                </section>
            </div>
        </div>
    );

    const TransactionsView = () => (
        <Card className="border-green-100 shadow-xl shadow-green-900/5">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <History className="w-5 h-5 text-green-600" />
                    {t("खरीद इतिहास", "Purchase History")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTXs.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground italic">No purchases yet.</p>
                    ) : (
                        recentTXs.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-green-50 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-green-900">Credit Purchase</p>
                                        <p className="text-xs text-green-600/60 font-medium">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-700">+{tx.amount} CR</p>
                                    <button onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, "_blank")} className="text-[10px] text-muted-foreground font-mono hover:text-green-600 flex items-center gap-1">
                                        {tx.hash.slice(0, 10)}... <ExternalLink className="w-2 h-2" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const SettingsView = () => (
        <Card className="border-green-100 shadow-xl shadow-green-900/5">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    {t("कॉर्पोरेट सेटिंग्स", "Corporate Settings")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                        <p className="font-bold text-green-900">{t("बिलिंग जानकारी", "Billing Info")}</p>
                        <p className="text-sm text-green-600/70">{t("भुगतान विवरण प्रबंधित करें", "Manage payment details")}</p>
                    </div>
                    <Button variant="outline">{t("प्रबंधित करें", "Manage")}</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                        <p className="font-bold text-green-900">{t("रिपोर्टिंग", "Reporting")}</p>
                        <p className="text-sm text-green-600/70">{t("स्वचालित ESG रिपोर्ट सेट करें", "Set up automated ESG reporting")}</p>
                    </div>
                    <Button variant="outline">{t("सेटअप", "Setup")}</Button>
                </div>
            </CardContent>
        </Card>
    );

    const ESGView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-green-100 shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-green-900">ESG Status: Compliant</h3>
                    <p className="text-sm text-green-600/60 font-medium">Auto-generated for Q1 2026</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 gap-2 px-6 py-6 rounded-2xl shadow-lg">
                    <Download className="w-4 h-4" />
                    Download PDF Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-600" />
                            Emission Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { label: "Scope 1 (Direct)", val: "45%", color: "bg-blue-500" },
                            { label: "Scope 2 (Energy)", val: "30%", color: "bg-green-500" },
                            { label: "Scope 3 (Supply)", val: "25%", color: "bg-orange-500" }
                        ].map(s => (
                            <div key={s.label} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span>{s.label}</span>
                                    <span>{s.val}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${s.color}`} style={{ width: s.val }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Policy Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            "India Net Zero 2070 Standards",
                            "Global Reporting Initiative (GRI)",
                            "SEC Climate Disclosure Hub"
                        ].map(p => (
                            <div key={p} className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-bold text-green-900">{p}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const AnalyticsView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-orange-600" />
                            Supply Chain Map
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-12 text-center rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200">
                            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-bold text-slate-500 italic">Global Supply Chain Visualizer coming soon...</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Microscope className="w-5 h-5 text-green-600" />
                            Vendor Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "AgriSupply Co.", score: "94/100" },
                            { name: "EcoLogistics Pvt.", score: "88/100" },
                            { name: "GreenFertilizers", score: "72/100" }
                        ].map(v => (
                            <div key={v.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-700">{v.name}</span>
                                <span className="font-black text-green-600">{v.score}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardView />;
            case "marketplace": return <MarketplaceList />;
            case "wallet": return <CarbonWallet />;
            case "esg": return <ESGView />;
            case "analytics": return <AnalyticsView />;
            case "transactions": return <TransactionsView />;
            case "settings": return <SettingsView />;
            default: return <DashboardView />;
        }
    };

    return (
        <PanelLayout
            role="business"
            title={activeTab === "dashboard" ? "Corporate Compliance" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {renderContent()}
        </PanelLayout>
    );
}

function StatsCard({ icon, label, value, sub, trend }: { icon: React.ReactNode, label: string, value: string, sub: string, trend: string }) {
    return (
        <Card className="glass-card border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-green-50">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-green-600/70">{label}</p>
                    <h4 className="text-2xl font-bold text-green-900">{value}</h4>
                    <p className="text-[10px] text-green-600 font-medium">{sub} • {trend}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ComplianceCheck({ label, status }: { label: string, status: "DONE" | "PROGRESS" | "TODO" }) {
    const icons = {
        DONE: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        PROGRESS: <Activity className="w-4 h-4 text-blue-600 animate-pulse" />,
        TODO: <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
    };
    return (
        <div className="p-4 bg-white/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-green-200 transition-all">
            <span className="text-xs font-bold text-slate-700">{label}</span>
            {icons[status]}
        </div>
    );
}
