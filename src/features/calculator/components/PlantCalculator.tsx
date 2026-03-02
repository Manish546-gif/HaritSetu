
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlantData } from "./CarbonCalculator";

interface PlantCalculatorProps {
  data: PlantData;
  onChange: (data: PlantData) => void;
}

export function PlantCalculator({ data, onChange }: PlantCalculatorProps) {
  const handleChange = (field: keyof PlantData, value: number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="treesHectares" className="text-right">Trees (hectares)</Label>
          <Input
            id="treesHectares"
            type="number"
            min="0"
            step="0.1"
            value={data.treesHectares}
            onChange={(e) => handleChange("treesHectares", parseFloat(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cropRotationHectares" className="text-right">Crop Rotation (hectares)</Label>
          <Input
            id="cropRotationHectares"
            type="number"
            min="0"
            step="0.1"
            value={data.cropRotationHectares}
            onChange={(e) => handleChange("cropRotationHectares", parseFloat(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="coverCropsHectares" className="text-right">Cover Crops (hectares)</Label>
          <Input
            id="coverCropsHectares"
            type="number"
            min="0"
            step="0.1"
            value={data.coverCropsHectares}
            onChange={(e) => handleChange("coverCropsHectares", parseFloat(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="agroforestryHectares" className="text-right">Agroforestry (hectares)</Label>
          <Input
            id="agroforestryHectares"
            type="number"
            min="0"
            step="0.1"
            value={data.agroforestryHectares}
            onChange={(e) => handleChange("agroforestryHectares", parseFloat(e.target.value) || 0)}
            className="col-span-3"
          />
        </div>
      </div>
      
      <div className="bg-agro-cream/20 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">Plant & Land Management Benefits:</p>
        <ul className="list-disc list-inside space-y-1 text-agro-green">
          <li>Trees sequester approximately 7.5 metric tons of CO₂ per hectare yearly</li>
          <li>Crop rotation sequesters approximately 3.2 metric tons of CO₂ per hectare yearly</li>
          <li>Cover crops sequester approximately 2.8 metric tons of CO₂ per hectare yearly</li>
          <li>Agroforestry sequesters approximately 6.5 metric tons of CO₂ per hectare yearly</li>
        </ul>
      </div>
    </div>
  );
}
