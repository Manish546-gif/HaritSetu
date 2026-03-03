
import { useState, useMemo } from "react";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, ShoppingCart, Filter, PackageOpen, Loader2, IndianRupee } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { authService } from "@/lib/auth";
import { ledgerService } from "@/lib/ledger";
import { fieldService } from "@/lib/fieldService";
import { purchaseService } from "@/lib/purchaseService";
import { toast } from "sonner";

const BASE_PRICE = 1400;

// Shape of a live marketplace listing built from real localStorage data
interface Listing {
  id: string;
  name: string;
  walletAddress: string;
  location: string;
  farmType: string;
  fields: number;
  totalArea: number;
  credits: number;
  price: number;
}

export function MarketplaceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState("low-to-high");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [buyAmountStr, setBuyAmountStr] = useState("1"); // string so user can type freely
  const [isSending, setIsSending] = useState(false);
  const { t, currencySymbol } = useLanguage();

  const currentUser = authService.getCurrentUser();

  // Build live listings from localStorage
  const listings = useMemo<Listing[]>(() => {
    const allUsers = authService.getUsers();
    const allFields = fieldService.getFields();

    return allUsers
      .filter(
        (u) =>
          u.role === "farmer" &&
          allFields.some((f) => f.farmerId === u.id && f.status === "APPROVED")
      )
      .map((farmer) => {
        const approvedFields = allFields.filter(
          (f) => f.farmerId === farmer.id && f.status === "APPROVED"
        );
        const balance = ledgerService.getWalletBalance(farmer.walletAddress);
        const variation = parseInt(farmer.walletAddress.slice(2, 4), 16) % 10;
        const price = BASE_PRICE + (variation - 5) * 50;

        const bestField = approvedFields.reduce((prev, curr) =>
          (curr.area || 0) > (prev.area || 0) ? curr : prev
        );

        return {
          id: farmer.id,
          name: farmer.name,
          walletAddress: farmer.walletAddress,
          location: "India",
          farmType: bestField.cropType,
          fields: approvedFields.length,
          totalArea: approvedFields.reduce((sum, f) => sum + f.area, 0),
          credits: balance,
          price,
        };
      })
      .filter((l) => l.credits > 0);
  }, [isSending]);

  const filtered = listings
    .filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.farmType.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      priceSort === "low-to-high" ? a.price - b.price : b.price - a.price
    );

  const openDialog = (listing: Listing) => {
    if (!currentUser) {
      toast.error("Please login to buy credits.");
      return;
    }
    if (currentUser.id === listing.id) {
      toast.error("You cannot buy your own credits.");
      return;
    }
    setSelectedListing(listing);
    setBuyAmountStr("1");
  };

  const handleSendRequest = async () => {
    if (!selectedListing || !currentUser) return;
    const buyAmount = parseFloat(buyAmountStr);
    if (isNaN(buyAmount) || buyAmount <= 0 || buyAmount > selectedListing.credits) {
      toast.error(`Enter an amount between 0 and ${selectedListing.credits}`);
      return;
    }

    setIsSending(true);
    try {
      // Simulate small network delay
      await new Promise((res) => setTimeout(res, 800));

      purchaseService.create({
        farmerId: selectedListing.id,
        farmerName: selectedListing.name,
        farmerWallet: selectedListing.walletAddress,
        businessId: currentUser.id,
        businessName: currentUser.name,
        businessWallet: currentUser.walletAddress,
        amount: parseFloat(buyAmountStr),
        pricePerCredit: selectedListing.price,
      });

      toast.success(`Request sent to ${selectedListing.name}!`, {
        description: `Awaiting farmer's approval for ${buyAmountStr} CR.`,
      });
      setSelectedListing(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
        {t("कार्बन क्रेडिट मार्केटप्लेस", "Carbon Credit Marketplace")}
      </h1>
      <p className="text-center text-green-600/60 text-sm mb-8 font-medium">
        Live listings from verified HaritSetu farmers
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder={t("किसान या फसल के प्रकार से खोजें...", "Search by farmer or crop type...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-green-100"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        </div>
        <div className="w-full md:w-56">
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="rounded-xl border-green-100">
              <SelectValue placeholder={t("मूल्य द्वारा क्रमबद्ध", "Sort by price")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low-to-high">{t("मूल्य: कम से अधिक", "Price: Low to High")}</SelectItem>
              <SelectItem value="high-to-low">{t("मूल्य: अधिक से कम", "Price: High to Low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <PackageOpen className="w-14 h-14 text-green-200" />
          <div>
            <p className="text-lg font-bold text-green-800">No listings yet</p>
            <p className="text-sm text-green-600/50 mt-1">
              Credits appear here once an admin approves a farmer's field.
            </p>
          </div>
        </div>
      )}

      {/* Listing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((listing) => (
          <Card
            key={listing.id}
            className="overflow-hidden border border-green-100 shadow-lg shadow-green-900/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400" />
            <CardHeader className="bg-green-50/50 flex flex-row items-center gap-3 pb-4">
              <Avatar className="w-11 h-11 border-2 border-green-100">
                <AvatarFallback className="bg-green-600 text-white font-bold text-lg">
                  {listing.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base text-green-900">{listing.name}</CardTitle>
                <CardDescription className="text-xs">{listing.location}</CardDescription>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-700 border-none text-[10px] font-bold px-2">
                VERIFIED
              </Badge>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="flex items-center gap-1 border-green-100 text-green-700">
                  <Leaf className="h-3 w-3" />
                  {listing.farmType}
                </Badge>
                <span className="text-xs text-green-600/60 font-medium">
                  {listing.fields} field{listing.fields !== 1 ? "s" : ""} · {listing.totalArea.toFixed(1)} ha
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-green-700">
                    {currencySymbol}{listing.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-green-600/60">/ credit</span>
                </div>
                <span className="text-sm font-bold text-green-800">
                  {listing.credits} CR available
                </span>
              </div>
              <div className="text-xs text-green-600/50 font-medium">
                Total value: {currencySymbol}{(listing.credits * listing.price).toLocaleString("en-IN")}
              </div>
            </CardContent>

            <CardFooter className="bg-white pt-2 pb-4">
              <Button
                className="w-full bg-green-700 hover:bg-green-800 font-bold rounded-xl py-5 shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                onClick={() => openDialog(listing)}
              >
                <ShoppingCart className="h-4 w-4" />
                {t("क्रेडिट खरीदें", "Buy Credits")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ─── Buy Dialog ─── */}
      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-900 text-xl font-black">
              Buy Carbon Credits
            </DialogTitle>
            <DialogDescription className="text-green-700/70">
              from <span className="font-bold text-green-800">{selectedListing?.name}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <div className="space-y-5 py-2">
              {/* Farmer info */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <Avatar className="w-10 h-10 border-2 border-green-200">
                  <AvatarFallback className="bg-green-600 text-white font-bold">
                    {selectedListing.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-green-900 text-sm">{selectedListing.name}</p>
                  <p className="text-xs text-green-600/60">
                    {selectedListing.credits} CR available · {selectedListing.farmType}
                  </p>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-2">
                <Label className="text-green-800 font-bold">
                  Number of Credits to Buy
                  <span className="text-green-500 font-normal ml-2">
                    (max {selectedListing.credits})
                  </span>
                </Label>
                <Input
                  type="number"
                  step="any"
                  min={0}
                  max={selectedListing.credits}
                  value={buyAmountStr}
                  onChange={(e) => setBuyAmountStr(e.target.value)}
                  placeholder={`0 – ${selectedListing.credits}`}
                  className="rounded-xl border-green-200 text-lg font-bold text-center"
                />
              </div>

              {/* Cost summary */}
              <div className="bg-green-50 rounded-xl p-4 space-y-2 border border-green-100">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Price per credit</span>
                  <span className="font-bold text-green-900">
                    ₹{selectedListing.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Credits requested</span>
                  <span className="font-bold text-green-900">{buyAmountStr || "–"} CR</span>
                </div>
                <div className="h-px bg-green-200 my-1" />
                <div className="flex justify-between">
                  <span className="font-black text-green-900">Total Cost</span>
                  <span className="font-black text-green-700 text-lg">
                    ₹{((parseFloat(buyAmountStr) || 0) * selectedListing.price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Info note */}
              <p className="text-xs text-green-600/60 text-center leading-relaxed">
                ⚡ Credits won't be added immediately. The farmer must first approve your request, then the credits will be transferred to your wallet.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-green-100 text-green-700"
              onClick={() => setSelectedListing(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 font-bold rounded-xl shadow-lg flex items-center gap-2"
              onClick={handleSendRequest}
              disabled={isSending}
            >
              {isSending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> Send Purchase Request</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
