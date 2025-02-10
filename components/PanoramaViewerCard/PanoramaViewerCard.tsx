import React, { useCallback, useState } from "react";

import styles from "./PanoramaViewerCard.module.scss";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

type FormValues = {
  category: string;
};

export type { FormValues };

interface PanoramaViewerCardProps {
  id: string,
  originalFilename: string;
  timestamp: string;
  category: string;
  url: string;
}

export default function PanoramaViewerCard({
  id,
  originalFilename,
  timestamp,
  category = "",
  url,
}: PanoramaViewerCardProps) {
  // React hook form stuff
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const selectCategoryOptions = [
    { value: "PANORAMA", label: "Panorama" },
    { value: "EQUIPMENT", label: "Equipment" },
    { value: "DETAIL", label: "Detail" },
    { value: "MISCELLANEOUS", label: "Miscellaneous" },
    { value: "UNCATEGORIZED", label: "Uncategorized" },
  ];

function handleUpdateCategory(event) {
    const newCategory = event.target.value;

  let formData = new FormData();
    formData.append("id", id);
    formData.append("new_category", newCategory);
  console.log(event.target.value);
  fetch(`http://127.0.0.1:8001/api/v1/update`, {
      method: "POST",
      headers: {
        token:
          process.env.NEXT_PUBLIC_PANO_TOKEN,
      },
      body: formData, 
    }).then(async (response) => {
      const j = await response.json();
      console.log(j);
    });
}

  function handleClickReplaceImage() {
    setIsReplaceImageDropzoneOpen(!isReplaceImageDropzoneOpen);
  }

  // Shows and hides the replaceImage dropzone
  const [isReplaceImageDropzoneOpen, setIsReplaceImageDropzoneOpen] =
    React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const onFileDrop = (dropzoneImages: File[]) => {
    console.log(dropzoneImages[0].name);
    let formData = new FormData();

    formData.append("id", id);

    // Upload images
    for (var x = 0; x < dropzoneImages.length; x++) {
      formData.append("dropzoneImages[]", dropzoneImages[x]);
    }

    fetch("http://127.0.0.1:8001/api/v1/update", {
      method: "POST",
      headers: {
        token:
          process.env.NEXT_PUBLIC_PANO_TOKEN,
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("Files uploaded successfully");
          alert("Upload Successful!");
          setIsLoading(false);
          return;
        }
        throw response;
      })
      .catch(async (error) => {
        const j = await error.json();
        const msg = `File upload error: ${j.detail}`;
        alert(msg);
        setIsLoading(false);
      });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileDrop(acceptedFiles);
      setIsLoading(true);
    },
    [onFileDrop],
  );
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <div className={styles.card}>
        <div className={styles.imageMetadata}>
          <ul>
            <li><strong>{originalFilename}</strong></li>
            <li>{timestamp}</li>

            <Select
              {...register("category")}
              placeholder={category}
              defaultValue={selectCategoryOptions.find(
                (option) =>
                  option.value.toLowerCase() === category.toLowerCase(),
              ).value}
              className={styles.drop}
              required
              onChange={handleUpdateCategory}
            >
              {selectCategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </ul>
        </div>
        <div className={styles.imageActions}>
          <a href={url}><img src="/download_icon.png" width={24}/></a>
          <a onClick={handleClickReplaceImage}><img src="/edit_icon.png" width={24}/></a>
        </div>
        <div className={styles.image}>
          <div hidden={isReplaceImageDropzoneOpen}>
          <img src={url} />
          </div>
        <div hidden={!isReplaceImageDropzoneOpen}>
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          <p>
            Drag and drop panoramas here;
            <br />
            Or click to open the file dialog
          </p>
        </div>
        </div>
        </div>
        <div hidden={!isLoading}>
        <div id={styles.loading}>
          <CircularProgress />
        </div></div>
      </div>
    </React.Fragment>
  );
}
