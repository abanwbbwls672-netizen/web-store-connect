import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeKey = "emerald" | "violet" | "rose" | "amber" | "ocean" | "slate";

type ThemeDef = {
  key: ThemeKey;
  label: string;
  swatch: string; // hsl preview
  vars: Record<string, string>;
};

export const themes: ThemeDef[] = [
  {
    key: "emerald",
    label: "Emerald",
    swatch: "158 84% 52%",
    vars: {
      "--primary": "158 84% 52%",
      "--primary-glow": "158 90% 60%",
      "--accent": "187 92% 55%",
      "--ring": "158 84% 52%",
      "--gradient-primary": "linear-gradient(135deg, hsl(158 84% 52%), hsl(187 92% 55%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(158 84% 52% / 0.18), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(187 92% 55% / 0.14), transparent 60%), linear-gradient(180deg, hsl(222 47% 6%), hsl(222 47% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(158 84% 52% / 0.45)",
    },
  },
  {
    key: "violet",
    label: "Violet",
    swatch: "265 84% 62%",
    vars: {
      "--primary": "265 84% 62%",
      "--primary-glow": "280 90% 70%",
      "--accent": "300 92% 65%",
      "--ring": "265 84% 62%",
      "--gradient-primary": "linear-gradient(135deg, hsl(265 84% 62%), hsl(300 92% 65%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(265 84% 62% / 0.20), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(300 92% 65% / 0.15), transparent 60%), linear-gradient(180deg, hsl(260 47% 6%), hsl(260 47% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(265 84% 62% / 0.45)",
    },
  },
  {
    key: "rose",
    label: "Rose",
    swatch: "346 84% 58%",
    vars: {
      "--primary": "346 84% 58%",
      "--primary-glow": "346 90% 68%",
      "--accent": "20 92% 60%",
      "--ring": "346 84% 58%",
      "--gradient-primary": "linear-gradient(135deg, hsl(346 84% 58%), hsl(20 92% 60%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(346 84% 58% / 0.20), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(20 92% 60% / 0.14), transparent 60%), linear-gradient(180deg, hsl(340 30% 7%), hsl(340 30% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(346 84% 58% / 0.45)",
    },
  },
  {
    key: "amber",
    label: "Amber",
    swatch: "38 92% 55%",
    vars: {
      "--primary": "38 92% 55%",
      "--primary-glow": "45 95% 62%",
      "--accent": "16 90% 58%",
      "--ring": "38 92% 55%",
      "--gradient-primary": "linear-gradient(135deg, hsl(38 92% 55%), hsl(16 90% 58%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(38 92% 55% / 0.20), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(16 90% 58% / 0.14), transparent 60%), linear-gradient(180deg, hsl(28 35% 7%), hsl(28 35% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(38 92% 55% / 0.45)",
    },
  },
  {
    key: "ocean",
    label: "Ocean",
    swatch: "210 90% 56%",
    vars: {
      "--primary": "210 90% 56%",
      "--primary-glow": "200 92% 62%",
      "--accent": "180 84% 52%",
      "--ring": "210 90% 56%",
      "--gradient-primary": "linear-gradient(135deg, hsl(210 90% 56%), hsl(180 84% 52%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(210 90% 56% / 0.20), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(180 84% 52% / 0.14), transparent 60%), linear-gradient(180deg, hsl(215 47% 6%), hsl(215 47% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(210 90% 56% / 0.45)",
    },
  },
  {
    key: "slate",
    label: "Slate",
    swatch: "215 25% 65%",
    vars: {
      "--primary": "215 25% 70%",
      "--primary-glow": "215 25% 80%",
      "--accent": "215 20% 55%",
      "--ring": "215 25% 70%",
      "--gradient-primary": "linear-gradient(135deg, hsl(215 25% 70%), hsl(215 20% 55%))",
      "--gradient-hero":
        "radial-gradient(1200px 600px at 20% 0%, hsl(215 25% 70% / 0.15), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(215 20% 55% / 0.12), transparent 60%), linear-gradient(180deg, hsl(222 25% 7%), hsl(222 25% 4%))",
      "--shadow-glow": "0 0 60px -10px hsl(215 25% 70% / 0.35)",
    },
  },
];

const STORAGE_KEY = "ws-theme";

const applyTheme = (key: ThemeKey) => {
  const t = themes.find((x) => x.key === key) ?? themes[0];
  const root = document.documentElement;
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

type Ctx = { theme: ThemeKey; setTheme: (k: ThemeKey) => void };
const ThemeContext = createContext<Ctx>({ theme: "emerald", setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeKey>(
    (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as ThemeKey)) || "emerald",
  );

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
