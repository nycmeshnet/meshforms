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
  infoToConfirm: Array<[string, string]>;
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
  console.log(infoToConfirm);
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
            Please confirm some info
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
          <Button color="error" onClick={handleClickCancel}>
            Cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={handleClickConfirm}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
