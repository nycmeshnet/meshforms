import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./PanoramaDuplicateDialog.module.scss";
import { FormValues } from "../PanoramaUpload/PanoramaUpload";

interface PanoramaDuplicateDialogProps {
  formSubmission: FormValues;
  possibleDuplicates: Array<[string, string]>;
  isDialogOpened: boolean;
  handleClickUpload: () => void;
  handleClickCancel: () => void;
}

// https://mui.com/material-ui/react-dialog/#alerts
export default function PanoramaDuplicateDialog({
  formSubmission,
  possibleDuplicates,
  isDialogOpened,
  handleClickUpload,
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
        <DialogTitle color="error" id="alert-dialog-title">
          {"Possible duplicates detected"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The following images submitted seem to be duplicates of existing
            images for Install #{formSubmission.installNumber}. Would you like
            to upload these anyway?
            <br />
            <div className={styles.alertTable}>
              <table>
                <tr>
                  <th>Uploaded</th>
                  <th>Existing Image</th>
                </tr>
                {possibleDuplicates.map(([k, v], _) => (
                  <tr>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(
                            formSubmission.dropzoneImages.find(
                              (file: File) => file.name === k,
                            ),
                          )}
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            height: "100px",
                          }}
                        />
                        {
                          formSubmission.dropzoneImages.find(
                            (file: File) => file.name === k,
                          ).name
                        }
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
                          src={v}
                          style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            height: "100px",
                          }}
                        />
                        <a href={new URL(v).origin + new URL(v).pathname}>
                          {new URL(v).origin + new URL(v).pathname}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
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