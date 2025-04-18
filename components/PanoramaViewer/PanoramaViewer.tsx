"use client";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PanoramaViewer.module.scss";
import { Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import PanoramaViewerCard from "../PanoramaViewerCard/PanoramaViewerCard";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { ModelType } from "@/app/types";

type FormValues = {
  modelNumber: number;
};

export type { FormValues };

interface PanoramaViewerProps {
  urlModelNumber: string;
  urlModelType: ModelType;
}

const modelSelectOptions = [
  { value: ModelType.InstallNumber, label: "Install #" },
  { value: ModelType.NetworkNumber, label: "Network Number" },
];

const modelTypeToAPIRouteMap = new Map<ModelType, string>([
  [ModelType.InstallNumber, "install"],
  [ModelType.NetworkNumber, "nn"],
]);

const modelTypeToLabelMap = new Map<ModelType, string>([
  [ModelType.InstallNumber, "Install #"],
  [ModelType.NetworkNumber, "Network Number"],
]);

export default function PanoramaViewer({
  urlModelNumber,
  urlModelType,
}: PanoramaViewerProps) {
  // Authentication
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");
  useEffect(() => {
    // Query for images if we have a number
    if (urlModelNumber !== undefined) {
      console.debug(`Page loaded. Querying for ${urlModelType}: ${urlModelNumber}.`);
      getImages(Number(urlModelNumber), urlModelType);
    }

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState([]);

  // Model passed in via URL or set in search bar
  const [selectedModel, setSelectedModel] = React.useState(
    urlModelType,
  );

  // Number passed in via URL or set in search bar
  const [modelNumber, setModelNumber] = React.useState(urlModelNumber);

  // Runs when you click "Search" on the search bar
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.debug(`Search button clicked. Querying for ${selectedModel}: ${JSON.stringify(data)}.`);
    setIsLoading(true);
    setModelNumber(data.modelNumber);

    // Query for the images and update the URL
    window.history.pushState(
      "View images on Pano",
      "",
      `/pano/view/${modelTypeToAPIRouteMap.get(selectedModel)}/${data.modelNumber}`,
    );
    getImages(data.modelNumber, selectedModel);
  };

  // Retrieves images from the Pano API
  function getImages(modelNumber: number, modelType: ModelType) {
    console.log(`Querying for ${modelType}, ${modelNumber}`);
    fetch(
      `http://127.0.0.1:8081/api/v1/${modelTypeToAPIRouteMap.get(modelType)}/${modelNumber}`,
      {
        credentials: "include",
      },
    )
      .then(async (response) => {
        if (!response.ok) {
          throw response;
        }
        const images = await response.json();
        console.log(`Got Images: ${JSON.stringify(images)}`);
        setImages([]);
        setImages(images);
      })
      .catch(async (error) => {
        console.error(error);
        const j = await error.json();
        const msg = `Could not get images: ${j.detail}`;
        toast.error(msg);
      });
      setIsLoading(false);
  }


  return (
    <>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        {isLoggedIn && (
          <p>
            Welcome, {user} (<a href="http://127.0.0.1:8081/logout">Logout</a>)
          </p>
        )}
        {!isLoggedIn && <a href="http://127.0.0.1:8081/login/google">Log In</a>}
      </div>
      <div className={styles.panoNavBar}>
        <a href="/pano/view" style={{ textDecoration: "none", color: "black" }}>
          <div style={{display:"flex", flexDirection:"row"}}>
          <h1>Pano</h1>
          <h2 style={{color:"gray"}}>{modelTypeToAPIRouteMap.get(selectedModel)} {modelNumber}</h2>
          </div>
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
              <Select
                name="modelSelect"
                placeholder="Select NN or Install #"
                options={modelSelectOptions}
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
                key={image.id}
                originalFilename={image.original_filename}
                timestamp={image.timestamp}
                category={image.category}
                url={image.url}
              />
            </div>
          ))}
      </div>
      {images.length === 0 && modelNumber !== "" && (
        <h2 style={{color:"gray"}}>Found no images.</h2>
      )}
      {images.length === 0 && modelNumber === "" && (
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
