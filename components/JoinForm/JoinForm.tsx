"use client";

import { submitJoinForm } from "@/app/api";
import { JoinFormInput } from "@/app/io";
import { recordJoinFormSubmissionToS3 } from "@/app/data";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { E164Number } from 'libphonenumber-js/core';
import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPhoneNumberIntl, parsePhoneNumber } from 'react-phone-number-input'

import styles from './JoinForm.module.scss'

import Select from 'react-select'
import { FormEvent, useState } from "react";

import Button from "@mui/material/Button";

const options = [
  { value: 'NY', label: 'New York' },
  { value: 'NJ', label: 'New Jersey' },
]

const JoinForm = () => {
  function parseForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const data: Record<string, string | Blob | boolean | Number > = {};
    formData.forEach((value, key) => {
      if (key === 'roof_access' || key === 'ncl') {
        // Special case for the checkbox
        // This won't work for unchecked boxes because JS good language
        data[key] = value === 'on' ? true : false;
      } else if (key === 'zip') {
        data[key] = Number(value);
      } else if (key === 'phone') {
        const parsedPhone = parsePhoneNumber(value as string, "US");
        if(parsedPhone?.number) {
          data[key] = formatPhoneNumberIntl(parsedPhone?.number)
        } else {
          data[key] = value;
        }
      } else {
        data[key] = value;
      }
    });

    // Special cases for the checkboxes
    // Bail if no NCL
    if (data['ncl'] !== true) {
      data['ncl'] = false

      toast.error('You must accept the Network Commons License!', {
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    // Set roof_access to false if necessary
    if (data['roof_access'] !== true) {
      data['roof_access'] = false;
    }

    return JoinFormInput.parse(data);
  }

  // TODO: Redirect them to a thank you/next steps page or something after they have submitted.
  async function sendForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(event); 

    try {
      setIsLoading(true);
      let parsedForm = parseForm(event);
      if (parsedForm === undefined) return;
      // If we were able to glean the form, then save it.
      //recordJoinFormSubmissionToS3(parsedForm);
      let j: JoinFormInput = parsedForm;
      console.log(j);
      await submitJoinForm(j);
      toast.success('Thanks! You will receive an email shortly :)', {
        hideProgressBar: true,
        theme: "colored",
      });
    } catch (e) {
      console.log("Could not submit Join Form:");
      toastErrorMessage(e);
      setIsLoading(false);
      return;
    }
    setSubmitted(true);
    setIsLoading(false);
  }

  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>()
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /*<p>Join our community network! Fill out the form, and we will reach out over email shortly.</p>*/
  return <>
    <div className={styles.formBody}>
      <form onSubmit={sendForm}>
        <h2>Join NYC Mesh</h2>
        <p style={{ backgroundColor: "yellow" }} >This form is not production ready. Please fill out <a href="https://www.nycmesh.net/join">this form</a> instead.</p>
        <div>
        <h3>Personal Info</h3>
          <input type="text" name="first_name" placeholder="First Name" required />
          <input type="text" name="last_name" placeholder="Last Name" required />

          <input type="email" name="email" placeholder="Email Address" required />

          <PhoneInput
            name="phone"
            placeholder="Phone Number"
            defaultCountry="US"
            value={phoneNumber}
            onChange={setPhoneNumber}/>
        </div>

        <div className={styles.block}>
          <h3>Address Info</h3>
          <input type="text" name="street_address" placeholder="Street Address" required />
          <input type="text" name="apartment" placeholder="Unit #" />
          <input type="text" name="city" placeholder="City" required />
          <Select name="state" placeholder="State" options={options} defaultValue={options[0]} className={styles.drop} required />
          <input type="number" name="zip" placeholder="Zip Code" required />
          <label>
            <input type="checkbox" name="roof_access"/>
            Check this box if you have roof access
          </label>
        </div>
        <br/>
        <input type="text" name="referral" placeholder="How did you hear about us?" />
        <label>
            <input type="checkbox" name="ncl" required/>
            I agree to the <a href="https://www.nycmesh.net/ncl.pdf" target="_blank" style={{color:"black"}}>Network Commons License</a>
          </label>
        <div className={styles.centered}>
          <Button
            type="submit"
            disabled={isLoading || submitted}
            variant="contained"
            size="large"
            sx={{ width: "12rem", fontSize: "1rem", m:"1rem"}}
            name="submit_join_form"
          >
            { isLoading ? "Loading..." : (submitted ? "Thanks!" : "Submit") }
          </Button>
        </div>
      </form>
    </div>
    <div className="toasty">
    <ToastContainer />
    </div>
  </>
}

export default JoinForm
