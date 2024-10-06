import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface PanoramaDuplicateDialogProps {
  installNumber: number;
  duplicateImages: Array<[string, string]>;
  isDialogOpened: boolean;
  handleClickUpload: () => void;
  handleClickCancel: () => void;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function PanoramaDuplicateDialog({
  installNumber,
  duplicateImages,
  isDialogOpened,
  handleClickUpload,
  handleClickCancel,
}: PanoramaDuplicateDialogProps) {
  /*const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };*/

  return (
    <React.Fragment>
      <Dialog
        open={isDialogOpened}
        onClose={handleClickCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle color="error" id="alert-dialog-title">
          {"Possible duplicates detected"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The following images submitted were detected to be duplicates of
            existing images for Install #{installNumber}. Would you like to
            submit new ones anyway?
            <br />
            <ul>
              {duplicateImages.map(([k, v], _) => (
                <li>
                  <strong>Uploaded:</strong> {k}, <strong>Existing Object:</strong> {v}
                </li>
              ))}
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCancel}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleClickUpload}
            autoFocus
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
