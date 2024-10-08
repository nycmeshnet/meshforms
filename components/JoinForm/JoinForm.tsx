"use client"

import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import styles from "./JoinForm.module.scss";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { CircularProgress, MenuItem, Select, Button } from "@mui/material";
import { ToastContainer } from "react-toastify";


type FormValues = {
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  roofAccess: boolean
  referral: string
  ncl: boolean
}

const selectStateOptions = [
  { value: "NY", label: "New York" },
  { value: "NJ", label: "New Jersey" },
];

export default function App() {
  const { register, setValue, handleSubmit } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data)

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handlePhoneNumberBlur = (e) => {
    const inputPhoneNumber = e.target.value;
    const parsedPhoneNumber = parsePhoneNumberFromString(inputPhoneNumber, "US"); // Adjust the country code as needed

    if (parsedPhoneNumber) {
      // Format the number and set the formatted value in react-hook-form
      setValue("phoneNumber", parsedPhoneNumber.formatInternational().replace(/ (\d{3}) (\d{4})$/, '-$1-$2'));
    } else {

    }
  };

  /*
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="email" {...register("email")} />


      <input type="submit" />
    </form>
  )*/

  /*<p>Join our community network! Fill out the form, and we will reach out over email shortly.</p>*/
  return (
    <>
      <div className={styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Join NYC Mesh</h2>
          <p style={{ backgroundColor: "yellow" }}>
            This form is not production ready. Please fill out{" "}
            <a href="https://www.nycmesh.net/join">this form</a> instead.
          </p>
          <div>
            <h3>Personal Info</h3>
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              required
            />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              required
            />

            <input
              {...register("emailAddress")}
              type="email"
              placeholder="Email Address"
              required
            />

            {/*TODO: Re-implement PhoneInput*/}
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="Phone Number"
              onBlur={handlePhoneNumberBlur}
            />
          </div>

          <div className={styles.block}>
            <h3>Address Info</h3>
            <input
              {...register("streetAddress")}
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
            <input {...register("zipCode")} type="number" placeholder="Zip Code" required />
            <label>
              <input {...register("roofAccess")} type="checkbox" />
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
        <ToastContainer />
      </div>
    </>
  );

}
