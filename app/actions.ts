"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { submitJoinForm } from "@/app/api";

export async function createTodo(
  prevState: {
    message: string;
  },
  formData: FormData,
) {

  let fname = formData.get('first_name')

  console.log("HEY HERE IT IS: " + fname)

  const skz = {
    first_name: fname,
  }

  try {
    submitJoinForm(skz)
  } catch (e) {
    console.log("What the hell my catch isn't working")
    return { message: "Argh" };
  }

  try {
    revalidatePath("/");
    return { message: `Added todo ${fname}` };
  } catch (e) {
    return { message: "Failed to create todo" };
  }
}

