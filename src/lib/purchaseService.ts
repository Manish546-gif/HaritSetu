// Purchase request lifecycle: Business → PENDING → Farmer approves/rejects → credits transfer

export type PurchaseStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PurchaseRequest {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerWallet: string;
    businessId: string;
    businessName: string;
    businessWallet: string;
    amount: number;          // Number of credits requested
    pricePerCredit: number;  // INR
    status: PurchaseStatus;
    createdAt: number;
    resolvedAt?: number;
    txHash?: string;
}

const PURCHASE_KEY = "haritsetu_purchase_requests";

export const purchaseService = {
    getAll: (): PurchaseRequest[] => {
        const data = localStorage.getItem(PURCHASE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /** Get all pending requests for a specific farmer */
    getForFarmer: (farmerId: string): PurchaseRequest[] =>
        purchaseService.getAll().filter(r => r.farmerId === farmerId),

    /** Get all requests made by a specific business */
    getForBusiness: (businessId: string): PurchaseRequest[] =>
        purchaseService.getAll().filter(r => r.businessId === businessId),

    /** Business creates a new purchase request */
    create: (req: Omit<PurchaseRequest, "id" | "status" | "createdAt">): PurchaseRequest => {
        const newReq: PurchaseRequest = {
            ...req,
            id: Math.random().toString(36).substr(2, 9),
            status: "PENDING",
            createdAt: Date.now(),
        };
        const all = purchaseService.getAll();
        localStorage.setItem(PURCHASE_KEY, JSON.stringify([newReq, ...all]));
        return newReq;
    },

    /** Farmer approves or rejects a request */
    resolve: (id: string, status: "APPROVED" | "REJECTED", txHash?: string): PurchaseRequest | null => {
        const all = purchaseService.getAll();
        const index = all.findIndex(r => r.id === id);
        if (index === -1) return null;
        all[index] = { ...all[index], status, resolvedAt: Date.now(), txHash };
        localStorage.setItem(PURCHASE_KEY, JSON.stringify(all));
        return all[index];
    },
};
