"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./PanoramaDropzone.module.scss";

interface PreviewFile extends File {
  preview?: string;
}

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

interface PanoramaDropzoneProps {
  onFileDrop: (dropzoneImages: PreviewFile[]) => void;
}

const PanoramaDropzone: React.FC<PanoramaDropzoneProps> = ({ onFileDrop }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: PreviewFile[]) => {
      acceptedFiles.forEach((file) => {
        file.preview = URL.createObjectURL(file);
      });
      setFiles(acceptedFiles); // Store files locally
      onFileDrop(acceptedFiles); // Pass files to main form via callback
    },
    [onFileDrop],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const filenames = files.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size / 1000} KB
    </li>
  ));

  const thumbs = files.map((file) => (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 2,
        border: "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: "border-box",
      }}
      key={file.name}
    >
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            if (file.preview !== undefined) {
              URL.revokeObjectURL(file.preview);
            }
          }}
          key={file.name}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => { if (file.preview !== undefined) {URL.revokeObjectURL(file.preview)}});
  }, [files]);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          <p>
            Drag and drop panoramas here;
            <br />
            Or click to open the file dialog
          </p>
        </div>
        <div className={styles.thumbsContainer}>{thumbs}</div>
      </div>
      {/*XXX (wdn): It would be very cool if I could integrate the file names into the photos.*/}
      <div className={styles.itemList}>
        <h4>Files</h4>
        <ul>{filenames}</ul>
      </div>
    </div>
  );
};

export default PanoramaDropzone;
