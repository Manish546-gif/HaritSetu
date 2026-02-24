import { createContext, useContext, useState, ReactNode } from "react";

type Language = "hindi" | "english";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (hindiText: string, englishText: string) => string;
  currencySymbol: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("english");

  // Simple translation function
  const t = (hindiText: string, englishText: string) => {
    return language === "hindi" ? hindiText : englishText;
  };

  // Currency symbol based on language - ₹ for both but we'll keep it separate for potential future changes
  const currencySymbol = "₹";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currencySymbol }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
