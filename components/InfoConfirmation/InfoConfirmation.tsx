import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./InfoConfirmation.module.scss";
import { ConfirmationField, JoinFormValues } from "../JoinForm/JoinForm";

interface InfoConfirmationDialogProps {
  infoToConfirm: Array<ConfirmationField>;
  isDialogOpened: boolean;
  handleClickConfirm: () => void;
  handleClickReject: () => void;
  handleClickCancel: () => void;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function InfoConfirmationDialog({
  infoToConfirm,
  isDialogOpened,
  handleClickConfirm,
  handleClickReject,
  handleClickCancel,
}: InfoConfirmationDialogProps) {
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
                  <th>Original</th>
                  <th>New</th>
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
        </DialogContent>
        <DialogActions>
          <Button name="cancel" color="primary" onClick={handleClickCancel}>
            Go Back
          </Button>
          <Button name="reject" color="warning" onClick={handleClickReject}>
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
