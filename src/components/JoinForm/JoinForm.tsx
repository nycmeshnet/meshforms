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
import { saveJoinRecordToS3 } from "@/lib/join_record";
import { getMeshDBAPIEndpoint } from "@/lib/endpoint";
import InfoConfirmationDialog from "../InfoConfirmation/InfoConfirmation";
import { JoinRecord } from "@/lib/types";
import { useTranslations } from "next-intl";

export class JoinFormValues {
  constructor(
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
  constructor(
    public detail: string = "",
    public building_id: string = "", // UUID
    public member_id: string = "", // UUID
    public install_id: string = "", // UUID
    public install_number: number | null = null,
    public member_exists: boolean = false,
    public changed_info: { [id: string]: string } = {},
  ) {}
}

type ConfirmationField = {
  key: keyof JoinFormValues;
  original: string;
  new: string;
};

export type { ConfirmationField };


export default function JoinForm() {
  const t = useTranslations("JoinForm");
  const selectStateOptions = [
    { value: "NY", label: t("states.NY") },
    { value: "NJ", label: t("states.NJ") },
  ];
  let defaultFormValues = new JoinFormValues();
  defaultFormValues.state = selectStateOptions[0].value;
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<JoinFormValues>({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInfoConfirmationDialogueOpen, setIsInfoConfirmationDialogueOpen] =
    useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMeshDBProbablyDown, setIsMeshDBProbablyDown] = useState(false);
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
    // Before we try anything else, submit to S3 for safety.
    let record: JoinRecord = Object.assign(
      structuredClone(joinFormSubmission),
      {
        submission_time: new Date().toISOString(),
        code: null,
        replayed: 0,
        install_number: null,
      },
    ) as JoinRecord;

    // FIXME (wdn): The useState is too slow and causes a race condition when
    // we try to use it to determine if we successfully submitted here. I am
    // using jrKey to store the key for later reference and the state will be
    // for testing for now. Sorry Andrew.
    let jrKey = "";

    try {
      jrKey = await saveJoinRecordToS3(record, jrKey);
      setJoinRecordKey(jrKey);
    } catch (error: unknown) {
      console.error(
        `Could not upload JoinRecord to S3. ${JSON.stringify(error)}`,
      );
    }

    // Attempt to submit the Join Form
    try {
      const response = await fetch(
        `${await getMeshDBAPIEndpoint()}/api/v1/join/`,
        {
          method: "POST",
          body: JSON.stringify(joinFormSubmission),
        },
      );
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

      // Grab the HTTP code and the install_number (if we have it) for the joinRecord
      record.code = response.status;
      record.install_number = responseData.install_number;

      // Update the join record with our data if we have it.
      // We have to catch and handle the error if this somehow fails but the join
      // form submission succeeds.
      try {
        jrKey = await saveJoinRecordToS3(record, jrKey);
        setJoinRecordKey(jrKey);
      } catch (error: unknown) {
        console.error(
          `Could not upload JoinRecord to S3. ${JSON.stringify(error)}`,
        );
      }

      if (response.ok) {
        console.debug("Join Form submitted successfully");
        setIsLoading(false);
        setIsSubmitted(true);
        return;
      }

      // If the response was not good, then get angry.
      throw responseData;
    } catch (error: unknown) {
      // If MeshDB is up, the error should always be a JoinResponse
      if (error instanceof JoinFormResponse) {
        if (record.code == 409) {
          // We just need to confirm some information
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

        if (record.code !== null && 500 <= record.code && record.code <= 599) {
          // If it was the server's fault, then just accept the record and move
          // on.
          setIsMeshDBProbablyDown(true);
          setIsLoading(false);
          setIsSubmitted(true);
          // Log the error to the console
          console.error(error.detail);
          return;
        }

        // If it was another kind of 4xx, the member did something wrong and needs
        // to fix their information (i.e. move out of nj)
        const detail = error.detail;
        // This looks disgusting when Debug is on in MeshDB because it replies with HTML.
        // There's probably a way to coax the exception out of the response somewhere
        toast.error(`Could not submit Join Form: ${detail}`);
        console.error(`An error occurred: ${detail}`);
        setIsLoading(false);
        return;
      }

      // If we didn't get a JoinFormResponse, we're in trouble. Make sure that
      // we successfully recorded the submission. If we didn't... oof.

      if (jrKey !== "") {
        // If we didn't get a JoinFormResponse, chances are that MeshDB is hard down.
        // Tell the user we recorded their submission, but change the message.
        setIsMeshDBProbablyDown(true);
        setIsLoading(false);
        setIsSubmitted(true);
      } else {
        // If MeshDB is down AND we failed to save the Join Record, then we should
        // probably let the member know to try again later.
        toast.error(
          `Could not submit Join Form. Please try again later, or contact support@nycmesh.net for assistance.`,
        );
        setIsLoading(false);
      }

      // Log the message to the console.
      if (error instanceof Error) {
        console.error(`An error occurred: ${error.message}`);
        return;
      }

      console.error(`An unknown error occurred: ${JSON.stringify(error)}`);
      return;
    }
  }

  const onSubmit: SubmitHandler<JoinFormValues> = (data) => {
    setIsLoading(true);
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
      {t("banner")}
    </p>
  );

  return (
    <>
      <div className={isSubmitted ? styles.hidden : styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>{t("title")}</h2>
          {isBeta ? betaDisclaimerBanner : welcomeBanner}
          <div>
            <h3>{t("sections.personalInfo")}</h3>
            <input
              {...register("first_name", {
                required: "Please enter your first name",
              })}
              type="text"
              placeholder={t("fields.firstName")}
              required
            />
            <input
              {...register("last_name", {
                required: "Please enter your last name",
              })}
              type="text"
              placeholder={t("fields.lastName")}
              required
            />

            <input
              {...register("email_address", {
                required: "Please enter your email address",
              })}
              type="email"
              placeholder={t("fields.emailAddress")}
              required
            />

            <input
              {...register("phone_number", {
                required: "Please enter your phone number",
              })}
              type="tel"
              placeholder={t("fields.phoneNumber.phoneNumber")}
              onBlur={handlePhoneNumberBlur}
            />
            <p style={{ color: "red" }} hidden={!isBadPhoneNumber}>
              {t("fields.phoneNumber.error")}
            </p>
          </div>

          <div className={styles.block}>
            <h3>{t("sections.addressInfo")}</h3>
            <input
              {...register("street_address", {
                required: "Please enter your street address",
              })}
              type="text"
              placeholder={t("fields.streetAddress")}
              required
            />
            <input
              {...register("apartment", {
                required: "Please enter your apartment number",
              })}
              type="text"
              placeholder={t("fields.unit")}
              required
            />
            <input
              {...register("city", { required: "Please enter your city" })}
              type="text"
              placeholder={t("fields.city")}
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
              placeholder={t("fields.zipCode")}
              required
            />
            <label>
              <input {...register("roof_access")} type="checkbox" />
              {t("fields.roofAccess")}
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
          {/*
          <div>
            <p>State Debugger</p>
            isLoading: {isLoading ? "true" : "false"}<br/>
            isSubmitted: {isSubmitted ? "true" : "false"}<br/>
            isBadPhoneNumber: {isBadPhoneNumber ? "true" : "false"}<br/>
            !isValid: {!isValid ? "true" : "false"}<br/>
          </div>
          */}
          <div className={styles.centered}>
            <Button
              type="submit"
              disabled={
                isLoading || isSubmitted || isBadPhoneNumber || !isValid
              }
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
              name="submit_join_form"
              id="button-submit-join-form"
            >
              {isLoading ? t("fields.submit.loading") : isSubmitted ? t("fields.submit.thanks") : t("fields.submit.submit")}
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
          <p id="p-thank-you-01">
            You will receive an email from us in the next{" "}
            {isMeshDBProbablyDown ? "2-3 days" : "5-10 minutes"} with next
            steps, including how to submit panorama photos.
          </p>
          <p id="p-thank-you-02">
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
