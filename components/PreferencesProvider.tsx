"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type Language = "en" | "hi";

interface PreferencesContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const PreferencesContext =
  createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] =
    useState<Language>("en");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("moneyva-theme");

    const savedLanguage =
      localStorage.getItem("moneyva-language");

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      setThemeState(savedTheme);
    }

    if (
      savedLanguage === "en" ||
      savedLanguage === "hi"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "moneyva-theme",
      theme
    );

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    document.documentElement.style.colorScheme =
      theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "moneyva-language",
      language
    );

    document.documentElement.lang =
      language === "hi" ? "hi" : "en";
  }, [language]);

  const setTheme = (value: Theme) => {
    setThemeState(value);
  };

  const setLanguage = (value: Language) => {
    setLanguageState(value);
  };

  const toggleTheme = () => {
    setThemeState((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const toggleLanguage = () => {
    setLanguageState((current) =>
      current === "en" ? "hi" : "en"
    );
  };

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        language,
        setTheme,
        setLanguage,
        toggleTheme,
        toggleLanguage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context =
    useContext(PreferencesContext);

  if (!context) {
    throw new Error(
      "usePreferences must be used inside PreferencesProvider"
    );
  }

  return context;
}
