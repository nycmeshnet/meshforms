"use client"

import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import styles from "./JoinForm.module.scss";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { CircularProgress, MenuItem, Select, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { recordJoinFormSubmissionToS3 } from "@/app/data";
import { submitJoinForm } from "@/app/api";
import { getMeshDBAPIEndpoint, submitJoinFormToMeshDB } from "@/app/endpoint";


type JoinFormValues = {
  first_name: string
  last_name: string
  email_address: string
  phone_number: string
  street_address: string
  apartment: string
  city: string
  state: string
  zip_code: string
  roof_access: boolean
  referral: string
  ncl: boolean
  trust_me_bro: boolean
}

export type {JoinFormValues};

const selectStateOptions = [
  { value: "NY", label: "New York" },
  { value: "NJ", label: "New Jersey" },
];

export default function App() {
  const { register, setValue, handleSubmit } = useForm<JoinFormValues>()

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isBadPhoneNumber, setIsBadPhoneNumber] = useState(false);
  const isBeta = true;
  
  const handlePhoneNumberBlur = (e) => {
    const inputPhoneNumber = e.target.value;
    const parsedPhoneNumber = parsePhoneNumberFromString(inputPhoneNumber, "US"); // Adjust the country code as needed

    if (parsedPhoneNumber) {
      setIsBadPhoneNumber(false);
      // Format the number and set the formatted value in react-hook-form
      setValue("phone_number", parsedPhoneNumber.formatInternational().replace(/ (\d{3}) (\d{4})$/, '-$1-$2'));
    } else {
      setIsBadPhoneNumber(true);
    }
  };

  
  async function submitJoinFormToMeshDB(joinFormSubmission: JoinFormValues, trustMeBro: boolean = false) {
    
  joinFormSubmission.trust_me_bro = trustMeBro;
  return fetch(`${await getMeshDBAPIEndpoint()}/api/v1/join/`, {
      method: "POST",
      body: JSON.stringify(joinFormSubmission),
  })
  .then(async (response) => {
    if (response.ok) {
      console.debug("Join Form submitted successfully");
      toast.success("Thanks! You will receive an email shortly 🙂");
      setIsLoading(false);
    }
    if (response.status == 409) {
      const imagesDuplicated = Object.entries(await response.json());
      console.debug(imagesDuplicated);
      //setPossibleDuplicates(imagesDuplicated);
      //setIsDuplicateDialogOpen(true);
      toast.warning("Please confirm some information");
      return;
    }
    if (response.status == 500) {
      // This looks disgusting when Debug is on in MeshDB because it replies with HTML. 
      // There's probably a way to coax the exception out of the response somewhere 
      toast.error(`Could not submit Join Form: ${await response.text()}`);
      setIsLoading(false);
    }
  })
  .catch((error) => {
    // TODO (wdn): Submit errors to the server?
    //console.error("Join Form submission error:", error);
    toast.error(`Could not submit Join Form`);
    setIsLoading(false);
  });
}

  const onSubmit: SubmitHandler<JoinFormValues> = (data) => {
    console.debug(data)
    setIsLoading(true);
    recordJoinFormSubmissionToS3(data);
    submitJoinFormToMeshDB(data);
  }

  const betaDisclaimerBanner = (
    <p style={{ backgroundColor: "yellow" }}>
      This form is not production ready. Please fill out{" "}
      <a href="https://www.nycmesh.net/join">this form</a> instead.
    </p>
  );

  const welcomeBanner = (
    <p>Join our community network! Fill out the form, and we will reach out over email shortly.</p>
  );

  return (
    <>
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Join NYC Mesh</h2>
          {isBeta ? betaDisclaimerBanner : welcomeBanner}
          <div>
            <h3>Personal Info</h3>
            <input
              {...register("first_name")}
              type="text"
              placeholder="First Name"
              required
            />
            <input
              {...register("last_name")}
              type="text"
              placeholder="Last Name"
              required
            />

            <input
              {...register("email_address")}
              type="email"
              placeholder="Email Address"
              required
            />

            <input
              {...register("phone_number")}
              type="tel"
              placeholder="Phone Number"
              onBlur={handlePhoneNumberBlur}
            />
            <p style={{color:"red"}} hidden={!isBadPhoneNumber}>Please enter a valid phone number</p>
          </div>

          <div className={styles.block}>
            <h3>Address Info</h3>
            <input
              {...register("street_address")}
              type="text"
              placeholder="Street Address"
              required
            />
            <input type="text" name="apartment" placeholder="Unit #" required />
            <input type="text" name="city" placeholder="City" required />
            <Select
              {...register("state")} 
              placeholder="State"
              defaultValue={selectStateOptions[0].label}
              className={styles.drop}
              required
            >
              {selectStateOptions.map((option) => (
                <MenuItem key={option.value} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <input {...register("zip_code")} type="number" placeholder="Zip Code" required />
            <label>
              <input {...register("roof_access")} type="checkbox" />
              Check this box if you have roof access
            </label>
          </div>
          <br />
          <input
            {...register("referral")}
            type="text"
            placeholder="How did you hear about us?"
          />
          <label>
            <input {...register("ncl")} type="checkbox" required />I agree to the{" "}
            <a
              href="https://www.nycmesh.net/ncl.pdf"
              target="_blank"
              style={{ color: "black" }}
            >
              Network Commons License
            </a>
          </label>
          <div className={styles.centered}>
            <Button
              type="submit"
              disabled={isLoading || submitted}
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
              name="submit_join_form"
            >
              {isLoading ? "Loading..." : submitted ? "Thanks!" : "Submit"}
            </Button>
            <div hidden={!isLoading}>
            <CircularProgress/>
            </div>
          </div>
        </form>
      </div>
      <div className="toasty">
        <ToastContainer
          hideProgressBar={true}
          theme={"colored"}
        />
      </div>
    </>
  );

}
