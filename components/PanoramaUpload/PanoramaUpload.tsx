"use client"
// Idea: Have people validate their panoramas with their email?
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PanoramaDropzone from "./PanoramaDropzone";

type FormValues = {
  files: FileList;
};

const PanoramaUploadForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const files = data.files;
    const formData = new FormData();

    Array.from(files).forEach(file => {
      formData.append('files[]', file); // Append each file to FormData
    });

    console.log(formData);

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
  };

  return (
    <>
    <form onSubmit={(e) => {
      e.preventDefault();

      // Now get the form data as you regularly would
      const formData = new FormData(e.currentTarget);
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
    }}>
      <PanoramaDropzone name="dropzone-files" required/>
      <button type="submit">Submit</button>
    </form>
    <div className="toasty">
      <ToastContainer />
    </div>
    </>
  );
};

export default PanoramaUploadForm;

