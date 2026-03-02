import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PanelLayout } from "@/components/PanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Leaf,
    Plus,
    TrendingUp,
    CheckCircle2,
    Wallet,
    Calculator as CalcIcon,
    ShoppingCart,
    Settings,
    History,
    User,
    Tractor,
    Cloud,
    Thermometer,
    Droplets,
    BarChart3,
    ArrowDownRight,
    TrendingDown,
    Map as MapIcon,
    ExternalLink,
    Loader2,
    ArrowUpRight,
    Sprout,
    Camera,
    Upload,
    X
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useWeb3 } from "@/context/Web3Context";
import { ledgerService, Transaction } from "@/lib/ledger";
import { authService } from "@/lib/auth";
import { web3Service } from "@/lib/web3";
import { toast } from "sonner";
import { CarbonCalculator } from "@/components/calculator/CarbonCalculator";
import { MarketplaceList } from "@/components/marketplace/MarketplaceList";
import { CarbonWallet } from "@/components/wallet/CarbonWallet";
import { fieldService, Field, CROP_DATA } from "@/lib/fieldService";
import { purchaseService, PurchaseRequest } from "@/lib/purchaseService";
import FieldMap from "@/components/map/FieldMap";

export default function FarmerPanel() {
    const { t } = useLanguage();
    const user = authService.getCurrentUser();
    const { address, isConnected, connect } = useWeb3();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard");
    const [balance, setBalance] = useState(0);
    const [fieldSize, setFieldSize] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [recentTXs, setRecentTXs] = useState<Transaction[]>([]);
    const [farmerFields, setFarmerFields] = useState<Field[]>([]);

    useEffect(() => {
        if (user) {
            setBalance(ledgerService.getWalletBalance(user.walletAddress));
            setRecentTXs(ledgerService.getTransactions().filter(tx => tx.to === user.walletAddress || tx.from === user.walletAddress));
            setFarmerFields(fieldService.getFarmerFields(user.id));
        }
    }, [user?.id]);

    const handleGenerateCredits = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            toast.error("Please connect your wallet first", {
                action: { label: "Connect", onClick: connect }
            });
            return;
        }

        setIsGenerating(true);
        try {
            const amount = Math.floor(Number(fieldSize) * 5.5);
            const targetAddress = address || user?.walletAddress || "";

            if (!targetAddress) {
                toast.error("No wallet address found. Please login again.");
                return;
            }

            const { hash } = await web3Service.mintCredits(amount, targetAddress);

            toast.success(`Successfully minted ${amount} credits!`, {
                description: `Tx Hash: ${hash.slice(0, 10)}...`,
                action: {
                    label: "View Hash",
                    onClick: () => window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
                }
            });

            setBalance(ledgerService.getWalletBalance(targetAddress));
            setRecentTXs(ledgerService.getTransactions().filter(tx => tx.to === targetAddress || tx.from === targetAddress));
            setFieldSize("");
        } catch (error) {
            toast.error("Minting failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const DashboardView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    icon={<Wallet className="w-5 h-5 text-green-600" />}
                    label={t("उपलब्ध क्रेडिट", "Available Credits")}
                    value={`${balance} CR`}
                    sub={`≈ ₹ ${(balance * 2075).toLocaleString()}`}
                    trend="+12.5% this month"
                />
                <StatsCard
                    icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                    label={t("कुल कमाई", "Total Earned")}
                    value="₹ 1.2M"
                    sub="from 12 transactions"
                    trend="+5.2% vs last month"
                />
                <StatsCard
                    icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
                    label={t("सत्यापन स्थिति", "Verification Status")}
                    value="85%"
                    sub="High Integrity"
                    trend="Certified by HaritSetu"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-green-100 shadow-xl shadow-green-900/5 overflow-hidden">
                    <div className="h-2 bg-green-500" />
                    <CardHeader className="bg-green-50/50">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Tractor className="w-5 h-5 text-green-600" />
                            {t("नए क्रेडिट जनरेट करें", "Generate New Credits")}
                        </CardTitle>
                        <CardDescription>
                            {t("अपनी टिकाऊ खेती प्रथाओं को सत्यापित क्रेडिट में बदलें।", "Convert your sustainable farming practices into verified credits.")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleGenerateCredits} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fieldSize">{t("खेत का आकार (एकड़)", "Field Size (Acres)")}</Label>
                                <div className="relative">
                                    <Input
                                        id="fieldSize"
                                        placeholder="e.g. 25"
                                        value={fieldSize}
                                        onChange={(e) => setFieldSize(e.target.value)}
                                        className="pl-10 rounded-xl"
                                    />
                                    <Sprout className="w-4 h-4 absolute left-3 top-3 text-green-500" />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isGenerating || !fieldSize}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 py-6 rounded-xl font-bold shadow-lg"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Minting On-Chain...
                                    </>
                                ) : t("क्रेडिट्स मिंट करें", "Mint Credits")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <section className="bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-xl shadow-green-900/5">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-green-900 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            {t("प्रीमियम उपज अंतर्दृष्टि", "Premium Yield Insights")}
                        </h3>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1.5 rounded-full font-bold">LIVE ANALYSIS</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <YieldIndicator label="Soil Health" value="OPTIMAL" color="text-green-600" />
                        <YieldIndicator label="Carbon Sink Rate" value="+2.4t/ha" color="text-green-600" />
                        <YieldIndicator label="Water Efficiency" value="92%" color="text-green-600" />
                        <YieldIndicator label="Market Premium" value="15%" color="text-yellow-600" />
                    </div>
                </section>
            </div>
        </div>
    );

    const RegistrationView = () => (
        <Card className="max-w-2xl mx-auto border-green-100 shadow-xl shadow-green-900/5">
            <CardHeader>
                <CardTitle className="text-2xl font-black text-green-900 flex items-center gap-3">
                    <User className="w-6 h-6 text-green-600" />
                    {t("किसान पंजीकरण", "Farmer Registration")}
                </CardTitle>
                <CardDescription>
                    {t("प्रीमियम कार्बन क्रेडिट और बाज़ार सहायता अनलॉक करने के लिए अपनी प्रोफ़ाइल पूरी करें।", "Complete your profile to unlock premium carbon credits and market support.")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="farm-name">{t("खेत का नाम", "Farm Name")}</Label>
                        <Input id="farm-name" placeholder="Green Valley Farm" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="land-size">{t("भूमि का आकार (एकड़)", "Land Size (Acres)")}</Label>
                        <Input id="land-size" type="number" placeholder="50" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="farm-location">{t("खेत का स्थान", "Farm Location")}</Label>
                    <Input id="farm-location" placeholder="Gujarat, India" />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">{t("प्रोफ़ाइल सहेजें", "Save Profile")}</Button>
            </CardFooter>
        </Card>
    );

    const TransactionsView = () => (
        <Card className="border-green-100 shadow-xl shadow-green-900/5">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <History className="w-5 h-5 text-green-600" />
                    {t("हाल के लेनदेन", "Recent Activity")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTXs.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground italic">No transactions yet. Start minting!</p>
                    ) : (
                        recentTXs.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-green-50 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "EARN" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                                        {tx.type === "EARN" ? <Plus className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-green-900">{tx.type === "EARN" ? "Credit Minting" : "Sale"}</p>
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
                    {t("सेटिंग्स", "Settings")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                        <p className="font-bold text-green-900">{t("सूचनाएं", "Notifications")}</p>
                        <p className="text-sm text-green-600/70">{t("ईमेल और मोबाइल अलर्ट प्रबंधित करें", "Manage email and mobile alerts")}</p>
                    </div>
                    <Button variant="outline">{t("बदलें", "Change")}</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                        <p className="font-bold text-green-900">{t("सुरक्षा", "Security")}</p>
                        <p className="text-sm text-green-600/70">{t("दो-कारक प्रमाणीकरण सक्रिय करें", "Enable two-factor authentication")}</p>
                    </div>
                    <Button variant="outline">{t("सेटअप", "Setup")}</Button>
                </div>
            </CardContent>
        </Card>
    );

    const WeatherView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard icon={<Cloud className="w-5 h-5 text-blue-500" />} label="Weather" value="Partly Cloudy" sub="28°C" trend="Humidity: 45%" />
                <StatsCard icon={<Thermometer className="w-5 h-5 text-red-500" />} label="Soil Temp" value="22°C" sub="Ideal for Crop" trend="Stable" />
                <StatsCard icon={<Droplets className="w-5 h-5 text-blue-600" />} label="Moisture" value="68%" sub="Adequate" trend="+2% last 24h" />
                <StatsCard icon={<Leaf className="w-5 h-5 text-green-600" />} label="Soil Carbon" value="1.2%" sub="Target: 1.5%" trend="+0.05% vs last month" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-green-600" />
                            Soil Health Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <span className="font-bold text-green-900">Nitrogen Level</span>
                            <Badge className="bg-green-100 text-green-700">Optimal</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <span className="font-bold text-green-900">Phosphorus</span>
                            <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <span className="font-bold text-green-900">pH Level</span>
                            <span className="font-bold text-green-700">6.8 (Neutral)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bottom-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-blue-600" />
                            7-Day Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { day: "Tomorrow", temp: "29°C", weather: "Sunny" },
                                { day: "Thursday", temp: "27°C", weather: "Cloudy" },
                                { day: "Friday", temp: "26°C", weather: "Light Rain" }
                            ].map(f => (
                                <div key={f.day} className="flex items-center justify-between p-3 border-b border-green-50 last:border-0">
                                    <span className="font-medium text-green-900">{f.day}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-600 font-bold">{f.temp}</span>
                                        <span className="text-xs text-muted-foreground">{f.weather}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );



    const MarketTrendsView = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Carbon Market Index
                    </CardTitle>
                    <CardDescription>Real-time credit valuation and demand trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-8 text-center bg-green-50 rounded-[2rem] border border-green-100">
                        <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Current Credit Value</p>
                        <h3 className="text-6xl font-black text-green-900 mb-4">₹2,840 <span className="text-xl text-green-500">/ CR</span></h3>
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12.4% this month</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-white border border-green-50 rounded-2xl">
                            <p className="text-xs text-muted-foreground font-bold mb-1">Global Demand</p>
                            <p className="text-lg font-black text-green-900">Very High</p>
                        </div>
                        <div className="p-4 bg-white border border-green-50 rounded-2xl">
                            <p className="text-xs text-muted-foreground font-bold mb-1">Market Sentiment</p>
                            <p className="text-lg font-black text-green-600">Bullish</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const PurchaseRequestsView = () => {
        const [requests, setRequests] = React.useState<PurchaseRequest[]>(
            () => user ? purchaseService.getForFarmer(user.id) : []
        );
        const [processingId, setProcessingId] = React.useState<string | null>(null);

        const refresh = () => {
            if (user) setRequests(purchaseService.getForFarmer(user.id));
        };

        const handleApprove = async (req: PurchaseRequest) => {
            setProcessingId(req.id);
            try {
                // Check if farmer has enough credits
                const currentBalance = ledgerService.getWalletBalance(req.farmerWallet);
                if (currentBalance < req.amount) {
                    toast.error("Insufficient credits to fulfill this request.");
                    return;
                }

                // Simulate brief on-chain delay
                await new Promise(res => setTimeout(res, 1200));
                const hash = "0x" + Array.from({ length: 64 }, () =>
                    Math.floor(Math.random() * 16).toString(16)).join("");

                // Transfer: ledgerService.addTransaction handles the balance updates
                // Write ledger history and update balances
                await ledgerService.addTransaction(
                    req.farmerWallet,
                    req.businessWallet,
                    req.amount,
                    "SELL"
                );

                purchaseService.resolve(req.id, "APPROVED", hash);
                refresh();
                // Refresh farmer's own balance
                setBalance(ledgerService.getWalletBalance(user?.walletAddress || ""));

                toast.success(`Approved! ${req.amount} CR sent to ${req.businessName}`, {
                    description: `Tx: ${hash.slice(0, 10)}…`
                });
            } finally {
                setProcessingId(null);
            }
        };

        const handleReject = (req: PurchaseRequest) => {
            purchaseService.resolve(req.id, "REJECTED");
            refresh();
            toast.error(`Request from ${req.businessName} rejected.`);
        };

        const pending = requests.filter(r => r.status === "PENDING");
        const resolved = requests.filter(r => r.status !== "PENDING");

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Pending */}
                <Card className="border-green-100 shadow-xl shadow-green-900/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                            Incoming Purchase Requests
                            {pending.length > 0 && (
                                <Badge className="bg-amber-100 text-amber-700 border-none ml-2">
                                    {pending.length} pending
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pending.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground italic">No pending requests.</p>
                        ) : (
                            <div className="space-y-4">
                                {pending.map(req => (
                                    <div key={req.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                                        <div className="space-y-1">
                                            <p className="font-bold text-green-900">{req.businessName}</p>
                                            <p className="text-sm text-green-700">
                                                Wants to buy{" "}
                                                <span className="font-black">{req.amount} CR</span>
                                                {" "}@{" "}
                                                <span className="font-black">₹{req.pricePerCredit.toLocaleString("en-IN")}</span>/CR
                                            </p>
                                            <p className="text-xs text-green-600/60">
                                                Total: ₹{(req.amount * req.pricePerCredit).toLocaleString("en-IN")}
                                                {" · "}
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 font-bold rounded-xl"
                                                onClick={() => handleApprove(req)}
                                                disabled={processingId === req.id}
                                            >
                                                {processingId === req.id
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : "✓ Approve"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="font-bold rounded-xl"
                                                onClick={() => handleReject(req)}
                                                disabled={processingId === req.id}
                                            >
                                                ✕ Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* History */}
                {resolved.length > 0 && (
                    <Card className="border-green-100 shadow-xl shadow-green-900/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <History className="w-5 h-5 text-green-600" />
                                Request History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {resolved.map(req => (
                                    <div key={req.id}
                                        className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-green-50 shadow-sm">
                                        <div>
                                            <p className="text-sm font-bold text-green-900">
                                                {req.businessName} — {req.amount} CR
                                            </p>
                                            <p className="text-xs text-green-600/60">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge className={req.status === "APPROVED"
                                            ? "bg-green-100 text-green-700 border-none"
                                            : "bg-red-100 text-red-700 border-none"}
                                        >
                                            {req.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardView />;
            case "calculator": return <CarbonCalculator />;
            case "marketplace": return <MarketplaceList />;
            case "wallet": return <CarbonWallet />;
            case "weather": return <WeatherView />;
            case "market": return <MarketTrendsView />;
            case "transactions": return <TransactionsView />;
            case "settings": return <SettingsView />;
            case "registration": return <RegistrationView />;
            case "register-field": return <RegisterFieldView user={user} t={t} onFieldSubmitted={() => user && setFarmerFields(fieldService.getFarmerFields(user.id))} />;
            case "purchase-requests": return <PurchaseRequestsView />;
            default: return <DashboardView />;
        }
    };


    return (
        <PanelLayout
            role="farmer"
            title={activeTab === "dashboard" ? "Harvest Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {renderContent()}
        </PanelLayout>
    );
}

function StatsCard({ icon, label, value, sub, trend }: { icon: React.ReactNode, label: string, value: string, sub: string, trend: string }) {
    return (
        <Card className="border-green-50 shadow-xl shadow-green-900/5 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-2xl">{icon}</div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
                </div>
                <h3 className="text-sm font-bold text-green-800/60 uppercase tracking-widest mb-1">{label}</h3>
                <p className="text-2xl font-black text-green-900 mb-1">{value}</p>
                <p className="text-xs text-green-600/60">{sub}</p>
            </CardContent>
        </Card>
    );
}

function YieldIndicator({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
            <p className="text-[10px] uppercase font-bold text-green-800/40 mb-1 tracking-widest">{label}</p>
            <p className={`text-xl font-black ${color}`}>{value}</p>
        </div>
    );
}

function FieldCamera({ onCapture, onClose, isInField }: { onCapture: (img: string) => void, onClose: () => void, isInField: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                setError("Could not access camera. Please ensure permissions are granted.");
            }
        }
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (!isInField) {
            toast.error("Access Denied", { description: "You must be inside the field boundary to take photos." });
            return;
        }
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                onCapture(dataUrl);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-900 overflow-hidden shadow-2xl">
                {error ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
                        <Camera className="w-12 h-12 text-zinc-500 mb-4" />
                        <p className="text-sm font-medium">{error}</p>
                        <Button onClick={onClose} variant="outline" className="mt-6 border-white/20 text-white hover:bg-white/10">Back</Button>
                    </div>
                ) : (
                    <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Camera HUD */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                            <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <Badge className={`${isInField ? "bg-green-500/80" : "bg-red-500/80"} text-white border-none py-1.5 px-4 backdrop-blur-md`}>
                                {isInField ? "✓ VERIFIED IN FIELD" : "✕ OUTSIDE FIELD"}
                            </Badge>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
                            {!isInField && (
                                <p className="text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Move inside boundary to capture
                                </p>
                            )}
                            <button
                                onClick={capturePhoto}
                                disabled={!isInField}
                                className={`w-20 h-20 rounded-full border-4 ${isInField ? "border-white" : "border-zinc-600"} p-1 group transition-transform active:scale-95`}
                            >
                                <div className={`w-full h-full rounded-full ${isInField ? "bg-white group-hover:bg-zinc-100" : "bg-zinc-700"} transition-colors`} />
                            </button>
                            <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Tap to Capture Field Photo</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function RegisterFieldView({ user, t, onFieldSubmitted }: { user: any, t: any, onFieldSubmitted: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newFieldArea, setNewFieldArea] = useState(0);
    const [newFieldCoords, setNewFieldCoords] = useState<[number, number][]>([]);
    const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
    const [isLocationVerified, setIsLocationVerified] = useState(false);
    const [nickname, setNickname] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("Wheat");
    const [images, setImages] = useState<string[]>([]);
    const [showCamera, setShowCamera] = useState(false);
    // Get fields for listing
    const [farmerFields, setFarmerFields] = useState<Field[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) setFarmerFields(fieldService.getFarmerFields(user.id));
    }, [user?.id]);

    const isPointInPolygon = (lat: number, lng: number, polygon: [number, number][]) => {
        let isInside = false;
        // The polygon is an array of [lat, lng] pairs from FieldMap.tsx
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const latI = polygon[i][0], lngI = polygon[i][1];
            const latJ = polygon[j][0], lngJ = polygon[j][1];

            const intersect = ((latI > lat) !== (latJ > lat)) &&
                (lng < (lngJ - lngI) * (lat - latI) / (latJ - latI) + lngI);

            if (intersect) isInside = !isInside;
        }
        return isInside;
    };

    const handleCameraClick = () => {
        if (isVerifyingLocation) return;

        if (newFieldCoords.length === 0) {
            toast.error("Please draw the field boundary on the map first.");
            return;
        }

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setIsVerifyingLocation(true);
        const loadingToast = toast.loading("Verifying your location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const isInField = isPointInPolygon(latitude, longitude, newFieldCoords);

                toast.dismiss(loadingToast);
                setIsVerifyingLocation(false);

                if (!isInField) {
                    toast.error("Access Denied", {
                        description: "Your GPS (Lat: " + latitude.toFixed(4) + ", Lng: " + longitude.toFixed(4) + ") is outside the boundary."
                    });
                    return;
                }

                setIsLocationVerified(true);
                toast.success("Location verified! You can now take photos.");
            },
            (error) => {
                toast.dismiss(loadingToast);
                setIsVerifyingLocation(false);
                toast.error("Could not verify location. Please enable GPS.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        if (images.length + fileArray.length > 5) {
            toast.error("You can only upload up to 5 images.");
            return;
        }

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-green-100 shadow-xl shadow-green-900/5 overflow-hidden">
                    <CardHeader className="bg-green-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-green-600" />
                            {t("खेत मानचित्रण", "Field Mapping")}
                        </CardTitle>
                        <CardDescription>Draw your field boundary on the map to calculate area.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <FieldMap onAreaChange={(area, coords) => {
                            setNewFieldArea(area);
                            setNewFieldCoords(coords);
                            setIsLocationVerified(false); // Force re-verify for new boundary
                        }} />
                    </CardContent>
                </Card>

                <Card className="border-green-100 shadow-xl shadow-green-900/5">
                    <CardHeader>
                        <CardTitle>{t("क्षेत्र विवरण", "Field Details")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("खेत का उपनाम", "Field Nickname")}</Label>
                            <Input
                                placeholder="e.g. North Plain"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("फसल का प्रकार", "Crop Type")}</Label>
                            <select
                                className="w-full p-2 rounded-md border border-input bg-background font-medium"
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                {Object.keys(CROP_DATA).map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload UI */}
                        <div className="space-y-3 pt-2">
                            <Label className="flex items-center gap-2 text-green-800 font-bold">
                                <Camera className="w-4 h-4" />
                                Field Photos (3-4 required)
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-green-100">
                                        <img src={img} className="w-full h-full object-cover" alt="Field" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 5 && (
                                    <div className="aspect-square">
                                        {!isLocationVerified ? (
                                            <div
                                                onClick={handleCameraClick}
                                                className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-all shadow-sm"
                                            >
                                                <MapIcon className="w-5 h-5 text-amber-500 mb-1" />
                                                <span className="text-[10px] text-amber-700 font-bold text-center px-1 leading-tight">Verify Location</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full grid grid-cols-1 gap-1">
                                                <button
                                                    onClick={() => setShowCamera(true)}
                                                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-green-400 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-all shadow-sm"
                                                >
                                                    <Camera className="w-4 h-4 text-green-600 mb-0.5" />
                                                    <span className="text-[8px] text-green-700 font-bold leading-none">Smart Camera</span>
                                                </button>
                                                <label
                                                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all shadow-sm"
                                                >
                                                    <Upload className="w-4 h-4 text-blue-600 mb-0.5" />
                                                    <span className="text-[8px] text-blue-700 font-bold leading-none">Bulk Upload</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            handleImageUpload(e);
                                                            setIsLocationVerified(false);
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl space-y-2 border border-green-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-800 font-bold">Calculated Area</span>
                                <span className="text-green-600 font-black">{newFieldArea} ha</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-800 font-bold">Potential Credits</span>
                                <span className="text-green-600 font-black">
                                    {fieldService.calculatePotentialCredits(newFieldArea, selectedCrop)} CR
                                </span>
                            </div>
                        </div>
                        <Button
                            className="w-full bg-green-700 hover:bg-green-800 h-12 rounded-xl font-bold shadow-lg"
                            disabled={!nickname || newFieldArea === 0 || isSubmitting || images.length < 3}
                            onClick={async () => {
                                if (!user) return;
                                setIsSubmitting(true);
                                try {
                                    fieldService.submitField({
                                        farmerId: user.id,
                                        nickname,
                                        polygon: newFieldCoords,
                                        area: newFieldArea,
                                        cropType: selectedCrop,
                                        images: images
                                    });
                                    onFieldSubmitted();
                                    // Local reset
                                    setNickname("");
                                    setNewFieldArea(0);
                                    setImages([]);
                                    setFarmerFields(fieldService.getFarmerFields(user.id));
                                    toast.success("Field submitted for verification!");
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : t("पंजीकरण करें", "Register Field")}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* List of Registered Fields */}
            <Card className="border-green-100 shadow-xl shadow-green-900/5">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-green-900">
                        <Tractor className="w-5 h-5 text-green-600" />
                        {t("पंजीकृत खेत", "Your Registered Fields")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {farmerFields.length === 0 ? (
                            <div className="text-center py-12 bg-green-50/30 rounded-2xl border-2 border-dashed border-green-100">
                                <p className="text-muted-foreground italic">No fields registered yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {farmerFields.map(field => (
                                    <div key={field.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-green-50 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-bold text-lg">
                                                {field.nickname.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-green-900">{field.nickname}</p>
                                                <p className="text-xs text-green-600/60 font-medium">
                                                    {field.cropType} • {field.area.toFixed(2)} ha
                                                    {field.images && ` • ${field.images.length} photos`}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={
                                            field.status === "APPROVED" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                field.status === "REJECTED" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                                                    "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                        }>
                                            {field.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
