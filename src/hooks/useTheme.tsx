import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeKey = "emerald" | "violet" | "rose" | "amber" | "ocean" | "slate" | "custom";
export type Mode = "dark" | "light";

type ThemeDef = {
  key: ThemeKey;
  label: string;
  swatch: string;
  primary: string; // "H S% L%"
  accent: string;
};

export const themes: ThemeDef[] = [
  { key: "emerald", label: "Emerald", swatch: "158 84% 52%", primary: "158 84% 52%", accent: "187 92% 55%" },
  { key: "violet",  label: "Violet",  swatch: "265 84% 62%", primary: "265 84% 62%", accent: "300 92% 65%" },
  { key: "rose",    label: "Rose",    swatch: "346 84% 58%", primary: "346 84% 58%", accent: "20 92% 60%" },
  { key: "amber",   label: "Amber",   swatch: "38 92% 55%",  primary: "38 92% 55%",  accent: "16 90% 58%" },
  { key: "ocean",   label: "Ocean",   swatch: "210 90% 56%", primary: "210 90% 56%", accent: "180 84% 52%" },
  { key: "slate",   label: "Slate",   swatch: "215 25% 65%", primary: "215 25% 70%", accent: "215 20% 55%" },
];

// ---- Color utilities ----
const hexToHsl = (hex: string): string => {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const hslToHex = (hsl: string): string => {
  const [hStr, sStr, lStr] = hsl.split(" ");
  const h = parseFloat(hStr); const s = parseFloat(sStr) / 100; const l = parseFloat(lStr) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const shiftHue = (hsl: string, deg: number): string => {
  const [h, s, l] = hsl.split(" ");
  const hh = (parseFloat(h) + deg + 360) % 360;
  return `${Math.round(hh)} ${s} ${l}`;
};

const withL = (hsl: string, l: number): string => {
  const [h, s] = hsl.split(" ");
  return `${h} ${s} ${l}%`;
};

// ---- Apply theme to :root ----
type ThemeState = {
  mode: Mode;
  preset: ThemeKey;
  primary: string;     // "H S% L%"
  accent: string;
  bgHue: number;       // 0-360 background tint hue
};

const DEFAULT: ThemeState = {
  mode: "dark",
  preset: "emerald",
  primary: "158 84% 52%",
  accent: "187 92% 55%",
  bgHue: 222,
};

const applyTheme = (s: ThemeState) => {
  const root = document.documentElement;
  const isDark = s.mode === "dark";
  root.classList.toggle("light", !isDark);
  root.classList.toggle("dark", isDark);

  const p = s.primary;
  const a = s.accent;
  const bgH = s.bgHue;

  // Surfaces
  if (isDark) {
    root.style.setProperty("--background", `${bgH} 47% 6%`);
    root.style.setProperty("--foreground", `210 40% 98%`);
    root.style.setProperty("--card", `${bgH} 40% 9%`);
    root.style.setProperty("--card-foreground", `210 40% 98%`);
    root.style.setProperty("--popover", `${bgH} 40% 9%`);
    root.style.setProperty("--popover-foreground", `210 40% 98%`);
    root.style.setProperty("--secondary", `${bgH} 30% 14%`);
    root.style.setProperty("--secondary-foreground", `210 40% 98%`);
    root.style.setProperty("--muted", `${bgH} 30% 14%`);
    root.style.setProperty("--muted-foreground", `215 20% 65%`);
    root.style.setProperty("--border", `${bgH} 30% 16%`);
    root.style.setProperty("--input", `${bgH} 30% 14%`);
    root.style.setProperty("--sidebar-background", `${bgH} 47% 5%`);
    root.style.setProperty("--sidebar-foreground", `210 40% 90%`);
    root.style.setProperty("--sidebar-accent", `${bgH} 30% 12%`);
    root.style.setProperty("--sidebar-accent-foreground", `210 40% 98%`);
    root.style.setProperty("--sidebar-border", `${bgH} 30% 14%`);
    root.style.setProperty("--gradient-card", `linear-gradient(160deg, hsl(${bgH} 40% 11% / 0.9), hsl(${bgH} 40% 8% / 0.6))`);
    root.style.setProperty("--gradient-hero",
      `radial-gradient(1200px 600px at 20% 0%, hsl(${p} / 0.18), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(${a} / 0.14), transparent 60%), linear-gradient(180deg, hsl(${bgH} 47% 6%), hsl(${bgH} 47% 4%))`);
  } else {
    root.style.setProperty("--background", `0 0% 100%`);
    root.style.setProperty("--foreground", `${bgH} 47% 11%`);
    root.style.setProperty("--card", `0 0% 100%`);
    root.style.setProperty("--card-foreground", `${bgH} 47% 11%`);
    root.style.setProperty("--popover", `0 0% 100%`);
    root.style.setProperty("--popover-foreground", `${bgH} 47% 11%`);
    root.style.setProperty("--secondary", `210 40% 96%`);
    root.style.setProperty("--secondary-foreground", `${bgH} 47% 11%`);
    root.style.setProperty("--muted", `210 40% 96%`);
    root.style.setProperty("--muted-foreground", `215 16% 40%`);
    root.style.setProperty("--border", `214 32% 88%`);
    root.style.setProperty("--input", `214 32% 88%`);
    root.style.setProperty("--sidebar-background", `0 0% 100%`);
    root.style.setProperty("--sidebar-foreground", `${bgH} 47% 20%`);
    root.style.setProperty("--sidebar-accent", `210 40% 96%`);
    root.style.setProperty("--sidebar-accent-foreground", `${bgH} 47% 11%`);
    root.style.setProperty("--sidebar-border", `214 32% 88%`);
    root.style.setProperty("--gradient-card", `linear-gradient(160deg, hsl(0 0% 100%), hsl(210 40% 98%))`);
    root.style.setProperty("--gradient-hero",
      `radial-gradient(1200px 600px at 20% 0%, hsl(${p} / 0.12), transparent 60%), radial-gradient(900px 500px at 90% 30%, hsl(${a} / 0.10), transparent 60%), linear-gradient(180deg, hsl(0 0% 100%), hsl(210 40% 98%))`);
  }

  // Primary / accent
  root.style.setProperty("--primary", p);
  root.style.setProperty("--primary-glow", withL(p, Math.min(75, parseFloat(p.split(" ")[2]) + 10)));
  root.style.setProperty("--primary-foreground", isDark ? `${bgH} 47% 6%` : `0 0% 100%`);
  root.style.setProperty("--accent", a);
  root.style.setProperty("--accent-foreground", isDark ? `${bgH} 47% 6%` : `0 0% 100%`);
  root.style.setProperty("--ring", p);
  root.style.setProperty("--sidebar-primary", p);
  root.style.setProperty("--sidebar-primary-foreground", isDark ? `${bgH} 47% 6%` : `0 0% 100%`);
  root.style.setProperty("--sidebar-ring", p);
  root.style.setProperty("--gradient-primary", `linear-gradient(135deg, hsl(${p}), hsl(${a}))`);
  root.style.setProperty("--shadow-glow", `0 0 60px -10px hsl(${p} / 0.45)`);
  root.style.setProperty("--shadow-elegant", `0 20px 60px -20px hsl(${p} / 0.35)`);
};

const STORAGE_KEY = "ws-theme-v2";

type Ctx = {
  state: ThemeState;
  setMode: (m: Mode) => void;
  setPreset: (k: ThemeKey) => void;
  setPrimaryHex: (hex: string) => void;
  setAccentHex: (hex: string) => void;
  setBgHue: (h: number) => void;
  reset: () => void;
  // Back-compat
  theme: ThemeKey;
  setTheme: (k: ThemeKey) => void;
};
const ThemeContext = createContext<Ctx>({
  state: DEFAULT,
  setMode: () => {}, setPreset: () => {}, setPrimaryHex: () => {},
  setAccentHex: () => {}, setBgHue: () => {}, reset: () => {},
  theme: "emerald", setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ThemeState>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT;
  });

  useEffect(() => {
    applyTheme(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setMode = (mode: Mode) => setState((s) => ({ ...s, mode }));
  const setPreset = (preset: ThemeKey) => setState((s) => {
    const def = themes.find((t) => t.key === preset);
    if (!def) return { ...s, preset };
    return { ...s, preset, primary: def.primary, accent: def.accent };
  });
  const setPrimaryHex = (hex: string) => setState((s) => ({
    ...s, preset: "custom", primary: hexToHsl(hex), accent: shiftHue(hexToHsl(hex), 30),
  }));
  const setAccentHex = (hex: string) => setState((s) => ({ ...s, preset: "custom", accent: hexToHsl(hex) }));
  const setBgHue = (bgHue: number) => setState((s) => ({ ...s, bgHue }));
  const reset = () => setState(DEFAULT);

  return (
    <ThemeContext.Provider value={{
      state, setMode, setPreset, setPrimaryHex, setAccentHex, setBgHue, reset,
      theme: state.preset, setTheme: setPreset,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
