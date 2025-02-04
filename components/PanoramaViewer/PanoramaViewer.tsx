"use client";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PanoramaViewer.module.scss";
import { Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";

type FormValues = {
  installNumber: number;
};

export type { FormValues };

function PanoramaViewer() {
  // React hook form stuff
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([{}]);

  function getImages(installNumber: number) {
    fetch(`http://127.0.0.1:8089/api/v1/install/${installNumber}`).then(
      async (response) => {
        const images = await response.json();
        console.log(images);
        setImages(images);
        setIsLoading(false);
      },
    );
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.debug(data);
    setIsLoading(true);
    //setFormSubmission(data); // Side Effect: Submits the form
    getImages(data.installNumber);
  };

  return (
    <>
      <h2>Image Viewer</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className={styles.panoramaList}>
        {
          images.map((image, index) => (
            <div>
              <div className={styles.imageMetadata}>
                <ul>
                  <li>{image.original_filename}</li>
                  <li>{image.timestamp}</li>
                  <li>{image.category}</li>
                </ul>
              </div>
              <div className={styles.image}><img src={image.url}/></div>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default PanoramaViewer;
