"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { NNAssignFormInput, submitNNAssignForm } from "@/app/api";
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { toastErrorMessage } from "@/app/utils/toastErrorMessage";

import styles from './NNAssignForm.module.scss'

import { useState } from "react";

export function NNAssignForm() {
  function parseForm(event: FormData) {
    const data: Record<string, string | Blob | boolean | Number > = {};
    event.forEach((value, key) => {
      if (key === 'install_number') {
        data[key] = Number(value);
      } else {
        data[key] = value;
      }
    });

    return NNAssignFormInput.parse(data);
  }

  async function sendForm(event: FormData) {
    console.log(event); 

    try {
      setDisableSubmitButton(true);
      let a: NNAssignFormInput = parseForm(event);
      console.log(a);
      let resp = await submitNNAssignForm(a);
      if (resp.created) {
        toast.success('Success! Network Number is: ' + resp.network_number, {
          hideProgressBar: true,
          autoClose: false,
        });
      } else {
        toast.success('Found existing Network Number: ' + resp.network_number, {
          hideProgressBar: true,
          autoClose: false,
        });
      }
      setNetworkNumber(resp.network_number)
    } catch (e) {
      console.log("Could not submit NNAssign Form: ");
      console.log(e);
      toastErrorMessage(e);
      setDisableSubmitButton(false);
      return;
    }
  }

  const initialState = {};
  const [value, setValue] = useState()
  const router = useRouter()
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [networkNumber, setNetworkNumber] = useState(-1);

  return <>
    <div className={styles.formBody}>
      <form action={sendForm}>
        <h2>Request Network Number</h2>
        <p>Enter an install number and the Pre-Shared Key, and receive a Network Number</p>
        <br/>
          <div className={styles.horizontal}>
            <input type="number" name="install_number" placeholder="Install Number" required />
            <input type="password" name="password" placeholder="Pre-Shared Key" required />
          </div>
        <button className={styles.submitButton} type="submit" disabled={disableSubmitButton} hidden={disableSubmitButton}>Submit</button>
        <h3 hidden={!disableSubmitButton} className={styles.nnLabel}>Your Network Number:</h3>
        <h1 hidden={!disableSubmitButton} id="">{networkNumber}</h1>
      </form>
    </div>
    <ToastContainer />
    
  </>
}
