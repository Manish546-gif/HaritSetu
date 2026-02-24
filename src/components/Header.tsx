import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useWeb3 } from "@/context/Web3Context";
import {
  Leaf,
  Menu,
  X,
  Globe,
  User,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Wallet
} from "lucide-react";
import { authService, User as AuthUser } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "hindi" : "english");
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: t("मुख्य", "Home"), path: "/" },
    { name: t("हमारे बारे में", "About"), path: "/#about", isAnchor: true },
  ];

  const getPortalPath = () => {
    if (!currentUser) return "/login";
    switch (currentUser.role) {
      case "admin": return "/admin";
      case "farmer": return "/farmer";
      case "business": return "/business";
      default: return "/login";
    }
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "py-3 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-sm"
        : "py-5 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-all">
              <Leaf className="w-6 h-6 animate-leaf-sway" />
            </div>
            <span className="text-2xl font-black tracking-tight text-green-900">
              Harit<span className="text-green-600">Setu</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-green-50/50 p-1 rounded-2xl border border-green-100">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a
                  key={link.path}
                  href={link.path}
                  className="px-5 py-2 rounded-xl text-sm font-bold transition-all text-green-800/70 hover:text-green-700 hover:bg-white/50"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-green-800/70 hover:text-green-700 hover:bg-white/50"
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="rounded-xl font-bold text-green-700 hover:bg-green-50 gap-2 border border-transparent hover:border-green-100"
            >
              <Globe className="w-4 h-4" />
              {language === "english" ? "हिन्दी" : "English"}
            </Button>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold gap-2 px-6 shadow-lg shadow-green-900/10">
                    <User className="w-4 h-4" />
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2 mt-2 bg-white/95 backdrop-blur-xl border-green-100">
                  <DropdownMenuLabel className="text-green-900 font-bold px-3 py-2">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-green-50" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-green-50 cursor-pointer">
                    <Link to={getPortalPath()} className="flex items-center gap-2 p-2 w-full font-semibold text-green-800 text-left">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard Portal
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl focus:bg-red-50 cursor-pointer text-red-600 font-semibold" onClick={handleLogout}>
                    <div className="flex items-center gap-2 p-2 w-full">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold px-8 shadow-lg shadow-green-900/10 transition-all hover:scale-105">
                <Link to="/login">{t("लॉगिन", "Login")}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-green-50 text-green-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-green-100 py-6 px-4 animate-in slide-in-from-top duration-300 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-green-900 px-4 py-2 hover:bg-green-50 rounded-xl"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-green-100 my-2" />
            <Button
              variant="outline"
              onClick={toggleLanguage}
              className="rounded-xl font-bold justify-start gap-3 border-green-100"
            >
              <Globe className="w-5 h-5" />
              {language === "english" ? "Switch to हिन्दी" : "English में बदलें"}
            </Button>
            {currentUser ? (
              <>
                <Button asChild className="rounded-xl bg-green-600 text-white justify-start gap-3 hover:bg-green-700">
                  <Link to={getPortalPath()} onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Portal
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="rounded-xl text-red-600 justify-start gap-3 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="rounded-xl bg-green-600 text-white hover:bg-green-700">
                <Link to="/login" onClick={() => setIsOpen(false)}>{t("लॉगिन", "Login")}</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
