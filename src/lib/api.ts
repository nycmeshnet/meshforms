"use client";
import {
  NNAssignFormInput,
  NNAssignFormResponse,
  QueryFormResponse,
} from "@/lib/io";
import { z } from "zod";
import { getMeshDBAPIEndpoint } from "./endpoint";
import { parse } from "path";

const get = async <S extends z.Schema>(
  url: string,
  schema: S,
  auth?: string,
  nextOptions?: NextFetchRequestConfig,
): Promise<ReturnType<S["parse"]>> => {
  const api_base = new URL(`${await getMeshDBAPIEndpoint()}/api/v1/`);
  const res = await fetch(new URL(url, api_base), {
    credentials: "include",
    next: nextOptions,
  }).catch(console.warn);
  if (!res?.ok) throw res;
  return schema.parse(await res.json());
};

export const submitQueryForm = async (
  route: string,
  input_type: string,
  input: string,
) => get(`/api/v1/query/${route}/?${input_type}=${input}`, QueryFormResponse);


// FIXME (wdn): This is terrible. It won't work for members who have meshdb accounts
// but don't have permission to use this-or-that form.
export const checkIfLoggedIn = async () => {
  // Check if we're logged in
  const api_base = new URL(`${await getMeshDBAPIEndpoint()}/api/v1/`);
  const checkAuthedRoute = await fetch(new URL("/api/v1/nodes/3", api_base), {
    credentials: "include",
  });
  if (checkAuthedRoute.ok) {
    return true;
  }

  if (checkAuthedRoute.status === 403) {
    return false;
  }
};
