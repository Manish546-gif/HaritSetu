import React, { useState, useCallback, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Web3Provider } from "./context/Web3Context";
import LoadingScreen from "./components/LoadingScreen";
import { GlobalEcoBackground } from "./components/GlobalEcoBackground";

// Lazy load pages
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const FarmerPanel = lazy(() => import("@/pages/FarmerPanel"));
const BusinessPanel = lazy(() => import("@/pages/BusinessPanel"));
const About = lazy(() => import("@/pages/About"));
const Docs = lazy(() => import("@/pages/Docs"));
const Contact = lazy(() => import("@/pages/Contact"));

import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Application Crash Detected</h1>
            <pre className="text-xs bg-red-50 p-4 rounded-xl overflow-auto text-red-800 mb-6">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  console.log("App component mounting...");
  const [loading, setLoading] = useState(true);
  const handleLoadComplete = useCallback(() => {
    // Check for a one-time reset flag or handle the user's explicit reset request
    // To reset data, the user can visit /?reset=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("reset") === "true") {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("haritsetu_")) {
          localStorage.removeItem(key);
        }
      });
      console.log("Global reset completed.");
      window.history.replaceState({}, document.title, "/");
      window.location.reload();
    }

    const targetUser = urlParams.get("purgeUser");
    if (targetUser) {
      console.log(`Initiating purge for user: ${targetUser}`);

      // 1. Find user to get wallet address
      const usersRaw = localStorage.getItem("haritsetu_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const userToDelete = users.find((u: any) => u.name === targetUser || u.id === targetUser || u.email.startsWith(targetUser));

      if (userToDelete) {
        const walletAddr = userToDelete.walletAddress;
        const userId = userToDelete.id;

        // 2. Remove from users
        localStorage.setItem("haritsetu_users", JSON.stringify(users.filter((u: any) => u.id !== userId)));

        // 3. Remove fields
        const fieldsRaw = localStorage.getItem("haritsetu_fields");
        if (fieldsRaw) {
          const fields = JSON.parse(fieldsRaw);
          localStorage.setItem("haritsetu_fields", JSON.stringify(fields.filter((f: any) => f.farmerId !== userId)));
        }

        // 4. Remove Ledger transactions
        const ledgerRaw = localStorage.getItem("haritsetu_ledger");
        if (ledgerRaw) {
          const txs = JSON.parse(ledgerRaw);
          localStorage.setItem("haritsetu_ledger", JSON.stringify(txs.filter((tx: any) => tx.from !== walletAddr && tx.to !== walletAddr)));
        }

        // 5. Remove Wallet balance
        const walletsRaw = localStorage.getItem("haritsetu_wallets");
        if (walletsRaw) {
          const wallets = JSON.parse(walletsRaw);
          delete wallets[walletAddr];
          localStorage.setItem("haritsetu_wallets", JSON.stringify(wallets));
        }

        console.log(`Purge complete for ${targetUser}`);
        window.history.replaceState({}, document.title, "/");
        window.location.reload();
      } else {
        console.warn(`User ${targetUser} not found in system.`);
        window.history.replaceState({}, document.title, "/");
      }
    }
    setLoading(false);
  }, []);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Web3Provider>
            <LanguageProvider>
              {loading ? (
                <LoadingScreen onComplete={handleLoadComplete} />
              ) : (
                <Suspense fallback={<div className="min-h-screen bg-green-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>}>
                  <GlobalEcoBackground />
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/docs" element={<Docs />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />

                      {/* Protected Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRole="admin">
                          <AdminPanel />
                        </ProtectedRoute>
                      } />
                      <Route path="/farmer" element={
                        <ProtectedRoute allowedRole="farmer">
                          <FarmerPanel />
                        </ProtectedRoute>
                      } />
                      <Route path="/business" element={
                        <ProtectedRoute allowedRole="business">
                          <BusinessPanel />
                        </ProtectedRoute>
                      } />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </Suspense>
              )}
            </LanguageProvider>
          </Web3Provider>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
