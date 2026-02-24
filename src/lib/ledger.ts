export interface Transaction {
    id: string;
    from: string; // Wallet address or "SYSTEM"
    to: string;   // Wallet address
    amount: number;
    type: "EARN" | "BUY" | "SELL" | "BURN" | "ISSUE";
    timestamp: number;
    hash: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
}

const LEDGER_KEY = "haritsetu_ledger";
const WALLETS_KEY = "haritsetu_wallets";

export const ledgerService = {
    getTransactions: (): Transaction[] => {
        const txs = localStorage.getItem(LEDGER_KEY);
        return txs ? JSON.parse(txs) : [];
    },

    getWalletBalance: (address: string): number => {
        const wallets = JSON.parse(localStorage.getItem(WALLETS_KEY) || "{}");
        return wallets[address] || 0;
    },

    updateBalance: (address: string, amount: number) => {
        const wallets = JSON.parse(localStorage.getItem(WALLETS_KEY) || "{}");
        wallets[address] = (wallets[address] || 0) + amount;
        localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
    },

    addTransaction: async (from: string, to: string, amount: number, type: Transaction["type"]): Promise<Transaction> => {
        const tx: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            from,
            to,
            amount,
            type,
            timestamp: Date.now(),
            hash: "SHA256-" + Math.random().toString(36).substr(2, 32), // Mock hash
            status: "COMPLETED"
        };

        // Update balances
        if (from !== "SYSTEM") {
            ledgerService.updateBalance(from, -amount);
        }
        ledgerService.updateBalance(to, amount);

        const txs = ledgerService.getTransactions();
        localStorage.setItem(LEDGER_KEY, JSON.stringify([tx, ...txs]));

        return tx;
    }
};
