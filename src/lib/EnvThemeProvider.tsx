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
  if (env === undefined) {
    // This is the case where we haven't loaded the env var from the backend yet. We use prod themes here to prevent
    // a flicker in prod before the env vars load from the backend. The other stages will flicker but that's fine
    // Once we have any comms with the backend, env will be "" instead, so if the env var is unset we will use localTheme
    theme = prodTheme;
  } else if (env?.includes("prod")) {
    theme = prodTheme;
  } else if (env?.includes("dev")) {
    theme = devTheme;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
