"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const IsADeveloperContext = createContext<[boolean, () => void]>([
  false,
  () => {},
]);

interface IsDeveloperProviderProps {
  children: ReactNode;
}

const MESHFORMS_IS_A_DEVELOPER_ACK_TIME =
  "meshforms_user_last_acked_developer_status";
const DEVELOPER_ACK_CACHE_DURATION_MILLISECONDS = 1000 * 60 * 60 * 24 * 30; // 30 days

export const IsDeveloperProvider: React.FC<IsDeveloperProviderProps> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const [showAskIfDeveloperDialog, setShowAskIfDeveloperDialog] =
    useState<boolean>(false);
  const [isADeveloper, setIsADeveloper] = useState<boolean>(false);
  const t = useTranslations("DeveloperMode");

  useEffect(() => {
    if (isADeveloper) {
      localStorage.setItem(
        MESHFORMS_IS_A_DEVELOPER_ACK_TIME,
        Date.now().toString(),
      );
    }

    if (searchParams.get("isDeveloper") === "true") {
      // Let bots like Datadog by pass the dialog with a query param
      setIsADeveloper(true);
      return;
    }

    const storedAckTimeString = localStorage.getItem(
      MESHFORMS_IS_A_DEVELOPER_ACK_TIME,
    );
    let storedAckMs = NaN;
    if (storedAckTimeString) {
      storedAckMs = parseInt(storedAckTimeString);
    }
    if (
      !isNaN(storedAckMs) &&
      storedAckMs > Date.now() - DEVELOPER_ACK_CACHE_DURATION_MILLISECONDS
    ) {
      setIsADeveloper(true);
    }
  }, [isADeveloper]);

  const currentPath = usePathname();

  return (
    <IsADeveloperContext.Provider
      value={[
        isADeveloper,
        () => {
          setShowAskIfDeveloperDialog(true);
        },
      ]}
    >
      <Dialog
        open={showAskIfDeveloperDialog && !isADeveloper}
        onClose={() => {
          window.location.href = "https://forms.nycmesh.net" + currentPath;
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle color="warning" id="alert-dialog-title">
          {t("devlopersOnlyDialogHeader")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t.rich("devlopersOnlyDialogContent", {
              strong: (chunk) => <b>{chunk}</b>,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            name="isDev"
            color="warning"
            onClick={() => {
              setIsADeveloper(true);
              setShowAskIfDeveloperDialog(false);
            }}
          >
            {t("iAmADeveloperButton")}
          </Button>
          <Button
            name="notADev"
            color="success"
            variant="contained"
            onClick={() => {
              window.location.href = "https://forms.nycmesh.net" + currentPath;
            }}
            autoFocus
          >
            {t("iAmNotADeveloperButton")}
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </IsADeveloperContext.Provider>
  );
};

export const useIsDeveloper = (): [boolean, () => void] => {
  return useContext(IsADeveloperContext);
};
