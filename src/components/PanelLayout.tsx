import { useNavigate } from "react-router-dom";
import { authService, UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, User, LayoutDashboard, History, Settings, Calculator, ShoppingCart, Wallet, Cloud, BarChart3, FileLineChart, Microscope, Map as MapIcon, BookOpen, MessageSquare } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";

interface PanelLayoutProps {
    children: React.ReactNode;
    role: UserRole;
    title: string;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const PanelLayout = ({ children, role, title, activeTab = "dashboard", onTabChange }: PanelLayoutProps) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const { address, isConnected, connect, isConnecting } = useWeb3();
    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };
    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="min-h-screen bg-green-50/50 flex flex-col">
            {/* Header omitted for brevity, but stays same internally */}
            <header className="bg-white border-b border-green-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/")} className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 hover:scale-105 transition-transform">
                        <Leaf className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="font-bold text-green-900 text-lg leading-tight">HaritSetu</h1>
                        <p className="text-xs text-green-600 font-medium tracking-wider uppercase">{role} Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={connect}
                        disabled={isConnecting || isConnected}
                        className={`rounded-xl font-bold gap-2 border-green-100 flex ${isConnected ? "bg-green-50 text-green-700 border-green-200" : "text-green-700 hover:bg-green-50"
                            }`}
                    >
                        <Wallet className="w-4 h-4" />
                        {isConnected ? formatAddress(address!) : isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                        <User className="w-4 h-4 text-green-700" />
                        <span className="text-sm font-medium text-green-800">{user?.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-green-700 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 space-y-2">
                    <nav className="space-y-1">
                        <NavItem
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            label="Dashboard"
                            active={activeTab === "dashboard"}
                            onClick={() => onTabChange?.("dashboard")}
                        />
                        {role === "farmer" && (
                            <>
                                <NavItem
                                    icon={<Calculator className="w-4 h-4" />}
                                    label="Calculator"
                                    active={activeTab === "calculator"}
                                    onClick={() => onTabChange?.("calculator")}
                                />
                                <NavItem
                                    icon={<MapIcon className="w-4 h-4" />}
                                    label="Register Field"
                                    active={activeTab === "register-field"}
                                    onClick={() => onTabChange?.("register-field")}
                                />
                                <NavItem
                                    icon={<Cloud className="w-4 h-4" />}
                                    label="Weather & Soil"
                                    active={activeTab === "weather"}
                                    onClick={() => onTabChange?.("weather")}
                                />
                                <NavItem
                                    icon={<BarChart3 className="w-4 h-4" />}
                                    label="Market Trends"
                                    active={activeTab === "market"}
                                    onClick={() => onTabChange?.("market")}
                                />
                                <NavItem
                                    icon={<BookOpen className="w-4 h-4" />}
                                    label="Crop Library"
                                    active={activeTab === "crop-library"}
                                    onClick={() => onTabChange?.("crop-library")}
                                />
                                <NavItem
                                    icon={<ShoppingCart className="w-4 h-4" />}
                                    label="Purchase Requests"
                                    active={activeTab === "purchase-requests"}
                                    onClick={() => onTabChange?.("purchase-requests")}
                                />
                            </>
                        )}

                        {role === "business" && (
                            <>
                                <NavItem
                                    icon={<FileLineChart className="w-4 h-4" />}
                                    label="ESG Report"
                                    active={activeTab === "esg"}
                                    onClick={() => onTabChange?.("esg")}
                                />
                                <NavItem
                                    icon={<Microscope className="w-4 h-4" />}
                                    label="Supply Analytics"
                                    active={activeTab === "analytics"}
                                    onClick={() => onTabChange?.("analytics")}
                                />
                            </>
                        )}

                        {role !== "admin" && (
                            <>
                                <NavItem
                                    icon={<ShoppingCart className="w-4 h-4" />}
                                    label="Marketplace"
                                    active={activeTab === "marketplace"}
                                    onClick={() => onTabChange?.("marketplace")}
                                />
                                <NavItem
                                    icon={<Wallet className="w-4 h-4" />}
                                    label="Wallet"
                                    active={activeTab === "wallet"}
                                    onClick={() => onTabChange?.("wallet")}
                                />
                            </>
                        )}
                        <NavItem
                            icon={<History className="w-4 h-4" />}
                            label="Transactions"
                            active={activeTab === "transactions"}
                            onClick={() => onTabChange?.("transactions")}
                        />
                        <NavItem
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                            active={activeTab === "settings"}
                            onClick={() => onTabChange?.("settings")}
                        />
                        <NavItem
                            icon={<MessageSquare className="w-4 h-4" />}
                            label="Contact Support"
                            active={false}
                            onClick={() => navigate("/contact")}
                        />
                    </nav>

                    <div className="p-4 bg-green-600 rounded-2xl text-white mt-8 shadow-xl shadow-green-100">
                        <h4 className="font-bold mb-1">Eco Tip</h4>
                        <p className="text-xs text-green-50 leading-relaxed">
                            Did you know? Every 10 carbon credits saved is equivalent to planting 15 trees.
                        </p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-3xl font-extrabold text-green-900">{title}</h2>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
            ? "bg-green-600 text-white shadow-lg shadow-green-200"
            : "text-green-700 hover:bg-green-100"
            }`}>
        {icon}
        {label}
    </button>
);
