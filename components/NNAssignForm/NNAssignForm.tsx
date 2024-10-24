"use client";

import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./NNAssignForm.module.scss";


export function NNAssignForm() {
  return (
    <>
      <div className={styles.formBody}>
        <form action={sendForm}>
          <h2>Request Network Number</h2>
          <p>
            Enter an install number and the Pre-Shared Key, and receive a
            Network Number
          </p>
          <br />
          <div className={styles.horizontal}>
            <input
              type="number"
              name="install_number"
              placeholder="Install Number"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Pre-Shared Key"
              required
            />
          </div>
          <div className={styles.centered}>
            <Button
              type="submit"
              disabled={disableSubmitButton}
              hidden={disableSubmitButton}
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
            >
              Submit
            </Button>
          </div>
          <h3 hidden={!disableSubmitButton} className={styles.nnLabel}>
            Your Network Number:
          </h3>
          <h1 hidden={!disableSubmitButton} id="">
            {networkNumber}
          </h1>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
