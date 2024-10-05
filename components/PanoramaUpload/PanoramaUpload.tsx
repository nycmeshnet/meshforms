"use client"
// Idea: Have people validate their panoramas with their email?
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  files: FileList;
};

const PanoramaUploadForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  // Define the submit handler
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const files = data.files;
    
    // Process the files
    Array.from(files).forEach(file => {
      console.log(file.name);
      // TODO: Uplaod photos to S3 via Pano
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        {...register("files", { required: true })}
        multiple
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default PanoramaUploadForm;

