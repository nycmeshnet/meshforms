"use client"
import React, {useRef, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import styles from "./PanoramaDropzone.module.scss";

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function PanoramaDropzone(props) {
  const {required, name} = props;

  const hiddenInputRef = useRef(null);

  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        // Note the specific way we need to munge the file into the hidden input
        // https://stackoverflow.com/a/68182158/1068446
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
    }
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const thumbs = acceptedFiles.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={URL.createObjectURL(file)}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => acceptedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="container">
      <div {...getRootProps({className: styles.dropzone})}>
        {/*
          Add a hidden file input
          Best to use opacity 0, so that the required validation message will appear on form submission
        */}
        <input type ="file" name={name} required={required} style ={{opacity: 0}} ref={hiddenInputRef}/>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>
      <aside className={styles.thumbsContainer}>
        {thumbs}
      </aside>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </div>
  );
}

export default PanoramaDropzone;
