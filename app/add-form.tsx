"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createTodo } from "@/app/actions";

import Select from 'react-select'


const initialState = {
  message: "",
};


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

interface Fields {
  first_name: string
  last_name: string
}

export function AddForm() {
  const [state, formAction] = useFormState(createTodo, initialState);

  return (
    <form action={
      (event) => {
        console.log(event)
      }
    }>
      <h2>Join NYC Mesh</h2>
      <input type="text" name="first_name" placeholder="First Name" required />
      <input type="text" name="last_name" placeholder="Last Name" required />

      <Select name="flavour" options={options} />

      <label>
        <input type="checkbox" name="roof_access"/>
        Do you have roof access?
      </label>
      
      <button type="submit">Submit</button>
    </form>
  );
}
