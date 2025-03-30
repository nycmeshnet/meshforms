"use client";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PanoramaViewer.module.scss";
import { Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import PanoramaViewerCard from "../PanoramaViewerCard/PanoramaViewerCard";
import { ToastContainer, toast } from "react-toastify";

type FormValues = {
  installNumber: number;
};

export type { FormValues };

interface PanoramaViewerProps {
  installNumber: number,
}

export default function PanoramaViewer({
  installNumber,
}: PanoramaViewerProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([]);

  function getImages(installNumber: number) {
    fetch(`http://127.0.0.1:8081/api/v1/install/${installNumber}`, {
      credentials: "include",
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJteV9jbGllbnQifQ.zYN1PK0ZRYXg5Md-8Cr8svubDmm1SRQ5SZnwgUAMJGA",
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw response;
      }
      const images = await response.json();
      console.log(images);
      setImages(images);
      setIsLoading(false);
    })
    .catch(async (error) => {
      const msg = `File upload error: ${error}`;
      toast.error(msg);
      setIsLoading(false);
    });
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.debug(data);
    setIsLoading(true);
    //setFormSubmission(data); // Side Effect: Submits the form
    getImages(data.installNumber);
  };
 
  useEffect(() => {
    if (installNumber !== undefined) {
      getImages(installNumber);
    }
  }, []);

  return (
    <>
      <div className={styles.panoNavBar}>
      <h1>Pano</h1>
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
            {isLoading ? "Loading..." : "Search"}
          </Button>
          <div hidden={!isLoading}>
            <CircularProgress />
          </div>
        </div>
      </form>
      </div>
      <div className={styles.panoramaList}>
        {images.length > 0 && images.map((image, index) => (
          <div>
            <PanoramaViewerCard
              id={image.id}
              originalFilename={image.original_filename}
              timestamp={image.timestamp}
              category={image.category}
              url={image.url}
            />
          </div>
        ))}
      </div>
      <div className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
    </>
  );
}

