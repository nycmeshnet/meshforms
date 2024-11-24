"use client";

import { ThemeProvider } from "@mui/material/styles";
import { useEnvContext } from "@/lib/EnvProvider";
import { devTheme, localTheme, prodTheme } from "../../theme";

export interface EnvThemeProviderProps {
  children?: React.ReactNode;
}

export const EnvThemeProvider: React.FC<EnvThemeProviderProps> = ({
  children,
}) => {
  const env = useEnvContext();

  let theme = localTheme;
  if (env?.includes("prod")) {
    theme = prodTheme;
  } else if (env?.includes("dev")) {
    theme = devTheme;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
