"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ko" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ko: string, en: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved === "ko" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (ko: string, en: string) => {
    return language === "ko" ? ko : en;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
