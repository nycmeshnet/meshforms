"use client";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PanoramaViewer.module.scss";
import { Button, CircularProgress } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import PanoramaViewerCard from "../PanoramaViewerCard/PanoramaViewerCard";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import {
  ModelType,
  modelTypeToAPIRouteMap,
  modelTypeToLabelMap,
} from "@/app/types";
import PanoHeader from "../Pano/Header/PanoHeader";

type FormValues = {
  modelNumber: number;
};

export type { FormValues };

export type Image = {
  id: string;
  original_filename: string;
  timestamp: string;
  category: string;
  url: string;
}

interface PanoramaViewerProps {
  urlModelNumber: string;
  urlModelType: ModelType | undefined;
}

export const modelSelectOptions = [
  {
    value: ModelType.InstallNumber,
    label: modelTypeToLabelMap.get(ModelType.InstallNumber),
  },
  {
    value: ModelType.NetworkNumber,
    label: modelTypeToLabelMap.get(ModelType.NetworkNumber),
  },
];

export default function PanoramaViewer({
  urlModelNumber,
  urlModelType,
}: PanoramaViewerProps) {
  // Authentication
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");
  useEffect(() => {
    // Query for images if we have a number
    if (!!urlModelNumber && !!urlModelType) {
      console.debug(
        `Page loaded. Querying for ${urlModelType}: ${urlModelNumber}.`,
      );
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
  const [images, setImages] = React.useState<Image[]>([]);

  // Model passed in via URL or set in search bar
  const [selectedModel, setSelectedModel] = React.useState(
    urlModelType ?? ModelType.InstallNumber,
  );

  // Number passed in via URL or set in search bar
  const [modelNumber, setModelNumber] = React.useState(urlModelNumber);

  // Runs when you click "Search" on the search bar
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.debug(
      `Search button clicked. Querying for ${selectedModel}: ${JSON.stringify(data)}.`,
    );
    setIsLoading(true);
    setModelNumber(String(data.modelNumber));

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
      <PanoHeader />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "gray" }}>
          {modelTypeToLabelMap.get(selectedModel)} {modelNumber}
        </h2>
        <div className={styles.panoNavBar}>
          {/*TODO (wdn): The search bar should probably be its own component.*/}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.formBody}>
            <Select
              name="modelSelect"
              placeholder={modelTypeToLabelMap.get(selectedModel)}
              options={modelSelectOptions}
              onChange={(selected) => {
                selected ? setSelectedModel(selected.value) : null;
              }}
              className={styles.modelSelectDropdown}
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
              style={{ margin: 0, height: "2.4em" }}
            >
              {isLoading ? "Loading..." : "Search"}
            </Button>
            <div hidden={!isLoading}>
              <CircularProgress />
            </div>
          </form>
        </div>
      </div>
      <div className={styles.panoramaLiskeyt}>
        {images.length > 0 &&
          images.map((image: Image, index) => (
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
      {images.length === 0 && modelNumber !== "" && (
        <h2 style={{ color: "gray" }}>Found no images.</h2>
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
