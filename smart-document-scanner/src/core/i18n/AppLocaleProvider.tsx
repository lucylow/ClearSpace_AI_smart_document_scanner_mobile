import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppLanguage, clearLanguagePreference, loadLanguagePreference, normalizeAppLanguage, resolveAppLocale, saveLanguagePreference } from './localePreference';

type AppLocaleContextValue = {
  language: AppLanguage;
  locale: string;
  preference: AppLanguage | null;
  hydrated: boolean;
  setLanguage: (language: AppLanguage | null) => Promise<void>;
};

const AppLocaleContext = createContext<AppLocaleContextValue | null>(null);

export function AppLocaleProvider({ children }: { children: React.ReactNode }) {
  const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const [preference, setPreference] = useState<AppLanguage | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    void loadLanguagePreference().then((value) => {
      if (mounted) {
        setPreference(value);
        setHydrated(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  const setLanguage = useCallback(async (language: AppLanguage | null) => {
    const normalized = normalizeAppLanguage(language);
    if (normalized) await saveLanguagePreference(normalized);
    else await clearLanguagePreference();
    setPreference(normalized);
  }, []);

  const value = useMemo<AppLocaleContextValue>(() => {
    const locale = resolveAppLocale(preference, deviceLocale);
    return { language: normalizeAppLanguage(locale) ?? 'en', locale, preference, hydrated, setLanguage };
  }, [deviceLocale, hydrated, preference, setLanguage]);

  return <AppLocaleContext.Provider value={value}>{children}</AppLocaleContext.Provider>;
}

export function useAppLocale() {
  const context = useContext(AppLocaleContext);
  if (!context) throw new Error('useAppLocale must be used within AppLocaleProvider');
  return context;
}
