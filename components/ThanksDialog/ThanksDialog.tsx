import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert } from "@mui/material";

interface ThanksDialogProps {
  isSubmitted: boolean;
  setIsSubmitted: (b: boolean) => void;
}

export default function ThanksDialog({
  isSubmitted,
  setIsSubmitted,
}: ThanksDialogProps) {
  const handleClose = () => {
    setIsSubmitted(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isSubmitted}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Thanks! You will receive an email shortly 🙂
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleClose}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
