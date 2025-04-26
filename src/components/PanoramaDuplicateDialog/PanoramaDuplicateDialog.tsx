import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./PanoramaDuplicateDialog.module.scss";
import { FormValues } from "../PanoramaUpload/PanoramaUpload";

export type PossibleDuplicate = {
  fileName: string;
  existingFileURL: string;
  uploadedFile: File;
};

interface PanoramaDuplicateDialogProps {
  installNumber: number;
  possibleDuplicates: Array<PossibleDuplicate>;
  isDialogOpened: boolean;
  handleClickUpload: () => void;
  handleClickCancel: () => void;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function PanoramaDuplicateDialog({
  installNumber, // FIXME (wdn): This should be model number and specify install/nn
  possibleDuplicates,
  isDialogOpened,
  handleClickUpload,
  handleClickCancel,
}: PanoramaDuplicateDialogProps) {
  possibleDuplicates.forEach((dupe: PossibleDuplicate) => {
    console.log(`Found possible duplicate: ${dupe}`);
  });
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
            The following images submitted seem to be duplicates of existing
            images for Install #{installNumber}. Would you like to upload these
            anyway?
          </DialogContentText>
          <div className={styles.alertTable}>
            <table>
              <thead>
                <tr>
                  <th>Uploaded</th>
                  <th>Existing Image</th>
                </tr>
              </thead>
              <tbody>
                {possibleDuplicates.map((dupe: PossibleDuplicate) => (
                  <tr key={dupe.uploadedFile.name}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(dupe.uploadedFile)}
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            height: "100px",
                          }}
                        />
                        {dupe.uploadedFile.name}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={dupe.existingFileURL}
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            height: "100px",
                          }}
                        />
                        <a href={dupe.existingFileURL}>{dupe.fileName}</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
