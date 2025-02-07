"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PanoramaDropzone from "./PanoramaDropzone";
import { Button, CircularProgress } from "@mui/material";
import styles from "./PanoramaUpload.module.scss";
import PanoramaDuplicateDialog from "../PanoramaDuplicateDialog/PanoramaDuplicateDialog";

type FormValues = {
  installNumber: number;
  dropzoneImages: File[];
};

export type { FormValues };

function PanoramaUploader() {
  // React hook form stuff
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  // Most recently submitted user form
  const [formSubmission, setFormSubmission] = React.useState<FormValues>({
    installNumber: 0,
    dropzoneImages: [],
  });

  // When we update the state due to a form submisson, try to submit the images
  // once the update is complete. This is a little confusing to my small-brained
  // backend mind, but it avoids a race condition evoked by trying to use the new
  // state immediately after setting it in the submission handler.
  useEffect(() => {
    attemptUpload();
  }, [formSubmission]);

  // Titles and Links to images on the server that we think are duplicates
  const [possibleDuplicates, setPossibleDuplicates] = React.useState<
    Array<[string, string]>
  >([]);

  // Shows and hides the duplicate dialog
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] =
    React.useState(false);

  // Disables the submit button and shows the throbber when a request is being processed.
  // TODO (wdn): Implement this
  const [isLoading, setIsLoading] = React.useState(false);

  // Closes dupe dialog and tries the submission again
  const handleClickUpload = () => {
    setIsDuplicateDialogOpen(false);
    attemptUpload(true);
  };

  // Closes the dupe dialog and allows the user to make chances
  const handleClickCancel = () => {
    setIsDuplicateDialogOpen(false);
    setIsLoading(false);
  };

  const onFileDrop = (dropzoneImages: File[]) => {
    if (dropzoneImages.length) {
      setValue("dropzoneImages", dropzoneImages); // Update the form state with the file
    }
  };

  function attemptUpload(trustMeBro: boolean = false) {
    let formData = new FormData();

    if (formSubmission === undefined) {
      return;
    }

    // Set the install number
    formData.append("installNumber", formSubmission.installNumber.toString());

    // Upload images
    for (var x = 0; x < formSubmission.dropzoneImages.length; x++) {
      formData.append("dropzoneImages[]", formSubmission.dropzoneImages[x]);
    }

    // Upload possibly duplicate images
    formData.append("trustMeBro", trustMeBro ? "true" : "false");

    // Temporary dev token
    //formData.append(
    //  "token",
    //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJteV9jbGllbnQifQ.zYN1PK0ZRYXg5Md-8Cr8svubDmm1SRQ5SZnwgUAMJGA",
    //);

    console.log(formData);

    fetch("http://127.0.0.1:8001/api/v1/upload", {
      method: "POST",
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJteV9jbGllbnQifQ.zYN1PK0ZRYXg5Md-8Cr8svubDmm1SRQ5SZnwgUAMJGA",
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("Files uploaded successfully");
          toast.success("Upload Successful!");
          setIsLoading(false);
        }
        if (response.status == 409) {
          const imagesDuplicated = Object.entries(await response.json()); // Await the text() promise here
          console.debug(imagesDuplicated);
          setPossibleDuplicates(imagesDuplicated);
          setIsDuplicateDialogOpen(true);
          return;
        }
        if (response.status == 413) {
          toast.error(
            `File size limit exceeded! Try splitting into multiple submissions.`,
          );
          setIsLoading(false);
        }
        throw response;
      })
      .catch(async (error) => {
        const j = await error.json();
        const msg = `File upload error: ${j.detail}`;
        console.error(msg);
        toast.error(msg);
        setIsLoading(false);
      });
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.debug(data);
    setIsLoading(true);
    setFormSubmission(data); // Side Effect: Submits the form
  };

  return (
    <>
      <h2>Image Upload</h2>
      <p>
        Upload panoramas and other relevant install photos here. This form is
        backed by Pano, our panorama hosting solution.
      </p>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PanoramaDropzone onFileDrop={onFileDrop} />
          <div className={styles.formBody}>
            <input
              {...register("installNumber")}
              type="number"
              placeholder="Install Number"
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
            <div hidden={!isLoading}>
              <CircularProgress />
            </div>
          </div>
        </form>
      </div>
      <div className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
      <PanoramaDuplicateDialog
        formSubmission={formSubmission}
        possibleDuplicates={possibleDuplicates}
        isDialogOpened={isDuplicateDialogOpen}
        handleClickUpload={handleClickUpload}
        handleClickCancel={handleClickCancel}
      />
    </>
  );
}

export default PanoramaUploader;

// Idea: Have people validate their panoramas with their email?
