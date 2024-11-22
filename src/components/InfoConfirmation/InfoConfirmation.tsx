import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./InfoConfirmation.module.scss";
import { ConfirmationField, JoinFormValues } from "../JoinForm/JoinForm";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface InfoConfirmationDialogProps {
  infoToConfirm: Array<ConfirmationField>;
  isDialogOpened: boolean;
  handleClickConfirm: (recaptchaCheckboxToken: string) => void;
  handleClickReject: (recaptchaCheckboxToken: string) => void;
  handleClickCancel: () => void;
  isProbablyABot: boolean;
  recaptchaV2Key: string | undefined;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function InfoConfirmationDialog({
  infoToConfirm,
  isDialogOpened,
  handleClickConfirm,
  handleClickReject,
  handleClickCancel,
  isProbablyABot,
  recaptchaV2Key,
}: InfoConfirmationDialogProps) {
  const locale = useLocale();
  const t = useTranslations("InfoConfirmation");

  const recaptchaV2Ref = React.useRef<ReCAPTCHA>(null);
  const [checkBoxCaptchaToken, setCheckBoxCaptchaToken] = useState("");

  const dialogClosed = () => {
    recaptchaV2Ref?.current?.reset();
    setCheckBoxCaptchaToken("");
    handleClickCancel();
  };

  return (
    <React.Fragment>
      <Dialog
        open={isDialogOpened}
        onClose={dialogClosed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle color="warning" id="alert-dialog-title">
          {t("pleaseConfirmHeader")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("pleaseConfirmBody")}
          </DialogContentText>
          <br />
          <div className={styles.alertTable}>
            <table>
              <thead>
                <tr key="headers">
                  <th>{t("originalInformationColumnHeader")}</th>
                  <th>{t("newInformationColumnHeader")}</th>
                </tr>
              </thead>
              <tbody>
                {infoToConfirm.map((field) => (
                  <tr key={field.key}>
                    <td>{field.original}</td>
                    <td>{field.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isProbablyABot && recaptchaV2Key ? (
            <ReCAPTCHA
              className={styles.centered}
              style={{ marginTop: "15px" }}
              ref={recaptchaV2Ref}
              sitekey={recaptchaV2Key}
              hl={locale}
              onChange={(newToken) => setCheckBoxCaptchaToken(newToken ?? "")}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button name="cancel" color="primary" onClick={dialogClosed}>
            {t("goBack")}
          </Button>
          <Button
            name="reject"
            color="warning"
            onClick={() => handleClickReject(checkBoxCaptchaToken)}
            disabled={isProbablyABot && checkBoxCaptchaToken == ""}
          >
            {t("useOriginal")}
          </Button>
          <Button
            name="confirm"
            color="success"
            variant="contained"
            onClick={() => handleClickConfirm(checkBoxCaptchaToken)}
            disabled={isProbablyABot && checkBoxCaptchaToken == ""}
            autoFocus
          >
            {t("acceptChanges")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
