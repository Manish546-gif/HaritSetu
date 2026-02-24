import React, { useState, useEffect } from "react";
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
    Sprout
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newFieldArea, setNewFieldArea] = useState(0);
    const [newFieldCoords, setNewFieldCoords] = useState<[number, number][]>([]);
    const [nickname, setNickname] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("Wheat");
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

    const RegisterFieldView = () => (
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
                                className="w-full p-2 rounded-md border border-input bg-background"
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                {Object.keys(CROP_DATA).map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl space-y-2">
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
                            className="w-full bg-green-600"
                            disabled={!nickname || newFieldArea === 0 || isSubmitting}
                            onClick={async () => {
                                if (!user) return;
                                setIsSubmitting(true);
                                try {
                                    fieldService.submitField({
                                        farmerId: user.id,
                                        nickname,
                                        polygon: newFieldCoords,
                                        area: newFieldArea,
                                        cropType: selectedCrop
                                    });
                                    setFarmerFields(fieldService.getFarmerFields(user.id));
                                    setNickname("");
                                    setNewFieldArea(0);
                                    toast.success("Field registered and sent for verification!");
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

            <Card className="border-green-100 shadow-xl shadow-green-900/5">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Tractor className="w-5 h-5 text-green-600" />
                        {t("पंजीकृत खेत", "Your Fields")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {farmerFields.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground italic">No fields registered yet.</p>
                        ) : (
                            farmerFields.map(field => (
                                <div key={field.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-green-50 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                            {field.nickname.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-green-900">{field.nickname}</p>
                                            <p className="text-xs text-green-600/60 font-medium">{field.cropType} • {field.area} ha</p>
                                        </div>
                                    </div>
                                    <Badge className={
                                        field.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                            field.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                    }>
                                        {field.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
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
            case "register-field": return <RegisterFieldView />;
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
