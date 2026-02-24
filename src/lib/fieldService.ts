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
}

export interface CropCarbonData {
    name: string;
    absorptionRate: number; // ton CO2 / hectare / year
    growthCycle: number;    // days
}

export const CROP_DATA: Record<string, CropCarbonData> = {
    "Wheat": { name: "Wheat", absorptionRate: 3.2, growthCycle: 120 },
    "Rice": { name: "Rice", absorptionRate: 2.6, growthCycle: 110 },
    "Sugarcane": { name: "Sugarcane", absorptionRate: 6.5, growthCycle: 360 },
    "Trees": { name: "Trees", absorptionRate: 15.0, growthCycle: 365 },
    "Maize": { name: "Maize", absorptionRate: 2.8, growthCycle: 100 }
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
        // Formula: Area * Rate * (Cycle / 365)
        return Number((area * crop.absorptionRate * (crop.growthCycle / 365)).toFixed(2));
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
