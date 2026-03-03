import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  IndianRupee,
  TrendingUp,
  History,
  ArrowLeftRight,
  ShoppingCart,
  Send,
  Languages,
  Plus,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useWeb3 } from "@/context/Web3Context";
import { ledgerService, Transaction } from "@/lib/ledger";
import { authService } from "@/lib/auth";

export function CarbonWallet() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t, currencySymbol } = useLanguage();
  const { address, isConnected, connect } = useWeb3();
  const user = authService.getCurrentUser();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      const addr = user.walletAddress;
      setBalance(ledgerService.getWalletBalance(addr));
      setTransactions(ledgerService.getTransactions().filter(tx => tx.to === addr || tx.from === addr));
    }
  }, [user]);

  const WALLET_VALUE = balance * 1400;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-agro-green mb-8 text-center">
        {t("कार्बन क्रेडिट वॉलेट", "Carbon Credit Wallet")}
      </h1>

      <Tabs
        defaultValue="overview"
        className="w-full max-w-5xl mx-auto"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> {t("अवलोकन", "Overview")}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" /> {t("लेन-देन", "Transactions")}
          </TabsTrigger>
          <TabsTrigger value="trade" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" /> {t("व्यापार", "Trade")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-agro-lightGreen/20">
            <CardHeader className="bg-agro-green/5">
              <CardTitle className="text-agro-green flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {t("वॉलेट अवलोकन", "Wallet Overview")}
              </CardTitle>
              <CardDescription>
                {t(
                  "आपका कार्बन क्रेडिट बैलेंस और पोर्टफोलियो मूल्य",
                  "Your carbon credit balance and portfolio value"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-agro-cream to-white rounded-xl p-6 shadow-sm border border-agro-cream/50">
                  <h3 className="text-lg font-medium text-agro-green/80 mb-2">{t("वर्तमान बैलेंस", "Current Balance")}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-agro-green">{balance.toFixed(6)}</span>
                    <span className="text-sm text-agro-green/70 mb-1">{t("क्रेडिट", "credits")}</span>
                  </div>
                  <p className="text-sm text-agro-green/70 mt-2">
                    {t(
                      "प्रत्येक क्रेडिट 1 टन CO₂ के बराबर है।",
                      "Each credit equals 1 tonne of CO₂."
                    )}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-agro-lightGreen/10 to-white rounded-xl p-6 shadow-sm border border-agro-lightGreen/20">
                  <h3 className="text-lg font-medium text-agro-green/80 mb-2">{t("पोर्टफोलियो मूल्य", "Portfolio Value")}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-agro-green">{currencySymbol}{WALLET_VALUE.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-agro-green/70 mb-1">INR</span>
                  </div>
                  <p className="text-sm text-agro-green/70 mt-2">
                    {t(
                      `₹1400 प्रति कार्बन क्रेडिट की वर्तमान बाज़ार दर के आधार पर।`,
                      `Based on current market rate of ₹1400 per carbon credit.`
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-agro-wheat/10 rounded-lg border border-agro-wheat/20">
                <h3 className="font-medium text-agro-green mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("बाज़ार अंतर्दृष्टि", "Market Insights")}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-agro-green/80 text-sm">
                  <li>{t("वर्तमान बाज़ार मूल्य बढ़ रहा है: इस महीने +5%", "Current market price is rising: +5% this month")}</li>
                  <li>{t("टेक सेक्टर कंपनियों से उच्च मांग", "High demand from tech sector companies")}</li>
                  <li>{t("बाज़ार पूर्वानुमान Q3 तक निरंतर विकास का अनुमान लगाता है", "Market forecast predicts continued growth through Q3")}</li>
                  <li>{t("सत्यापित कृषि क्रेडिट 10% प्रीमियम का दावा करते हैं", "Verified agricultural credits command a 10% premium")}</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("transactions")}
                className="w-full sm:w-auto border-agro-green text-agro-green hover:bg-agro-green/5"
              >
                <History className="h-4 w-4 mr-2" />
                {t("लेन-देन देखें", "View Transactions")}
              </Button>

              <Button
                onClick={() => setActiveTab("trade")}
                className="w-full sm:w-auto bg-agro-green hover:bg-agro-green/90 flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                {t("क्रेडिट्स का व्यापार करें", "Trade Credits")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-agro-lightGreen/20">
            <CardHeader className="bg-agro-green/5">
              <CardTitle className="text-agro-green flex items-center gap-2">
                <History className="h-5 w-5" />
                {t("लेन-देन इतिहास", "Transaction History")}
              </CardTitle>
              <CardDescription>
                {t("आपके कार्बन क्रेडिट लेनदेन का रिकॉर्ड", "Record of your carbon credit transactions")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("तारीख", "Date")}</TableHead>
                    <TableHead>{t("प्रकार", "Type")}</TableHead>
                    <TableHead>{t("राशि", "Amount")}</TableHead>
                    <TableHead>{t("मूल्य (INR)", "Value")}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{tx.amount.toFixed(6)} CR</TableCell>
                      <TableCell>{currencySymbol}{(tx.amount * 1400).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">{tx.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <button className="text-[10px] font-mono hover:text-green-600 flex items-center gap-1">
                          {tx.hash.slice(0, 10)}... <ExternalLink className="w-3 h-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trade">
          <Card className="border-agro-lightGreen/20">
            <CardHeader className="bg-agro-green/5">
              <CardTitle className="text-agro-green flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                {t("कार्बन क्रेडिट्स का व्यापार करें", "Trade Carbon Credits")}
              </CardTitle>
              <CardDescription>
                {t("मार्केटप्लेस में कार्बन क्रेडिट्स खरीदें या बेचें", "Buy or sell carbon credits in the marketplace")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border border-agro-lightGreen/20">
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-agro-green">
                      <ShoppingCart className="h-5 w-5" />
                      {t("क्रेडिट्स खरीदें", "Buy Credits")}
                    </CardTitle>
                    <CardDescription>{t("सत्यापित किसानों से खरीदें", "Buy from verified farmers")}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-agro-green/80 mb-4">
                      {t(
                        "सत्यापित स्थायी किसानों से कार्बन क्रेडिट खोजने के लिए हमारे मार्केटप्लेस ब्राउज़ करें।",
                        "Browse our marketplace to find carbon credits from verified sustainable farmers."
                      )}
                    </p>
                    <Button
                      className="w-full bg-agro-green hover:bg-agro-green/90"
                      onClick={() => window.location.href = '/marketplace'}
                    >
                      {t("मार्केटप्लेस पर जाएँ", "Go to Marketplace")}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-agro-lightGreen/20">
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-agro-green">
                      <Send className="h-5 w-5" />
                      {t("क्रेडिट्स बेचें", "Sell Credits")}
                    </CardTitle>
                    <CardDescription>{t("व्यवसायों को क्रेडिट्स बेचें", "Sell credits to businesses")}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-agro-green/80 mb-4">
                      {t(
                        "अपने कार्बन फुटप्रिंट को ऑफसेट करने के लिए व्यवसायों के लिए अपने कार्बन क्रेडिट सूचीबद्ध करें।",
                        "List your carbon credits for businesses looking to offset their carbon footprint."
                      )}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-agro-green text-agro-green hover:bg-agro-green/5"
                    >
                      {t("बिक्री के लिए क्रेडिट्स सूचीबद्ध करें", "List Credits for Sale")}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-5 bg-agro-cream/10 rounded-lg border border-agro-cream/20">
                <h3 className="font-medium text-agro-green mb-3">{t("व्यापार जानकारी", "Trading Information")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1 text-agro-green/90">{t("वर्तमान बाज़ार मूल्य", "Current Market Price")}</p>
                    <p className="text-agro-green/80">{currencySymbol}1,400 {t("प्रति कार्बन क्रेडिट", "per carbon credit")}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-agro-green/90">{t("आपका व्यापार बैलेंस", "Your Trading Balance")}</p>
                    <p className="text-agro-green/80">{balance.toFixed(6)} {t("क्रेडिट्स उपलब्ध", "credits available")}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-agro-green/90">{t("लेनदेन शुल्क", "Transaction Fee")}</p>
                    <p className="text-agro-green/80">{t("प्रति लेनदेन 2%", "2% per transaction")}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1 text-agro-green/90">{t("निपटान समय", "Settlement Time")}</p>
                    <p className="text-agro-green/80">{t("हमारे विकेंद्रीकृत नेटवर्क पर तत्काल", "Immediate on our decentralized network")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
