// Carbon credit calculation factors (simplified for demonstration)
export const CARBON_FACTORS = {
  // Electric vehicles (metric tons CO2 avoided per year)
  ev: {
    car: 2.3,     // Average car saves 2.3 metric tons CO2/year vs. gas
    tractor: 4.8,  // Farm tractor
    truck: 5.2     // Medium-duty truck
  },
  // Plants (metric tons CO2 sequestered per year per hectare)
  plants: {
    trees: 7.5,      // Forest trees
    cropRotation: 3.2, // Crop rotation practice
    coverCrops: 2.8,   // Cover crops
    agroforestry: 6.5  // Agroforestry
  },
  // Biogas and Solar (metric tons CO2 avoided per unit per year)
  biogas: {
    smallPlant: 18,   // Small biogas plant
    mediumPlant: 48,  // Medium biogas plant
    largePlant: 120,  // Large industrial biogas plant
    lowVoltageSolar: 35,    // Low voltage solar (< 100kW)
    mediumVoltageSolar: 85,  // Medium voltage solar (100kW - 1MW)
    highVoltageSolar: 200    // High voltage solar (> 1MW)
  },
  // Cattle farming practices (metric tons CO2 reduced per 100 cattle)
  cattle: {
    improvedFeed: 25,     // Improved feed formulations
    manureManagement: 18, // Better manure management
    rotationalGrazing: 15 // Rotational grazing practices
  }
};

// Calculate carbon credits for electric vehicles
export function calculateEVCredits(
  carCount: number,
  tractorCount: number,
  truckCount: number
): number {
  return (
    carCount * CARBON_FACTORS.ev.car +
    tractorCount * CARBON_FACTORS.ev.tractor +
    truckCount * CARBON_FACTORS.ev.truck
  );
}

// Calculate carbon credits for plants and agriculture
export function calculatePlantCredits(
  treesHectares: number,
  cropRotationHectares: number,
  coverCropsHectares: number,
  agroforestryHectares: number
): number {
  return (
    treesHectares * CARBON_FACTORS.plants.trees +
    cropRotationHectares * CARBON_FACTORS.plants.cropRotation +
    coverCropsHectares * CARBON_FACTORS.plants.coverCrops +
    agroforestryHectares * CARBON_FACTORS.plants.agroforestry
  );
}

// Calculate carbon credits for biogas and solar production
export function calculateBiogasCredits(
  smallPlants: number,
  mediumPlants: number,
  largePlants: number,
  lowVoltageSolar: number,
  mediumVoltageSolar: number,
  highVoltageSolar: number
): number {
  return (
    smallPlants * CARBON_FACTORS.biogas.smallPlant +
    mediumPlants * CARBON_FACTORS.biogas.mediumPlant +
    largePlants * CARBON_FACTORS.biogas.largePlant +
    lowVoltageSolar * CARBON_FACTORS.biogas.lowVoltageSolar +
    mediumVoltageSolar * CARBON_FACTORS.biogas.mediumVoltageSolar +
    highVoltageSolar * CARBON_FACTORS.biogas.highVoltageSolar
  );
}

// Calculate carbon credits for cattle farming
export function calculateCattleCredits(
  cattleCount: number,
  usesImprovedFeed: boolean,
  usesManureManagement: boolean,
  usesRotationalGrazing: boolean
): number {
  const cattleHundreds = cattleCount / 100;
  let credits = 0;

  if (usesImprovedFeed) {
    credits += cattleHundreds * CARBON_FACTORS.cattle.improvedFeed;
  }

  if (usesManureManagement) {
    credits += cattleHundreds * CARBON_FACTORS.cattle.manureManagement;
  }

  if (usesRotationalGrazing) {
    credits += cattleHundreds * CARBON_FACTORS.cattle.rotationalGrazing;
  }

  return credits;
}

// Calculate total carbon credits
export function calculateTotalCarbonCredits(
  evData: {
    carCount: number;
    tractorCount: number;
    truckCount: number;
  },
  plantData: {
    treesHectares: number;
    cropRotationHectares: number;
    coverCropsHectares: number;
    agroforestryHectares: number;
  },
  biogasData: {
    smallPlants: number;
    mediumPlants: number;
    largePlants: number;
    lowVoltageSolar: number;
    mediumVoltageSolar: number;
    highVoltageSolar: number;
  },
  cattleData: {
    cattleCount: number;
    usesImprovedFeed: boolean;
    usesManureManagement: boolean;
    usesRotationalGrazing: boolean;
  }
): number {
  const evCredits = calculateEVCredits(
    evData.carCount,
    evData.tractorCount,
    evData.truckCount
  );

  const plantCredits = calculatePlantCredits(
    plantData.treesHectares,
    plantData.cropRotationHectares,
    plantData.coverCropsHectares,
    plantData.agroforestryHectares
  );

  const biogasCredits = calculateBiogasCredits(
    biogasData.smallPlants,
    biogasData.mediumPlants,
    biogasData.largePlants,
    biogasData.lowVoltageSolar,
    biogasData.mediumVoltageSolar,
    biogasData.highVoltageSolar
  );

  const cattleCredits = calculateCattleCredits(
    cattleData.cattleCount,
    cattleData.usesImprovedFeed,
    cattleData.usesManureManagement,
    cattleData.usesRotationalGrazing
  );

  return evCredits + plantCredits + biogasCredits + cattleCredits;
}

// Convert metric tons of CO2 to carbon credits (1 Credit = 1 Tonne CO2)
export function convertToCarbonCredits(metricTonsCO2: number): number {
  // 1 CR = 1 Tonne
  return metricTonsCO2;
}

// Current market price of carbon credits (in INR per credit)
export const CARBON_CREDIT_PRICE = 1400; // ₹1400 per credit
