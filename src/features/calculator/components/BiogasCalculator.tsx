import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BiogasData } from "./CarbonCalculator";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";

interface BiogasCalculatorProps {
  data: BiogasData;
  onChange: (data: BiogasData) => void;
}

export function BiogasCalculator({ data, onChange }: BiogasCalculatorProps) {
  const { t } = useLanguage();
  
  const handleChange = (field: keyof BiogasData, value: number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <h3 className="font-medium text-agro-green mb-2">{t("बायोगैस प्लांट", "Biogas Plants")}</h3>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="smallPlants" className="text-right">{t("छोटे बायोगैस प्लांट", "Small Biogas Plants")}</Label>
          <Input
            id="smallPlants"
            type="number"
            min="0"
            value={data.smallPlants}
            onChange={(e) => handleChange("smallPlants", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mediumPlants" className="text-right">{t("मध्यम बायोगैस प्लांट", "Medium Biogas Plants")}</Label>
          <Input
            id="mediumPlants"
            type="number"
            min="0"
            value={data.mediumPlants}
            onChange={(e) => handleChange("mediumPlants", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="largePlants" className="text-right">{t("बड़े बायोगैस प्लांट", "Large Biogas Plants")}</Label>
          <Input
            id="largePlants"
            type="number"
            min="0"
            value={data.largePlants}
            onChange={(e) => handleChange("largePlants", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>

        <Separator className="my-4" />
        
        <h3 className="font-medium text-agro-green mb-2">{t("सौर ऊर्जा प्लांट", "Solar Power Plants")}</h3>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lowVoltageSolar" className="text-right">{t("कम वोल्टेज सौर प्लांट", "Low Voltage Solar Plants")}</Label>
          <Input
            id="lowVoltageSolar"
            type="number"
            min="0"
            value={data.lowVoltageSolar}
            onChange={(e) => handleChange("lowVoltageSolar", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mediumVoltageSolar" className="text-right">{t("मध्यम वोल्टेज सौर प्लांट", "Medium Voltage Solar Plants")}</Label>
          <Input
            id="mediumVoltageSolar"
            type="number"
            min="0"
            value={data.mediumVoltageSolar}
            onChange={(e) => handleChange("mediumVoltageSolar", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="highVoltageSolar" className="text-right">{t("उच्च वोल्टेज सौर प्लांट", "High Voltage Solar Plants")}</Label>
          <Input
            id="highVoltageSolar"
            type="number"
            min="0"
            value={data.highVoltageSolar}
            onChange={(e) => handleChange("highVoltageSolar", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
      </div>
      
      <div className="bg-agro-cream/20 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">{t("कार्बन बचत लाभ:", "Carbon Saving Benefits:")}</p>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">{t("बायोगैस प्लांट:", "Biogas Plants:")}</p>
            <ul className="list-disc list-inside space-y-1 text-agro-green">
              <li>{t("छोटे बायोगैस प्लांट प्रति वर्ष लगभग 18 मीट्रिक टन CO₂ बचाते हैं", "Small biogas plants save approximately 18 metric tons of CO₂ per year")}</li>
              <li>{t("मध्यम बायोगैस प्लांट प्रति वर्ष लगभग 48 मीट्रिक टन CO₂ बचाते हैं", "Medium biogas plants save approximately 48 metric tons of CO₂ per year")}</li>
              <li>{t("बड़े बायोगैस प्लांट प्रति वर्ष लगभग 120 मीट्रिक टन CO₂ बचाते हैं", "Large biogas plants save approximately 120 metric tons of CO₂ per year")}</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium mb-1">{t("सौर ऊर्जा प्लांट:", "Solar Power Plants:")}</p>
            <ul className="list-disc list-inside space-y-1 text-agro-green">
              <li>{t("कम वोल्टेज सौर प्लांट (<100kW) प्रति वर्ष लगभग 35 मीट्रिक टन CO₂ बचाते हैं", "Low voltage solar plants (<100kW) save approximately 35 metric tons of CO₂ per year")}</li>
              <li>{t("मध्यम वोल्टेज सौर प्लांट (100kW - 1MW) प्रति वर्ष लगभग 85 मीट्रिक टन CO₂ बचाते हैं", "Medium voltage solar plants (100kW - 1MW) save approximately 85 metric tons of CO₂ per year")}</li>
              <li>{t("उच्च वोल्टेज सौर प्लांट (>1MW) प्रति वर्ष लगभग 200 मीट्रिक टन CO₂ बचाते हैं", "High voltage solar plants (>1MW) save approximately 200 metric tons of CO₂ per year")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
