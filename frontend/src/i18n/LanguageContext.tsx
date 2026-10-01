import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { italian } from './translations';

export type Language = 'en' | 'it';
const storageKey = 'sa-corte-antiga-language';
const LanguageContext = createContext<{
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
} | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem(storageKey) === 'it' ? 'it' : 'en'; }
    catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'it'
      ? 'Sa Corte Antiga — un raffinato soggiorno mediterraneo a Nebida, in Sardegna.'
      : 'Sa Corte Antiga — a refined Mediterranean stay in Nebida, Sardinia.');
    try { localStorage.setItem(storageKey, language); } catch { /* Language switching also works without storage. */ }
  }, [language]);
  const t = (text: string) => {
    if (language === 'en' || !text.trim()) return text;
    const key = text.trim();
    const translation = italian[key];
    if (translation === undefined) {
      if (import.meta.env.DEV) console.error(`Missing Italian translation: ${key}`);
      return text.replace(key, 'Traduzione non disponibile');
    }
    return text.replace(key, translation);
  };
  return <LanguageContext.Provider value={{ language, locale: language === 'it' ? 'it-IT' : 'en-GB', setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage requires LanguageProvider');
  return value;
}
