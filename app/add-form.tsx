"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createTodo } from "@/app/actions";

const initialState = {
  message: "",
};

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
      
      <button type="submit">Submit</button>
    </form>
  );
}
