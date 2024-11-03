"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./JoinForm.module.scss";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  CircularProgress,
  MenuItem,
  Select,
  Button,
  Alert,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveJoinRecordToS3 } from "@/app/join_record";
import { getMeshDBAPIEndpoint } from "@/app/endpoint";
import InfoConfirmationDialog from "../InfoConfirmation/InfoConfirmation";
import { JoinRecord } from "@/app/types";

export class JoinFormValues {
  constructor (
    public first_name: string = "",
    public last_name: string = "",
    public email_address: string = "",
    public phone_number: string = "",
    public street_address: string = "",
    public apartment: string = "",
    public city: string = "",
    public state: string = "",
    public zip_code: string = "",
    public roof_access: boolean = false,
    public referral: string = "",
    public ncl: boolean = false,
    public trust_me_bro: boolean = false,
  ) {}
}

export class JoinFormResponse {
  constructor (
    public detail: string = "",
    public building_id: string = "", // UUID
    public member_id: string = "", // UUID
    public install_id: string = "", // UUID
    public install_number: number | null = null,
    public member_exists: boolean = false,
    public changed_info: { [id: string] : string; } = {},
  ){}
}

type ConfirmationField = {
  key: keyof JoinFormValues;
  original: string;
  new: string;
};

export type { ConfirmationField };

const selectStateOptions = [
  { value: "NY", label: "New York" },
  { value: "NJ", label: "New Jersey" },
];

