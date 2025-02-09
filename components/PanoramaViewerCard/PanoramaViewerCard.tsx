import React from "react";

import styles from "./PanoramaViewerCard.module.scss";
import { MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";

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

  return (
    <React.Fragment>
      <div className={styles.card}>
        <div className={styles.imageMetadata}>
          <ul>
            <li>{originalFilename}</li>
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
          <img src="/edit_icon.png" width={24} onClick={handleReplace}/>
        </div>
        <div className={styles.image}>
          <img src={url} />
        </div>
      </div>
    </React.Fragment>
  );
}
