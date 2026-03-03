
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, IndianRupee, Wallet } from "lucide-react";

interface CalculationResultProps {
  carbonCredits: number;
  marketValue: number;
  onReset: () => void;
  onSellCredits: () => void;
}

export function CalculationResult({
  carbonCredits,
  marketValue,
  onReset,
  onSellCredits
}: CalculationResultProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-agro-lightGreen/20">
      <CardHeader className="bg-agro-green/5">
        <CardTitle className="text-agro-green flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          आपके कार्बन क्रेडिट परिणाम
        </CardTitle>
        <CardDescription>
          आपकी स्थायी कृषि प्रथाओं के आधार पर
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-agro-cream to-white rounded-xl p-6 shadow-sm border border-agro-cream/50">
            <h3 className="text-lg font-medium text-agro-green/80 mb-2">अनुमानित कार्बन क्रेडिट</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-agro-green">{carbonCredits.toFixed(6)}</span>
              <span className="text-sm text-agro-green/70 mb-1">क्रेडिट</span>
            </div>
            <p className="text-sm text-agro-green/70 mt-2">
              प्रत्येक क्रेडिट वातावरण से कम या हटाए गए 1 टन CO₂ के बराबर है।
            </p>
          </div>

          <div className="bg-gradient-to-br from-agro-lightGreen/10 to-white rounded-xl p-6 shadow-sm border border-agro-lightGreen/20">
            <h3 className="text-lg font-medium text-agro-green/80 mb-2">अनुमानित बाज़ार मूल्य</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-agro-green">₹{marketValue.toLocaleString('en-IN')}</span>
              <span className="text-sm text-agro-green/70 mb-1">INR</span>
            </div>
            <p className="text-sm text-agro-green/70 mt-2">
              ₹1400 प्रति कार्बन क्रेडिट की वर्तमान बाज़ार दर के आधार पर।
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-agro-wheat/10 rounded-lg border border-agro-wheat/20">
          <h3 className="font-medium text-agro-green mb-2 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            आप अपने कार्बन क्रेडिट के साथ क्या कर सकते हैं
          </h3>
          <ul className="list-disc list-inside space-y-1 text-agro-green/80 text-sm">
            <li>हमारे मार्केटप्लेस पर क्रेडिट बेचें</li>
            <li>भविष्य में मूल्य वृद्धि के लिए क्रेडिट रखें</li>
            <li>अपने खेत को कार्बन-न्यूट्रल या कार्बन-नेगेटिव प्रमाणित करें</li>
            <li>हमारे विकेंद्रीकृत नेटवर्क में अन्य किसानों के साथ क्रेडिट का आदान-प्रदान करें</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto border-agro-green text-agro-green hover:bg-agro-green/5"
        >
          कैलकुलेटर रीसेट करें
        </Button>

        <Button
          onClick={onSellCredits}
          className="w-full sm:w-auto bg-agro-green hover:bg-agro-green/90 flex items-center gap-2"
        >
          <IndianRupee className="h-4 w-4" />
          कार्बन क्रेडिट बेचें
        </Button>
      </CardFooter>
    </Card>
  );
}
