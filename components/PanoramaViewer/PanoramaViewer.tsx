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
  installNumber: number;
}

export default function PanoramaViewer({ installNumber }: PanoramaViewerProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  cursorEvents: "none";
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [currentInstallNumber, setCurrentInstallNumber] = React.useState(-1);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");

  function getImages(installNumber: number) {
    fetch(`http://127.0.0.1:8081/api/v1/install/${installNumber}`, {
      credentials: "include",
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJteV9jbGllbnQifQ.zYN1PK0ZRYXg5Md-8Cr8svubDmm1SRQ5SZnwgUAMJGA",
      },
    })
      .then(async (response) => {
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
    window.history.pushState(
      "View images on Pano",
      "",
      `/pano/view/install/${data.installNumber}`,
    );
    installNumber = data.installNumber;
  };

  useEffect(() => {
    if (installNumber !== undefined) setCurrentInstallNumber(installNumber);

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
      setUser("");
      setIsLoggedIn(false);
    });
  }, []);

  useEffect(() => {
    if (currentInstallNumber !== -1) {
      getImages(currentInstallNumber);
    }
  }, [currentInstallNumber]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        {isLoggedIn && <p>Welcome, {user}</p>}
        {!isLoggedIn && <a href="http://127.0.0.1:8081/login/google">Log In</a>}
      </div>
      <div className={styles.panoNavBar}>
        <a href="/pano/view" style={{ textDecoration: "none", color: "black" }}>
          <h1>Pano</h1>
        </a>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <a
            href={"/pano/upload"}
            style={{ padding: "10px" }}
            className={`${!isLoggedIn ? styles.disabled : ""}`}
          >
            <img src="/upload_icon.png" width={24} />
          </a>
          {/*TODO (wdn): The search bar should probably be its own component.*/}
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
      </div>
      <div className={styles.panoramaList}>
        {images.length > 0 &&
          images.map((image, index) => (
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
      {images.length === 0 && currentInstallNumber !== -1 && (
        <p>Found no images for this Install Number. Try uploading some.</p>
      )}
      {images.length === 0 && currentInstallNumber === -1 && (
        <p>
          To get started, search for an Install Number or click the upload icon.
        </p>
      )}
      <div className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
    </>
  );
}
