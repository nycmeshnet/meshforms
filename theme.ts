// src/theme.ts
"use client";
import { createTheme, ThemeOptions } from "@mui/material/styles";

import { Roboto } from "next/font/google";
import { SimplePaletteColorOptions } from "@mui/material/styles/createPalette";
import { PaletteColor, PaletteColorOptions } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface Palette {
    header: PaletteColor;
  }
  interface PaletteOptions {
    header?: PaletteColorOptions;
  }
}

const prodThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#f4f4f4",
    },
    background: {
      default: "#ffffff",
    },
    header: {
      main: "#f4f4f4",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        sizeLarge: {
          height: "40px",
          paddingLeft: "34px",
          paddingRight: "34px",
        },
        sizeSmall: {
          height: "32px",
          paddingLeft: "14px",
          paddingRight: "14px",
        },
      },
    },
  },
};

const devThemeOptions: ThemeOptions = structuredClone(prodThemeOptions);
(devThemeOptions.palette!.header as SimplePaletteColorOptions).main = "#ffc981";

const gammaThemeOptions: ThemeOptions = structuredClone(devThemeOptions);
(gammaThemeOptions.palette!.header as SimplePaletteColorOptions).main =
  "#f9d4ff";

const localThemeOptions: ThemeOptions = structuredClone(devThemeOptions);
(localThemeOptions.palette!.header as SimplePaletteColorOptions).main =
  "#d4f9ff";

export const prodTheme = createTheme(prodThemeOptions);
export const devTheme = createTheme(devThemeOptions);
export const gammaTheme = createTheme(gammaThemeOptions);
export const localTheme = createTheme(localThemeOptions);
