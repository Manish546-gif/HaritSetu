export type FieldStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Field {
    id: string;
    farmerId: string;
    nickname: string;
    polygon: [number, number][]; // Lat, Lng pairs
    area: number;                // In hectares
    cropType: string;
    status: FieldStatus;
    createdAt: number;
    creditsGenerated?: number;
    images?: string[];           // Field photos for verification
}

export interface CropCarbonData {
    name: string;
    absorptionRate: number; // ton CO2 / hectare / year
    growthCycle: number;    // days
}

export const CROP_DATA: Record<string, CropCarbonData> = {
    "Rice (Paddy)": { name: "Rice (Paddy)", absorptionRate: 4.25, growthCycle: 130 },
    "Wheat": { name: "Wheat", absorptionRate: 3.0, growthCycle: 130 },
    "Maize (Corn)": { name: "Maize (Corn)", absorptionRate: 3.5, growthCycle: 105 },
    "Sugarcane": { name: "Sugarcane", absorptionRate: 15.0, growthCycle: 365 },
    "Cotton": { name: "Cotton", absorptionRate: 4.0, growthCycle: 165 },
    "Soybean": { name: "Soybean", absorptionRate: 2.5, growthCycle: 100 },
    "Mustard": { name: "Mustard", absorptionRate: 2.0, growthCycle: 120 },
    "Potato": { name: "Potato", absorptionRate: 2.5, growthCycle: 100 },
    "Vegetables": { name: "Vegetables", absorptionRate: 1.5, growthCycle: 75 },
    "Millets": { name: "Millets", absorptionRate: 2.5, growthCycle: 90 },
    "Agroforestry": { name: "Agroforestry", absorptionRate: 16.5, growthCycle: 365 }
};

const FIELDS_KEY = "haritsetu_fields";

export const fieldService = {
    getFields: (): Field[] => {
        const fields = localStorage.getItem(FIELDS_KEY);
        return fields ? JSON.parse(fields) : [];
    },

    getFarmerFields: (farmerId: string): Field[] => {
        return fieldService.getFields().filter(f => f.farmerId === farmerId);
    },

    submitField: (field: Omit<Field, "id" | "status" | "createdAt">): Field => {
        const newField: Field = {
            ...field,
            id: Math.random().toString(36).substr(2, 9),
            status: "PENDING",
            createdAt: Date.now()
        };
        const fields = fieldService.getFields();
        localStorage.setItem(FIELDS_KEY, JSON.stringify([...fields, newField]));
        return newField;
    },

    calculatePotentialCredits: (area: number, cropType: string): number => {
        const crop = CROP_DATA[cropType];
        if (!crop) return 0;
        // Formula: (Area * Rate * (Cycle / 365))
        // 1 Credit = 1 Tonne standard
        return Number((area * crop.absorptionRate * (crop.growthCycle / 365)).toFixed(6));
    },

    updateFieldStatus: (fieldId: string, status: FieldStatus): Field | null => {
        const fields = fieldService.getFields();
        const index = fields.findIndex(f => f.id === fieldId);
        if (index === -1) return null;

        fields[index].status = status;
        localStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
        return fields[index];
    }
};
