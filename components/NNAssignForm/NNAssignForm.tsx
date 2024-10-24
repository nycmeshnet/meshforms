"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./NNAssignForm.module.scss";
import { Alert } from "@mui/material";
import { getMeshDBAPIEndpoint } from "@/app/endpoint";
import { toast } from "react-toastify";

type NNAssignRequestValues = {
  install_number: string;
  password: string;
};

export type { NNAssignRequestValues };

export function NNAssignForm() {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<NNAssignRequestValues>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkNumber, setNetworkNumber] = useState("");

  async function submitNNAssignRequest(input: NNAssignRequestValues) {
    setIsSubmitted(true);
    return fetch(`${await getMeshDBAPIEndpoint()}/api/v1/nn-assign/`, {
      method: "POST",
      body: JSON.stringify(input),
    })
      .then(async (response) => {
        if (response.ok) {
          const responseJson = await response.json();
          setNetworkNumber(responseJson.network_number);
        }
      })
      .catch(async (error) => {
        const errorJson = await error.json();
        const detail = await errorJson.detail;
        toast.error(`Could not assign NN: ${detail}`);
        setIsSubmitted(false);
      });
  }

  const onSubmit: SubmitHandler<NNAssignRequestValues> = (data) => {
    console.log(data);
    submitNNAssignRequest(data);
  };

  return (
    <>
      <div className={styles.formBody}>
        <form action={handleSubmit(onSubmit)}>
          <h2>Request Network Number</h2>
          <p>
            Enter an install number and the Pre-Shared Key, and receive a
            Network Number
          </p>
          <br />
          <div className={styles.horizontal}>
            <input
              {...register("install_number", {
                required: "Please enter your first name",
              })}
              type="number"
              placeholder="Install Number"
              required
            />
            <input
              {...register("password", {
                required: "Please enter your password",
              })}
              type="password"
              placeholder="Pre-Shared Key"
              required
            />
          </div>
          <div className={styles.centered}>
            <Button
              type="submit"
              disabled={isSubmitted || !isDirty || !isValid}
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
        <div hidden={isNaN(parseInt(networkNumber))} id="alert-network-number">
          <Alert>
            <h3 className={styles.nnLabel}>Your Network Number:</h3>
            <h1 id="assigned-network-number">{networkNumber}</h1>
          </Alert>
        </div>
    </>
  );
}
