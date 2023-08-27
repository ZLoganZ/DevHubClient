import {
  darkTheme,
  darkThemeSet,
  lightTheme,
  lightThemeSet,
} from "@/utils/cssVariable";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getTheme: () => {
    themeColor: {
      colorTextBase: string;
      colorBgBase: string;
      controlItemBgActive: string;
    };
    themeColorSet: {
      colorText1: string;
      colorText2: string;
      colorText3: string;
      colorBg1: string;
      colorBg2: string;
      colorBg3: string;
      colorBg4: string;

      colorSVG: string;
      colorPicker: string;
    };
  };
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  getTheme: () => ({
    themeColor: darkTheme,
    themeColorSet: darkThemeSet,
  }),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    getTheme: () => {
      const theme = localStorage.getItem(storageKey) as Theme;
      switch (theme) {
        case "dark": {
          return {
            themeColor: darkTheme,
            themeColorSet: darkThemeSet,
          };
        }
        case "light": {
          return {
            themeColor: lightTheme,
            themeColorSet: lightThemeSet,
          };
        }
        default: {
          return {
            themeColor: darkTheme,
            themeColorSet: darkThemeSet,
          };
        }
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
