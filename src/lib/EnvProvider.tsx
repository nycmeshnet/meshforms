"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getEnvironment } from "@/lib/endpoint";

const EnvContext = createContext<string | undefined>(undefined);

interface EnvProviderProps {
  children: ReactNode;
}

export const EnvProvider: React.FC<EnvProviderProps> = ({ children }) => {
  const [env, setEnv] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchEnv = async () => {
      setEnv(await getEnvironment());
    };

    fetchEnv();
  }, []);

  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

export const useEnvContext = (): string | undefined => {
  return useContext(EnvContext);
};
