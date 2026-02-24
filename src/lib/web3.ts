import { ethers } from "ethers";
import { ledgerService } from "./ledger";

// Mock ABI for Carbon Credit Contract (HSETU)
export const CARBON_CREDIT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function mint(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)",
    "event CreditMinted(address indexed account, uint256 amount)"
];

const CONTRACT_ADDRESS = "0x7476717a54a72d32616231d616231d616231d616"; // Placeholder

export const web3Service = {
    getProvider: () => {
        if (typeof window !== "undefined" && window.ethereum) {
            return new ethers.BrowserProvider(window.ethereum);
        }
        return null;
    },

    connectWallet: async () => {
        const provider = web3Service.getProvider();
        if (!provider) throw new Error("MetaMask not detected. Please install the extension.");

        // Request accounts
        let accounts;
        try {
            accounts = await provider.send("eth_requestAccounts", []);
        } catch (err: any) {
            if (err.code === 4001) throw new Error("Connection request was rejected by user.");
            throw err;
        }

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        return { address, signer };
    },

    getContract: async () => {
        const provider = web3Service.getProvider();
        if (!provider) return null;
        const signer = await provider.getSigner();
        return new ethers.Contract(CONTRACT_ADDRESS, CARBON_CREDIT_ABI, signer);
    },

    // Simulated Blockchain Transaction
    mintCredits: async (amount: number, userAddress: string): Promise<{ hash: string }> => {
        console.log(`Minting ${amount} credits on-chain...`);
        // Simulate block time
        await new Promise(resolve => setTimeout(resolve, 2500));

        const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        // Record in ledger
        await ledgerService.addTransaction("SYSTEM", userAddress, amount, "ISSUE");

        return { hash };
    },

    buyCredits: async (amount: number, userAddress: string): Promise<{ hash: string }> => {
        console.log(`Sending ${amount * 2075} tokens to MarketPool...`);
        // Simulate block time
        await new Promise(resolve => setTimeout(resolve, 3000));

        const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        // Record in ledger
        await ledgerService.addTransaction("SYSTEM", userAddress, amount, "BUY");

        return { hash };
    }
};
