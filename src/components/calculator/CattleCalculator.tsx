
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CattleData } from "./CarbonCalculator";

interface CattleCalculatorProps {
  data: CattleData;
  onChange: (data: CattleData) => void;
}

export function CattleCalculator({ data, onChange }: CattleCalculatorProps) {
  const handleChange = (field: keyof CattleData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cattleCount" className="text-right">Number of Cattle</Label>
          <Input
            id="cattleCount"
            type="number"
            min="0"
            value={data.cattleCount}
            onChange={(e) => handleChange("cattleCount", parseInt(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-right">Improved Feed</div>
          <div className="flex items-center space-x-2 col-span-3">
            <Checkbox 
              id="usesImprovedFeed" 
              checked={data.usesImprovedFeed}
              onCheckedChange={(checked) => handleChange("usesImprovedFeed", checked === true)}
            />
            <Label htmlFor="usesImprovedFeed">Using improved feed formulations</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-right">Manure Management</div>
          <div className="flex items-center space-x-2 col-span-3">
            <Checkbox 
              id="usesManureManagement" 
              checked={data.usesManureManagement}
              onCheckedChange={(checked) => handleChange("usesManureManagement", checked === true)}
            />
            <Label htmlFor="usesManureManagement">Using better manure management systems</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-right">Rotational Grazing</div>
          <div className="flex items-center space-x-2 col-span-3">
            <Checkbox 
              id="usesRotationalGrazing" 
              checked={data.usesRotationalGrazing}
              onCheckedChange={(checked) => handleChange("usesRotationalGrazing", checked === true)}
            />
            <Label htmlFor="usesRotationalGrazing">Using rotational grazing practices</Label>
          </div>
        </div>
      </div>
      
      <div className="bg-agro-cream/20 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">Cattle Farming Practice Benefits (per 100 cattle):</p>
        <ul className="list-disc list-inside space-y-1 text-agro-green">
          <li>Improved feed formulations reduce approximately 25 metric tons of CO₂</li>
          <li>Better manure management reduces approximately 18 metric tons of CO₂</li>
          <li>Rotational grazing reduces approximately 15 metric tons of CO₂</li>
        </ul>
      </div>
    </div>
  );
}
