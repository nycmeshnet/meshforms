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

// FIXME (wdn): I think there is a minor race condition here where the state is
// briefly undefined the first time it's evaluated on a page. This is because
// when you call set on a useState, it does not _immediately_ update.
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
