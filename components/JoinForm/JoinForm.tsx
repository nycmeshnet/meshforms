"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createTodo } from "@/app/actions";

import { JoinFormInput, submitJoinForm } from "@/app/api";

import { useRouter } from 'next/navigation'

import './JoinForm.css'

// import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select'

const initialState = {
  message: "",
};

const options = [
  { value: 'NY', label: 'New York' },
  { value: 'NJ', label: 'New Jersey' },
]

// FIXME: I have no idea how this works. I think this is some
// handleSubmit meme
 interface Fields {
   first_name: string
   last_name: string
   email: string
   phone: string
   street_address: string
   apartment: string
   city: string
   state: string
   roof_access: boolean
   referral: string
 }

export function JoinForm() {
  const [state, formAction] = useFormState(createTodo, initialState);

  const router = useRouter()

  return <>
    <form action={
      (event) => {
        console.log(event)

        const data: Record<string, string | Blob | boolean | Number > = {};

        event.forEach((value, key) => {
          if (key === 'roof_access') {
            // Special case for the checkbox
            data[key] = value === 'on' ? true : false;
          } else if (key === 'zip') {
            data[key] = Number(value);
          } else {
            data[key] = value;
          }
        });

        const j = JoinFormInput.parse(data);

        // try {
        //   submitJoinForm(j)
        // } catch (e) {
        //   console.log("Well shit: " + e)
        //   return { message: "Argh" };
        // }
        router.replace('/thanks')
      }
    }>
      <h2>Join NYC Mesh</h2>
      <div>
      <h3>Personal Info</h3>
        <div className="horizontal">
          <input type="text" name="first_name" placeholder="First Name" required />
          <input type="text" name="last_name" placeholder="Last Name" required />
        </div>

        <input type="email" name="email" placeholder="Email Address" required />
        <input type="tel" name="phone" placeholder="Phone Number" required />
      </div>

      <div className="block">
        <h3>Address Info</h3>
        <input type="text" name="street_address" placeholder="Street Address" required />
        <input type="text" name="apartment" placeholder="Unit #" required />
        <input type="text" name="city" placeholder="City" required />
        <Select name="state" placeholder="State" options={options} className="drop" />
        <input type="number" name="zip" placeholder="Zip Code" required />
        <label>
          <input type="checkbox" name="roof_access"/>
          Do you have roof access?
        </label>
      </div>
      <br/>
      <input type="text" name="referral" placeholder="How did you hear about us?" required />
      <button type="submit">Submit</button>
    </form>
  </>
}
