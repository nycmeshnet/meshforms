"use client";
// Idea: Have people validate their panoramas with their email?
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PanoramaDropzone from "./PanoramaDropzone";
import { Button } from "@mui/material";
import styles from "./PanoramaUpload.module.scss";
import PanoramaDuplicateDialog from "../PanoramaDuplicateDialog/PanoramaDuplicateDialog";

type FormValues = {
  install_number: string;
  files: FileList;
};

const PanoramaUploadForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = React.useState(false);

  // Install number currently being processed
  const [installNumber, setInstallNumber] = React.useState(0);

  // Links to images on the server that we think are duplicates.
  const [possibleDuplicates, setPossibleDuplicates] = React.useState([]);

  // Displays previews of the user's submitted images on the duplicate dialog.
  const [previews, setPreviews] = React.useState<Array<[string, string]>>([]);

  // Disables the submit button and shows the throbber when a request is being processed.
  // TODO (wdn): Implement this
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClickUpload = () => {
    setIsDuplicateDialogOpen(false);
  };

  const handleClickCancel = () => {
    setIsDuplicateDialogOpen(false);
  };

  function onSubmit(e) {
    e.preventDefault();

    // Now get the form data as you regularly would
    const formData = new FormData(e.currentTarget);

    // Typescript go brrrrr
    const installNumberValue = formData.get("install_number");
    if (installNumberValue !== null) {
      setInstallNumber(parseInt(installNumberValue as string));
    }

    fetch("http://127.0.0.1:8089/api/v1/upload", {
      method: "POST",
      headers: {
        Install: installNumber,
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("Files uploaded successfully");

          toast.success("Upload Successful!", {
            hideProgressBar: true,
            theme: "colored",
          });
        }

        if (response.status == 409) {
          const imagesDuplicated = Object.entries(await response.json()); // Await the text() promise here
          toast.error(`Duplicate images detected`, {
            hideProgressBar: true,
            theme: "colored",
          });
          console.log(imagesDuplicated);
          setPossibleDuplicates(imagesDuplicated);
          setDuplicateDialogOpen(true);
          return;
        }
      })
      .catch((error) => {
        console.error("File upload error:", error);
        toast.error(`File upload error: ${error}`, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  }

  useEffect(() => {
    // Revoke the URLs for the preview images on unmount.
    return () => previews.forEach(([_, url]) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <>
      <h2>Image Upload</h2>
      <p>
        Upload panoramas and other relevant install photos here. This form is
        backed by Pano, our panorama hosting solution.
      </p>
      <div>
        <form onSubmit={onSubmit}>
          <PanoramaDropzone
            name="dropzone_files"
            setPreviews={setPreviews}
            required
          />
          <div className={styles.formBody}>
            <input
              type="number"
              name="install_number"
              placeholder="Install Number"
              required
            />
            <Button type="submit" variant="contained" size="large"

              disabled={isLoading}

            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      <div className="toasty">
        <ToastContainer />
      </div>
      <PanoramaDuplicateDialog
        installNumber={installNumber}
        previews={previews}
        duplicateImages={possibleDuplicates}
        isDialogOpened={isDuplicateDialogOpen}
        handleClickUpload={handleClickUpload}
        handleClickCancel={handleClickCancel}
      />
    </>
  );
};

export default PanoramaUploadForm;

// TODO: Can I show the existing panoramas?
// TODO: Figure out key events for lookup by install num (or don't and let Olivier
// figure it out)
