"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./JoinForm.module.scss";
import "./hide_recaptcha_badge.css";
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
import {
  maybeLogJoinRecordFailure,
  saveJoinRecordToS3,
} from "@/lib/join_record";
import { getMeshDBAPIEndpoint, getRecaptchaKeys } from "@/lib/endpoint";
import InfoConfirmationDialog from "../InfoConfirmation/InfoConfirmation";
import { JoinRecord } from "@/lib/types";
import { useTranslations, useLocale } from "next-intl";
import LocaleSwitcher from "../LocaleSwitcher";
import ReCAPTCHA from "react-google-recaptcha";
import { useIsDeveloper } from "@/lib/AckDevProvider";
import { useEnvContext } from "@/lib/EnvProvider";

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
  const selectStateOptions = [{ value: "NY", label: t("states.NY") }];
  let defaultFormValues = new JoinFormValues();
  defaultFormValues.state = selectStateOptions[0].value;
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormValues>({
    mode: "onBlur",
    defaultValues: defaultFormValues,
  });

  const recaptchaV3Ref = React.useRef<ReCAPTCHA>(null);
  const recaptchaV2Ref = React.useRef<ReCAPTCHA>(null);

  const locale = useLocale();

  const env = useEnvContext();
  const [isDeveloper, showIsDeveloperDialog] = useIsDeveloper();
  if (env?.includes("dev") && !isDeveloper) {
    showIsDeveloperDialog();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isProbablyABot, setIsProbablyABot] = useState(false);
  const [checkBoxCaptchaToken, setCheckBoxCaptchaToken] = useState("");
  const [isInfoConfirmationDialogueOpen, setIsInfoConfirmationDialogueOpen] =
    useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMeshDBProbablyDown, setIsMeshDBProbablyDown] = useState(false);
  const [joinRecordKey, setJoinRecordKey] = useState("");

  const [recaptchaV2Key, setRecaptchaV2Key] = useState<string | undefined>(
    undefined,
  );
  const [recaptchaV3Key, setRecaptchaV3Key] = useState<string | undefined>(
    undefined,
  );
  const [reCaptchaError, setReCaptchaError] = useState<boolean>(false);

  const isBeta = false;

  useEffect(() => {
    (async () => {
      const [v2_key, v3_key] = await getRecaptchaKeys();
      setRecaptchaV2Key(v2_key);
      setRecaptchaV3Key(v3_key);
    })();
  }, [setRecaptchaV2Key, setRecaptchaV3Key]);

  // Store the values submitted by the user or returned by the server
  const [infoToConfirm, setInfoToConfirm] = useState<Array<ConfirmationField>>([
    { key: "" as keyof JoinFormValues, original: "", new: "" },
  ]);

  const validatePhoneNumber = (inputPhoneNumber: string) => {
    // Allow empty submissions for phone number
    if (inputPhoneNumber === "") {
      return true;
    }

    const parsedPhoneNumber = parsePhoneNumberFromString(
      inputPhoneNumber,
      "US",
    ); // Adjust the country code as needed

    if (parsedPhoneNumber) {
      // Format the number and set the formatted value in react-hook-form
      setValue(
        "phone_number",
        parsedPhoneNumber
          .formatInternational()
          .replace(/ (\d{3}) (\d{4})$/, "-$1-$2"),
      );
      return true;
    }

    return false;
  };

  // Closes dialog, updates the values, and tries the submission again
  const handleClickConfirm = (checkBoxCaptchaTokenFromDialog: string) => {
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

    submitJoinFormToMeshDB(joinFormSubmission, checkBoxCaptchaTokenFromDialog);
  };

  // Closes the dialog and just sends it
  const handleClickReject = (checkBoxCaptchaTokenFromDialog: string) => {
    setIsInfoConfirmationDialogueOpen(false);
    let joinFormSubmission: JoinFormValues = getValues();

    joinFormSubmission.trust_me_bro = true;

    submitJoinFormToMeshDB(joinFormSubmission, checkBoxCaptchaTokenFromDialog);
  };

  // Closes the dupe dialog and allows the user to make chances
  const handleClickCancel = () => {
    setIsInfoConfirmationDialogueOpen(false);
    setIsLoading(false);
  };

  async function submitJoinFormToMeshDB(
    joinFormSubmission: JoinFormValues,
    checkboxToken: string,
  ) {
    // Make a Join Record with this info
    let record: JoinRecord = Object.assign(
      structuredClone(joinFormSubmission),
      {
        version: 3,
        uuid: self.crypto.randomUUID(),
        submission_time: new Date().toISOString(),
        code: null,
        replayed: 0,
        install_number: null,
      },
    ) as JoinRecord;

    let preJoinRecordFailed = true;
    let postJoinRecordFailed = true;

    // Before we try anything else, submit the record to the pre-submission
    // S3 bucket for safety.
    try {
      setJoinRecordKey(await saveJoinRecordToS3(record, true));
      preJoinRecordFailed = false; // We got at least one joinRecord.
    } catch (error: unknown) {
      console.error(
        `Could not upload JoinRecord to S3. ${JSON.stringify(error)}`,
      );
    }

    // Attempt to submit the Join Form
    try {
      // Get the v3 captcha token. Per the google docs, the implicit token must be retrieved on form submission,
      // so that the token doesn't expire before server side validation
      let recaptchaInvisibleToken = "";
      if (recaptchaV3Ref?.current && !reCaptchaError) {
        recaptchaInvisibleToken =
          (await recaptchaV3Ref.current.executeAsync()) ?? "";
        recaptchaV3Ref.current.reset();
      } else {
        console.warn(
          "No ref found for the recaptchaV3 component, or component is in error state, not including captcha token in HTTP request",
        );
      }

      const response = await fetch(
        `${await getMeshDBAPIEndpoint()}/api/v1/join/`,
        {
          method: "POST",
          body: JSON.stringify(joinFormSubmission),
          headers: {
            "X-Recaptcha-V2-Token": checkboxToken ? checkboxToken : "",
            "X-Recaptcha-V3-Token": recaptchaInvisibleToken
              ? recaptchaInvisibleToken
              : "",
          },
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

      // Write to the post-submisison bucket with our data if we have it.
      // We have to catch and handle the error if this somehow fails but the join
      // form submission succeeds.
      // FYI: The pre and post keys should be identical, except one of them will
      // have the "pre/" prefix and one will have the "post/" prefix
      try {
        const postJoinRecordKey = await saveJoinRecordToS3(record, false);
        postJoinRecordFailed = false;
        if (postJoinRecordKey !== "") {
          setJoinRecordKey(postJoinRecordKey); // Might as well have the good one
        }
      } catch (error: unknown) {
        console.error(
          `Could not upload JoinRecord to S3. ${JSON.stringify(error)}`,
        );
      }

      if (response.ok) {
        console.debug("Join Form submitted successfully");
        setIsLoading(false);
        setIsSubmitted(true);
        setIsProbablyABot(false);
        return;
      }

      // If the response was not good, then get angry.
      throw responseData;
    } catch (error: unknown) {
      // Reset the checkbox captcha, if applicable, since tokens are only valid for one submission
      recaptchaV2Ref?.current?.reset();
      setCheckBoxCaptchaToken("");

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
          toast.warning(t("errors.confirm"));
          return;
        }

        // If the server said the recaptcha token indicates this was a bot (HTTP 401), prompt the user with the
        // interactive "checkbox" V2 captcha. However, if they have already submitted a checkbox captcha
        // and are still seeing a 401, something has gone wrong - fall back to the generic 4xx error handling logic below
        if (record.code == 401 && !checkboxToken) {
          toast.warning(t("errors.captchaFail"));
          setIsProbablyABot(true);
          setIsSubmitted(false);
          setIsLoading(false);

          console.error(
            "Request failed invisible captcha verification, user can try again with checkbox validation",
          );
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
        toast.error(t("errors.error") + " " + detail.toString());
        console.error(`An error occurred: ${detail}`);
        setIsLoading(false);

        return;
      }

      // If either JoinRecord failed to save, then we should log that.
      maybeLogJoinRecordFailure(
        record,
        preJoinRecordFailed,
        postJoinRecordFailed,
      );

      // If we didn't get a JoinFormResponse, we're in trouble. Make sure that
      // we successfully saved the join record. If we didn't... oof.
      if (preJoinRecordFailed && postJoinRecordFailed) {
        // If MeshDB is down AND we failed to save the Join Record, then let the
        // member know to try again later.
        toast.error(t("errors.errorTryAgain"));
        setIsLoading(false);
      } else {
        // If we didn't get a JoinFormResponse, chances are that MeshDB is hard down.
        // But at least we saved the JoinRecord. Tell the user we recorded their
        // submission, but change the message.
        setIsMeshDBProbablyDown(true);
        setIsLoading(false);
        setIsSubmitted(true);
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
    submitJoinFormToMeshDB(data, checkBoxCaptchaToken);
  };

  const betaDisclaimerBanner = (
    <p style={{ backgroundColor: "yellow" }}>
      This form is not production ready. Please fill out{" "}
      <a href="https://www.nycmesh.net/join">this form</a> instead.
    </p>
  );

  const welcomeBanner = <p>{t("banner")}</p>;

  return (
    <>
      <div className={isSubmitted ? styles.hidden : styles.formBody}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 id="joinform-title">{t("title")}</h2>
            <LocaleSwitcher />
          </div>
          {isBeta ? betaDisclaimerBanner : welcomeBanner}
          <div>
            <h3>{t("sections.personalInfo")}</h3>
            <div className={styles.inputGroup}>
              <input
                {...register("first_name", {
                  required: t("fields.firstName.error"),
                })}
                type="text"
                placeholder={t("fields.firstName.firstName")}
                className={
                  errors.first_name ? styles.errorField : styles.happyField
                }
              />
              {errors.first_name && (
                <p id="error_first_name" className={styles.errorText}>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register("last_name", {
                  required: t("fields.lastName.error"),
                })}
                type="text"
                placeholder={t("fields.lastName.lastName")}
                className={
                  errors.last_name ? styles.errorField : styles.happyField
                }
              />
              {errors.last_name && (
                <p id="error_last_name" className={styles.errorText}>
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register("email_address", {
                  required: t("fields.emailAddress.error"),
                  pattern: {
                    value: /.+@.+/i, // Very simple validation, basically just looking for "@". The backend does a bit more
                    message: t("fields.emailAddress.error"),
                  },
                })}
                type="email"
                placeholder={t("fields.emailAddress.emailAddress")}
                className={
                  errors.email_address ? styles.errorField : styles.happyField
                }
              />
              {errors.email_address && (
                <p id="error_email_address" className={styles.errorText}>
                  {errors.email_address.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register("phone_number", {
                  required: false,
                  validate:
                    validatePhoneNumber || t("fields.phoneNumber.error"),
                })}
                type="tel"
                placeholder={t("fields.phoneNumber.phoneNumber")}
                className={
                  errors.phone_number ? styles.errorField : styles.happyField
                }
              />
              {errors.phone_number && (
                <p id="error_phone_number" className={styles.errorText}>
                  {t("fields.phoneNumber.error")}
                </p>
              )}
            </div>
          </div>

          <div className={styles.block}>
            <h3>{t("sections.addressInfo")}</h3>

            <div className={styles.inputGroup}>
              <input
                {...register("street_address", {
                  required: t("fields.streetAddress.error"),
                })}
                type="text"
                placeholder={t("fields.streetAddress.streetAddress")}
                className={
                  errors.street_address ? styles.errorField : styles.happyField
                }
              />
              {errors.street_address && (
                <p id="error_street_address" className={styles.errorText}>
                  {errors.street_address.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register("apartment", {
                  required: t("fields.unit.error"),
                })}
                type="text"
                placeholder={t("fields.unit.unit")}
                className={
                  errors.apartment ? styles.errorField : styles.happyField
                }
              />
              {errors.apartment && (
                <p id="error_apartment" className={styles.errorText}>
                  {errors.apartment.message}
                </p>
              )}
            </div>
            <div className={styles.inputGroup}>
              <input
                {...register("city", { required: t("fields.city.error") })}
                type="text"
                placeholder={t("fields.city.city")}
                className={errors.city ? styles.errorField : styles.happyField}
              />
              {errors.city && (
                <p id="error_city" className={styles.errorText}>
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
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
              {errors.state && (
                <p id="error_state" className={styles.errorText}>
                  {errors.state.message}
                </p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                {...register("zip_code", {
                  required: t("fields.zipCode.error"),
                  minLength: {
                    message: t("fields.zipCode.error"),
                    value: 5,
                  },
                  maxLength: {
                    message: t("fields.zipCode.error"),
                    value: 5,
                  },
                })}
                type="number"
                placeholder={t("fields.zipCode.zipCode")}
                className={
                  errors.zip_code ? styles.errorField : styles.happyField
                }
              />
              {errors.zip_code && (
                <p id="error_zip_code" className={styles.errorText}>
                  {errors.zip_code.message}
                </p>
              )}
            </div>

            <div className={styles.extraSpaceBelow}>
              <label>
                <input {...register("roof_access")} type="checkbox" />
                {t("fields.roofAccess")}
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              {...register("referral")}
              type="text"
              placeholder={t("fields.reference")}
              className={
                errors.referral ? styles.errorField : styles.happyField
              }
            />
            {errors.referral && (
              <p id="error_first_name" className={styles.errorText}>
                {errors.referral.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>
              <input
                {...register("ncl", { required: t("fields.ncl.error") })}
                type="checkbox"
                className={errors.ncl ? styles.errorField : styles.happyField}
              />
              {t.rich("fields.ncl.ncl", {
                ncl: (chunks) => (
                  <a href="https://www.nycmesh.net/ncl.pdf">{chunks}</a>
                ),
              })}
            </label>
            {errors.ncl && (
              <p id="error_ncl" className={styles.errorText}>
                {errors.ncl.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            {/* This first captcha isn't actually displayed, it just silently collects user metrics and generates a token */}
            {recaptchaV3Key ? (
              <ReCAPTCHA
                ref={recaptchaV3Ref}
                sitekey={recaptchaV3Key}
                size="invisible"
                hl={locale}
                onErrored={() => {
                  console.error(
                    "Encountered an error while initializing or querying captcha. " +
                      "Disabling some frontend captcha features to avoid hangs. " +
                      "Are the recaptcha keys set correctly in the env variables?",
                  );
                  setReCaptchaError(true);
                }}
              />
            ) : (
              <></>
            )}
            {/* This second captcha is the traditional "I'm not a robot" checkbox,
          only shown if the user gets 401'ed due to a low score on the above captcha */}
            {isProbablyABot && recaptchaV2Key ? (
              <ReCAPTCHA
                className={styles.centered}
                style={{ marginTop: "15px" }}
                ref={recaptchaV2Ref}
                sitekey={recaptchaV2Key}
                hl={locale}
                onChange={(newToken) => setCheckBoxCaptchaToken(newToken ?? "")}
                onErrored={() => {
                  console.error(
                    "Encountered an error while initializing or querying captcha. " +
                      "Disabling all frontend captcha features to avoid hangs. " +
                      "Are the recaptcha keys set correctly in the env variables?",
                  );
                  setReCaptchaError(true);
                }}
              />
            ) : (
              <></>
            )}
          </div>
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
                isLoading ||
                isSubmitted ||
                (isProbablyABot && !checkBoxCaptchaToken && !reCaptchaError)
              }
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
              name="submit_join_form"
              id="button-submit-join-form"
            >
              {isLoading
                ? t("fields.submit.loading")
                : isSubmitted
                  ? t("fields.submit.thanks")
                  : t("fields.submit.submit")}
            </Button>
            <div hidden={!isLoading}>
              <CircularProgress />
            </div>
          </div>
          <div className={styles.captchaDisclaimer}>
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a href="https://policies.google.com/terms">
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </form>
      </div>
      <div data-testid="toasty" className="toasty">
        <ToastContainer hideProgressBar={true} theme={"colored"} />
      </div>
      <div hidden={!isSubmitted}>
        <Alert className={styles.thanks} id="alert-thank-you">
          <h2 id="alert-thank-you-h2">{t("thankYou.header")}</h2>
        </Alert>
        <div className={styles.thanksBlurb}>
          <p id="p-thank-you-01">
            {t("thankYou.thankYou", {
              slo: isMeshDBProbablyDown
                ? t("thankYou.days")
                : t("thankYou.minutes"),
            })}
          </p>
          <p id="p-thank-you-02">
            {t.rich("thankYou.support", {
              support: (chunks) => (
                <a href="mailto:support@nycmesh.net">{chunks}</a>
              ),
            })}
          </p>
        </div>
        <div className={styles.centered} style={{ padding: "10px" }}>
          <Button
            name="home"
            variant="contained"
            size="large"
            href="https://nycmesh.net/"
          >
            {t("fields.submit.goHome")}
          </Button>
        </div>
      </div>
      <InfoConfirmationDialog
        infoToConfirm={infoToConfirm}
        isDialogOpened={isInfoConfirmationDialogueOpen}
        handleClickConfirm={handleClickConfirm}
        handleClickReject={handleClickReject}
        handleClickCancel={handleClickCancel}
        isProbablyABot={isProbablyABot}
        recaptchaV2Key={recaptchaV2Key}
      />
      <div data-testid="test-join-record-key" data-state={joinRecordKey}></div>
    </>
  );
}
