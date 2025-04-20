"use client";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PanoramaDropzone from "./PanoramaDropzone";
import { Alert, Button, CircularProgress } from "@mui/material";
import Select from "react-select";
import styles from "./PanoramaUpload.module.scss";
import searchBarStyles from "../Pano/SearchBar/PanoSearchBar.module.scss";
import PanoramaDuplicateDialog, {
  PossibleDuplicate,
} from "../PanoramaDuplicateDialog/PanoramaDuplicateDialog";
import {
  ModelType,
  modelTypeToAPIFieldMap,
  modelTypeToAPIRouteMap,
  modelTypeToLabelMap,
} from "@/app/types";
import { modelSelectOptions } from "../PanoramaViewer/PanoramaViewer";
import PanoHeader from "../Pano/Header/PanoHeader";

type FormValues = {
  modelNumber: number;
  dropzoneImages: File[];
};

interface Image {
  category: "panorama";
  id: string;
  install_number: number;
  order: number;
  original_filename: string;
  signature: string;
  timestamp: string; // Consider using Date if parsing it later
  url: string;
}

export type { FormValues };

function PanoramaUploader() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");

  const [selectedModel, setSelectedModel] = React.useState(
    ModelType.InstallNumber,
  );

  const [linkToViewUploadedFiles, setLinkToViewUploadedFiles] =
    React.useState("");

  // TODO (wdn): The login element should probably be its own component
  useEffect(() => {
    // Check if we're logged into pano
    fetch(`http://127.0.0.1:8081/userinfo`, {
      credentials: "include",
    }).then(async (response) => {
      const j = await response.json();
      if (response.status === 200) {
        console.log("You're logged in");
        setUser(j.name);
        setIsLoggedIn(true);
        return;
      }
      window.location.replace("http://127.0.0.1:8081/login/google");
    });
  }, []);

  // React hook form stuff
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  // Most recently submitted user form
  const [formSubmission, setFormSubmission] = React.useState<FormValues>({
    modelNumber: -1,
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
    Array<PossibleDuplicate>
  >([]);

  useEffect(() => {
    if (possibleDuplicates.length > 0) {
      setIsDuplicateDialogOpen(true);
    }
  }, [possibleDuplicates]);

  // Shows and hides the duplicate dialog
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] =
    React.useState(false);

  // Disables the submit button and shows the throbber when a request is being processed.
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

    if (
      formSubmission === undefined ||
      formSubmission.dropzoneImages.length === 0 ||
      selectedModel === null
    ) {
      return;
    }

    // Set the install number, or the network number.
    formData.append(
      modelTypeToAPIFieldMap.get(selectedModel),
      formSubmission.modelNumber.toString(),
    );

    // Upload images
    for (var x = 0; x < formSubmission.dropzoneImages.length; x++) {
      formData.append("dropzoneImages[]", formSubmission.dropzoneImages[x]);
    }

    // Upload possibly duplicate images
    formData.append("trustMeBro", trustMeBro ? "true" : "false");

    fetch("http://127.0.0.1:8081/api/v1/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("Files uploaded successfully");
          toast.success("Upload Successful!");
          setIsLoading(false);
          setLinkToViewUploadedFiles(
            `http://127.0.0.1:3000/pano/view/${modelTypeToAPIRouteMap.get(selectedModel)}/${formSubmission.modelNumber}/`,
          );
          return;
        }
        if (response.status == 409) {
          const j = await response.json();

          // Pano has just returned us a map of uploaded files to
          // duplicate files. Not all the info in the uploaded file is useful,
          // because it hasn't made it into the database yet (like the ID or the order)
          // Use the names to locate the uploaded Files
          // that match.
          let pds: Array<PossibleDuplicate> = [];
          Object.entries(j).forEach((file) => {
            const fileName = file[0];
            const existingObjectURL = file[1];
            // Use the name of the uploaded file to find
            const matchedFile: File | undefined =
              formSubmission.dropzoneImages.find(
                (file: File) => file.name === fileName,
              );

            if (matchedFile === undefined) {
              // Sanity check. This should never happen.
              const msg = `Did not find a matched file for ${fileName}`;
              console.error(msg);
              toast.error(msg);
              // Skip this iteration if we didn't find a file.
              return;
            }

            const pd: PossibleDuplicate = {
              fileName: fileName,
              existingFileURL: existingObjectURL,
              uploadedFile: matchedFile,
            };
            pds.push(pd);
          });
          //console.log(pds);
          setPossibleDuplicates(pds);
          return;
        }
        if (response.status == 413) {
          toast.error(
            `File size limit exceeded! Try splitting into multiple submissions.`,
          );
          setIsLoading(false);
          return;
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

  if (!isLoggedIn) {
    // While the app decides whether or not you're logged in it'll hide the view from you.
    return (
      <>
        <a href="/pano/view" style={{ textDecoration: "none", color: "black" }}>
          <h1>Pano</h1>
        </a>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <PanoHeader />
      <h2>Image Upload</h2>
      <p>
        Upload panoramas and other relevant install photos here. This form is
        backed by Pano, our panorama hosting solution.
        <br />
        The <strong>maximum content size is 100MB</strong>. If you are running
        into issues, try uploading your images in smaller batches.
      </p>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PanoramaDropzone onFileDrop={onFileDrop} />
          <div className={searchBarStyles.formBody}>
            <Select
              name="modelSelect"
              placeholder="Select NN or Install #"
              options={modelSelectOptions}
              defaultValue={modelSelectOptions[0]}
              onChange={(selected) => {
                selected ? setSelectedModel(selected.value) : null;
              }}
              className={styles.drop}
              isSearchable={false}
            />
            <input
              {...register("modelNumber")}
              type="number"
              placeholder={modelTypeToLabelMap.get(selectedModel)}
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
        <div hidden={linkToViewUploadedFiles === ""}>
          <Alert className={styles.uploadSuccessLink}>
            <p>Upload successful. View or share your files at:</p>
            <a href={linkToViewUploadedFiles}>
              <p>{linkToViewUploadedFiles}</p>
            </a>
          </Alert>
        </div>
      </div>
      <div className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
      <PanoramaDuplicateDialog
        installNumber={formSubmission.installNumber}
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
