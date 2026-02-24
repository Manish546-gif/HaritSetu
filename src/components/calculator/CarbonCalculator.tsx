import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Car, Leaf, Factory, Tractor } from "lucide-react";
import { calculateTotalCarbonCredits, convertToCarbonCredits, CARBON_CREDIT_PRICE } from "@/utils/carbonCalculator";
import { EVCalculator } from "./EVCalculator";
import { PlantCalculator } from "./PlantCalculator";
import { BiogasCalculator } from "./BiogasCalculator";
import { CattleCalculator } from "./CattleCalculator";
import { CalculationResult } from "./CalculationResult";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

export interface EVData {
  carCount: number;
  tractorCount: number;
  truckCount: number;
}

export interface PlantData {
  treesHectares: number;
  cropRotationHectares: number;
  coverCropsHectares: number;
  agroforestryHectares: number;
}

export interface BiogasData {
  smallPlants: number;
  mediumPlants: number;
  largePlants: number;
  lowVoltageSolar: number;  // Low voltage solar plants (< 100kW)
  mediumVoltageSolar: number;  // Medium voltage solar plants (100kW - 1MW)
  highVoltageSolar: number;  // High voltage solar plants (> 1MW)
}

export interface CattleData {
  cattleCount: number;
  usesImprovedFeed: boolean;
  usesManureManagement: boolean;
  usesRotationalGrazing: boolean;
}

export function CarbonCalculator() {
  const [evData, setEVData] = useState<EVData>({
    carCount: 0,
    tractorCount: 0,
    truckCount: 0
  });
  
  const [plantData, setPlantData] = useState<PlantData>({
    treesHectares: 0,
    cropRotationHectares: 0,
    coverCropsHectares: 0,
    agroforestryHectares: 0
  });
  
  const [biogasData, setBiogasData] = useState<BiogasData>({
    smallPlants: 0,
    mediumPlants: 0,
    largePlants: 0,
    lowVoltageSolar: 0,
    mediumVoltageSolar: 0,
    highVoltageSolar: 0
  });
  
  const [cattleData, setCattleData] = useState<CattleData>({
    cattleCount: 0,
    usesImprovedFeed: false,
    usesManureManagement: false,
    usesRotationalGrazing: false
  });
  
  const [totalCarbonCredits, setTotalCarbonCredits] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const calculateCredits = () => {
    const metricTonsCO2 = calculateTotalCarbonCredits(evData, plantData, biogasData, cattleData);
    const credits = convertToCarbonCredits(metricTonsCO2);
    setTotalCarbonCredits(credits);
    setShowResult(true);
  };
  
  const resetCalculator = () => {
    setEVData({ carCount: 0, tractorCount: 0, truckCount: 0 });
    setPlantData({ treesHectares: 0, cropRotationHectares: 0, coverCropsHectares: 0, agroforestryHectares: 0 });
    setBiogasData({ smallPlants: 0, mediumPlants: 0, largePlants: 0, lowVoltageSolar: 0, mediumVoltageSolar: 0, highVoltageSolar: 0 });
    setCattleData({ cattleCount: 0, usesImprovedFeed: false, usesManureManagement: false, usesRotationalGrazing: false });
    setTotalCarbonCredits(null);
    setShowResult(false);
  };
  
  return (
    <div className="w-full px-0 md:px-4">
      {showResult ? (
        <CalculationResult 
          carbonCredits={totalCarbonCredits || 0}
          marketValue={(totalCarbonCredits || 0) * CARBON_CREDIT_PRICE}
          onReset={resetCalculator}
          onSellCredits={() => console.log("Sell credits action")}
        />
      ) : (
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-agro-green text-xl md:text-2xl">
              {t("अपने कार्बन क्रेडिट की गणना करें", "Calculate Your Carbon Credits")}
            </CardTitle>
            <CardDescription>
              {t("अपनी स्थायी प्रथाओं के बारे में जानकारी दर्ज करें ताकि संभावित कार्बन क्रेडिट की गणना की जा सके।", 
                "Enter information about your sustainable practices to calculate potential carbon credits.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ev" className="w-full">
              <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4'} mb-6`}>
                {isMobile ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <TabsTrigger value="ev" className="flex items-center gap-2">
                        <Car className="h-4 w-4" /> {t("ईवी वाहन", "EV Vehicles")}
                      </TabsTrigger>
                      <TabsTrigger value="plants" className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> {t("पौधे और भूमि", "Plants & Land")}
                      </TabsTrigger>
                    </div>
                    <div className="flex flex-col gap-2">
                      <TabsTrigger value="biogas" className="flex items-center gap-2">
                        <Factory className="h-4 w-4" /> {t("बायोगैस और सौर", "Biogas & Solar")}
                      </TabsTrigger>
                      <TabsTrigger value="cattle" className="flex items-center gap-2">
                        <Tractor className="h-4 w-4" /> {t("पशुपालन", "Cattle Farming")}
                      </TabsTrigger>
                    </div>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="ev" className="flex items-center gap-2">
                      <Car className="h-4 w-4" /> {t("ईवी वाहन", "EV Vehicles")}
                    </TabsTrigger>
                    <TabsTrigger value="plants" className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" /> {t("पौधे और भूमि", "Plants & Land")}
                    </TabsTrigger>
                    <TabsTrigger value="biogas" className="flex items-center gap-2">
                      <Factory className="h-4 w-4" /> {t("बायोगैस और सौर", "Biogas & Solar")}
                    </TabsTrigger>
                    <TabsTrigger value="cattle" className="flex items-center gap-2">
                      <Tractor className="h-4 w-4" /> {t("पशुपालन", "Cattle Farming")}
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              
              <TabsContent value="ev">
                <EVCalculator data={evData} onChange={setEVData} />
              </TabsContent>
              
              <TabsContent value="plants">
                <PlantCalculator data={plantData} onChange={setPlantData} />
              </TabsContent>
              
              <TabsContent value="biogas">
                <BiogasCalculator data={biogasData} onChange={setBiogasData} />
              </TabsContent>
              
              <TabsContent value="cattle">
                <CattleCalculator data={cattleData} onChange={setCattleData} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={calculateCredits} 
              className="w-full bg-agro-green hover:bg-agro-green/90"
            >
              {t("कार्बन क्रेडिट की गणना करें", "Calculate Carbon Credits")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
