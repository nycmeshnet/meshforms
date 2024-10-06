"use client";
// Idea: Have people validate their panoramas with their email?
import React from "react";
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

  const [duplicateDialogOpen, setDuplicateDialogOpen] = React.useState(false);
  const [duplicateDialogInstallNumber, setDuplicateDialogInstallNumber] =
    React.useState(0);
  const [duplicateDialogImages, setDuplicateDialogImages] = React.useState([]);

  const handleClickUpload = () => {
    setDuplicateDialogOpen(false);
  };

  const handleClickCancel = () => {
    setDuplicateDialogOpen(false);
  };

  function onSubmit(e) {
    e.preventDefault();

    // Now get the form data as you regularly would
    const formData = new FormData(e.currentTarget);

    // Typescript go brrrrr
    const installNumberValue = formData.get("install_number");
    let installNumber = NaN;
    if (installNumberValue !== null) {
      installNumber = parseInt(installNumberValue as string);
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
          setDuplicateDialogImages(imagesDuplicated);
          setDuplicateDialogInstallNumber(installNumber);
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

  return (
    <>
      <h2>Image Upload</h2>
      <p>
        Upload panoramas and other relevant install photos here. This form is
        backed by Pano, our self-hosted panorama hosting solution.
      </p>
      <div>
        <form onSubmit={onSubmit}>
          <PanoramaDropzone name="dropzone_files" required />
          <div className={styles.formBody}>
            <input
              type="number"
              name="install_number"
              placeholder="Install Number"
              required
            />
            <Button type="submit" variant="contained" size="large">
              Submit
            </Button>
          </div>
        </form>
      </div>
      <div className="toasty">
        <ToastContainer />
      </div>
      <PanoramaDuplicateDialog
        installNumber={duplicateDialogInstallNumber}
        duplicateImages={duplicateDialogImages}
        isDialogOpened={duplicateDialogOpen}
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
