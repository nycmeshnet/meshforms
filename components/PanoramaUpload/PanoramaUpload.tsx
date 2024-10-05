"use client"
// Idea: Have people validate their panoramas with their email?
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  files: FileList;
};

const PanoramaUploadForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  // Define the submit handler
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const files = data.files;
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files[]', file);
    });
    
    // Process the files
    Array.from(files).forEach(file => {
      console.log(file.name);
      // TODO: Uplaod photos to S3 via Pano
      fetch('http://127.0.0.1:8089/upload', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        if (response.ok) {
          console.log('Files uploaded successfully');

          toast.success("Upload Successful!", {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }).catch((error) => {
        console.error('File upload error:', error);

        toast.error(`File upload error: ${error}`, {
          hideProgressBar: true,
          theme: "colored",
        });
      });

    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        {...register("files", { required: true })}
        multiple
      />
      <button type="submit">Upload</button>
    </form>
    <div className="toasty">
      <ToastContainer />
    </div>
    </>
  );
};

export default PanoramaUploadForm;