export default function App() {
  let defaultFormValues = new JoinFormValues();
  defaultFormValues.state = selectStateOptions[0].value;
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<JoinFormValues>({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInfoConfirmationDialogueOpen, setIsInfoConfirmationDialogueOpen] =
    useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBadPhoneNumber, setIsBadPhoneNumber] = useState(false);
  const [joinRecordKey, setJoinRecordKey] = useState("");

  const isBeta = true;

  // Store the values submitted by the user or returned by the server
  const [infoToConfirm, setInfoToConfirm] = useState<Array<ConfirmationField>>([
    { key: "" as keyof JoinFormValues, original: "", new: "" },
  ]);

  const handlePhoneNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputPhoneNumber = e.target.value;
    const parsedPhoneNumber = parsePhoneNumberFromString(
      inputPhoneNumber,
      "US",
    ); // Adjust the country code as needed

    if (parsedPhoneNumber) {
      setIsBadPhoneNumber(false);
      // Format the number and set the formatted value in react-hook-form
      setValue(
        "phone_number",
        parsedPhoneNumber
          .formatInternational()
          .replace(/ (\d{3}) (\d{4})$/, "-$1-$2"),
      );
    } else {
      setIsBadPhoneNumber(true);
    }
  };

  // Closes dialog, updates the values, and tries the submission again
  const handleClickConfirm = () => {
    setIsInfoConfirmationDialogueOpen(false);
    let joinFormSubmission: JoinFormValues = getValues();

    // Create an object with the new values to update
    const updates = Object.fromEntries(
      infoToConfirm.map((field) => [field.key, field.new]),
    );

    joinFormSubmission = {
      ...joinFormSubmission,
      ...updates,
      trust_me_bro: true,
    };

    submitJoinFormToMeshDB(joinFormSubmission);
  };

  // Closes the dialog and just sends it
  const handleClickReject = () => {
    setIsInfoConfirmationDialogueOpen(false);
    let joinFormSubmission: JoinFormValues = getValues();

    joinFormSubmission.trust_me_bro = true;

    submitJoinFormToMeshDB(joinFormSubmission);
  };

  // Closes the dupe dialog and allows the user to make chances
  const handleClickCancel = () => {
    setIsInfoConfirmationDialogueOpen(false);
    setIsLoading(false);
  };

  async function submitJoinFormToMeshDB(joinFormSubmission: JoinFormValues) {
    console.log("entrypoint into submit function");
    // Before we try anything else, submit to S3 for safety.
    let record: JoinRecord = Object.assign(
      structuredClone(joinFormSubmission),
      {
        submission_time: new Date().toISOString(),
        code: "",
        replayed: 0,
        install_number: null,
      },
    ) as JoinRecord;


    console.log("hello-1");
    setJoinRecordKey(await saveJoinRecordToS3(record, joinRecordKey) as string);
    console.log("hello0");

    try {
      const response = await fetch(`${await getMeshDBAPIEndpoint()}/api/v1/join/`, {
        method: "POST",
        body: JSON.stringify(joinFormSubmission),
      });
      console.log("hello");
      const j = await response.json();
      const responseData = new JoinFormResponse(
        j.detail,
        j.building_id,
        j.member_id,
        j.install_id,
        j.install_number,
        j.member_exists,
        j.changed_info,
      );
      console.log("hello2");

      // Grab the HTTP code and the install_number (if we have it) for the joinRecord
      record.code = response.status.toString();
      record.install_number = responseData.install_number;
      console.log("hello3");

      // Update the join record with our data if we have it.
      setJoinRecordKey(await saveJoinRecordToS3(record, joinRecordKey) as string);
      console.log("hello4");

      if (response.ok) {
          console.debug("Join Form submitted successfully");
          setIsLoading(false);
          setIsSubmitted(true);
          return;
      }

      // If the response was not good, then get angry.
      throw responseData;
    } catch (error: unknown) {
      if (error instanceof JoinFormResponse) {
        // We just need to confirm some information
        if (record.code == "409") {
          let needsConfirmation: Array<ConfirmationField> = [];
          const changedInfo = error.changed_info;

          for (const key in joinFormSubmission) {
            if (
              joinFormSubmission.hasOwnProperty(key) &&
              changedInfo.hasOwnProperty(key)
            ) {
              const originalValue = String(
                joinFormSubmission[key as keyof JoinFormValues],
              );
              needsConfirmation.push({
                key: key as keyof JoinFormValues,
                original: originalValue,
                new: changedInfo[key],
              });
            }
          }

          setInfoToConfirm(needsConfirmation);
          setIsInfoConfirmationDialogueOpen(true);
          toast.warning("Please confirm some information");
          return;
        }

        const detail = error.detail;
        // This looks disgusting when Debug is on in MeshDB because it replies with HTML.
        // There's probably a way to coax the exception out of the response somewhere
        toast.error(`Could not submit Join Form: ${detail}`);
        console.error(`An error occurred: ${detail}`);
        setIsLoading(false);
        return;
      }

      if (error instanceof Error) {
        console.error(`An error occurred: ${error.message}`);
        toast.error(`An error occurred: ${error.message}`);
        return;
      }

      console.error(`An unknown error occurred: ${JSON.stringify(error)}`);
      toast.error(`An unknown error occurred: ${JSON.stringify(error)}`);
      return;
    }
  }

  const onSubmit: SubmitHandler<JoinFormValues> = (data) => {
    console.log("hello-4");
    setIsLoading(true);
    console.log("hello-3");
    data.trust_me_bro = false;
    submitJoinFormToMeshDB(data);
  };

  const betaDisclaimerBanner = (
    <p style={{ backgroundColor: "yellow" }}>
      This form is not production ready. Please fill out{" "}
      <a href="https://www.nycmesh.net/join">this form</a> instead.
    </p>
  );

  const welcomeBanner = (
    <p>
      Join our community network! Fill out the form, and we will reach out over
      email shortly.
    </p>
  );

  return (
    <>
      <div className={isSubmitted ? styles.hidden : styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Join NYC Mesh</h2>
          {isBeta ? betaDisclaimerBanner : welcomeBanner}
          <div>
            <h3>Personal Info</h3>
            <input
              {...register("first_name", {
                required: "Please enter your first name",
              })}
              type="text"
              placeholder="First Name"
              required
            />
            <input
              {...register("last_name", {
                required: "Please enter your last name",
              })}
              type="text"
              placeholder="Last Name"
              required
            />

            <input
              {...register("email_address", {
                required: "Please enter your email address",
              })}
              type="email"
              placeholder="Email Address"
              required
            />

            <input
              {...register("phone_number", {
                required: "Please enter your phone number",
              })}
              type="tel"
              placeholder="Phone Number"
              onBlur={handlePhoneNumberBlur}
            />
            <p style={{ color: "red" }} hidden={!isBadPhoneNumber}>
              Please enter a valid phone number
            </p>
          </div>

          <div className={styles.block}>
            <h3>Address Info</h3>
            <input
              {...register("street_address", {
                required: "Please enter your first name",
              })}
              type="text"
              placeholder="Street Address"
              required
            />
            <input
              {...register("apartment", {
                required: "Please enter your apartment number",
              })}
              type="text"
              placeholder="Unit / Apartment #"
              required
            />
            <input
              {...register("city", { required: "Please enter your city" })}
              type="text"
              placeholder="City"
              required
            />
            <Select
              {...register("state")}
              placeholder="State"
              defaultValue={selectStateOptions[0].value}
              className={styles.drop}
              required
            >
              {selectStateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <input
              {...register("zip_code", {
                required: "Please enter your ZIP code",
              })}
              type="number"
              placeholder="Zip Code"
              required
            />
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
            <input
              {...register("ncl", { required: "Please agree to the NCL!" })}
              type="checkbox"
              required
            />
            I agree to the{" "}
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
              /*disabled={
                isLoading ||
                isSubmitted ||
                isBadPhoneNumber ||
                !isDirty ||
                !isValid
              }*/
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
              name="submit_join_form"
              id="button-submit-join-form"
            >
              {isLoading ? "Loading..." : isSubmitted ? "Thanks!" : "Submit"}
            </Button>
            <div hidden={!isLoading}>
              <CircularProgress />
            </div>
          </div>
        </form>
      </div>
      <div data-testid="toasty" className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
      <div hidden={!isSubmitted}>
        <Alert className={styles.thanks} id="alert-thank-you">
          <h2 id="alert-thank-you-h2">Thanks! Please check your email.</h2>
        </Alert>
        <div className={styles.thanksBlurb}>
          <p>
            You will receive an email from us in the next 5-10 minutes with next
            steps, including how to submit panorama photos.
          </p>
          <p>
            If you do not see the email, please check your "Spam" folder, or
            email <a href="mailto:support@nycmesh.net">support@nycmesh.net</a>{" "}
            for help.
          </p>
        </div>
        <div className={styles.centered} style={{ padding: "10px" }}>
          <Button name="home" variant="contained" size="large" href="/">
            Go Home
          </Button>
        </div>
      </div>
      <InfoConfirmationDialog
        infoToConfirm={infoToConfirm}
        isDialogOpened={isInfoConfirmationDialogueOpen}
        handleClickConfirm={handleClickConfirm}
        handleClickReject={handleClickReject}
        handleClickCancel={handleClickCancel}
      />
      <div data-testid="test-join-record-key" data-state={joinRecordKey}></div>
    </>
  );
}
