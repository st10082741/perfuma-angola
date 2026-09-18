import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language } from "./translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.pt;
};
const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

/**
 * Portuguese is the default market language. The visitor's choice is persisted
 * locally so returning customers do not need to select their language again.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("perfuma-language") === "en" ? "en" : "pt",
  );
  useEffect(() => {
    localStorage.setItem("perfuma-language", language);
    document.documentElement.lang = language;
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
