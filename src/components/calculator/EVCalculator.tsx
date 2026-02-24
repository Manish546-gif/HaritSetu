
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EVData } from "./CarbonCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

interface EVCalculatorProps {
  data: EVData;
  onChange: (data: EVData) => void;
}

export function EVCalculator({ data, onChange }: EVCalculatorProps) {
  const handleChange = (field: keyof EVData, value: number) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} items-center gap-4`}>
          {isMobile ? (
            <div className="space-y-2">
              <Label htmlFor="carCount" className="block text-left">{t("इलेक्ट्रिक कार", "Electric Cars")}</Label>
              <Input
                id="carCount"
                type="number"
                min="0"
                value={data.carCount}
                onChange={(e) => handleChange("carCount", parseInt(e.target.value) || 0)}
              />
            </div>
          ) : (
            <>
              <Label htmlFor="carCount" className="text-right">{t("इलेक्ट्रिक कार", "Electric Cars")}</Label>
              <Input
                id="carCount"
                type="number"
                min="0"
                value={data.carCount}
                onChange={(e) => handleChange("carCount", parseInt(e.target.value) || 0)}
                className="col-span-3"
              />
            </>
          )}
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} items-center gap-4`}>
          {isMobile ? (
            <div className="space-y-2">
              <Label htmlFor="tractorCount" className="block text-left">{t("इलेक्ट्रिक ट्रैक्टर", "Electric Tractors")}</Label>
              <Input
                id="tractorCount"
                type="number"
                min="0"
                value={data.tractorCount}
                onChange={(e) => handleChange("tractorCount", parseInt(e.target.value) || 0)}
              />
            </div>
          ) : (
            <>
              <Label htmlFor="tractorCount" className="text-right">{t("इलेक्ट्रिक ट्रैक्टर", "Electric Tractors")}</Label>
              <Input
                id="tractorCount"
                type="number"
                min="0"
                value={data.tractorCount}
                onChange={(e) => handleChange("tractorCount", parseInt(e.target.value) || 0)}
                className="col-span-3"
              />
            </>
          )}
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} items-center gap-4`}>
          {isMobile ? (
            <div className="space-y-2">
              <Label htmlFor="truckCount" className="block text-left">{t("इलेक्ट्रिक ट्रक", "Electric Trucks")}</Label>
              <Input
                id="truckCount"
                type="number"
                min="0"
                value={data.truckCount}
                onChange={(e) => handleChange("truckCount", parseInt(e.target.value) || 0)}
              />
            </div>
          ) : (
            <>
              <Label htmlFor="truckCount" className="text-right">{t("इलेक्ट्रिक ट्रक", "Electric Trucks")}</Label>
              <Input
                id="truckCount"
                type="number"
                min="0"
                value={data.truckCount}
                onChange={(e) => handleChange("truckCount", parseInt(e.target.value) || 0)}
                className="col-span-3"
              />
            </>
          )}
        </div>
      </div>
      
      <div className="bg-agro-cream/20 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">{t("इलेक्ट्रिक वाहन लाभ:", "Electric Vehicle Benefits:")}</p>
        <ul className="list-disc list-inside space-y-1 text-agro-green">
          <li>{t("इलेक्ट्रिक कार प्रति वर्ष लगभग 2.3 मीट्रिक टन CO₂ बचाती है", "Electric cars save approximately 2.3 metric tons of CO₂ per year")}</li>
          <li>{t("इलेक्ट्रिक ट्रैक्टर प्रति वर्ष लगभग 4.8 मीट्रिक टन CO₂ बचाते हैं", "Electric tractors save approximately 4.8 metric tons of CO₂ per year")}</li>
          <li>{t("इलेक्ट्रिक ट्रक प्रति वर्ष लगभग 5.2 मीट्रिक टन CO₂ बचाते हैं", "Electric trucks save approximately 5.2 metric tons of CO₂ per year")}</li>
        </ul>
      </div>
    </div>
  );
}
