import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./InfoConfirmation.module.scss";
import { JoinFormValues } from "../JoinForm/JoinForm";

interface PanoramaDuplicateDialogProps {
  infoToConfirm: Array<[keyof JoinFormValues, string]>;
  isDialogOpened: boolean;
  handleClickConfirm: () => void;
  handleClickCancel: () => void;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function InfoConfirmationDialog({
  infoToConfirm,
  isDialogOpened,
  handleClickConfirm,
  handleClickCancel,
}: PanoramaDuplicateDialogProps) {
  return (
    <React.Fragment>
      <Dialog
        open={isDialogOpened}
        onClose={handleClickCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle color="warning" id="alert-dialog-title">
          {"Please confirm some information"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We needed to re-format some of your information. Please ensure that
            the below fields are accurate.
          </DialogContentText>
          <br />
          <div className={styles.alertTable}>
            <table>
              <thead>
                <tr key="headers">
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {infoToConfirm.map(([key, value], _) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button name="cancel" color="error" onClick={handleClickCancel}>
            Go back
          </Button>
          <Button name="reject" color="secondary">
            Use Original
          </Button>
          <Button
            name="confirm"
            color="success"
            variant="contained"
            onClick={handleClickConfirm}
            autoFocus
          >
            Accept Changes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
