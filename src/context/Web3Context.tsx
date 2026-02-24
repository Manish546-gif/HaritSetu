import React, { createContext, useContext, useState, useEffect } from "react";
import { web3Service } from "@/lib/web3";
import { toast } from "sonner";

interface Web3ContextType {
    address: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = async () => {
        setIsConnecting(true);
        try {
            const { address } = await web3Service.connectWallet();
            setAddress(address);
            toast.success("Wallet connected: " + address.slice(0, 6) + "..." + address.slice(-4));
        } catch (error: any) {
            console.error("Connection failed", error);
            const message = error?.message || "Check if MetaMask is installed";
            toast.error("Connection Failed", { description: message });
            throw error;
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setAddress(null);
        toast.info("Wallet disconnected");
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            // Handle account changes
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    toast.success("Account switched: " + accounts[0].slice(0, 6) + "...");
                } else {
                    setAddress(null);
                    toast.info("Wallet disconnected from MetaMask");
                }
            });

            // Handle chain changes
            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{ address, isConnected: !!address, connect, disconnect, isConnecting }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
    return context;
};
