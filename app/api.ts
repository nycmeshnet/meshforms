"use client";
import {
  NNAssignFormInput,
  NNAssignFormResponse,
  QueryFormResponse,
} from "@/app/io";
import { z } from "zod";
import { getMeshDBAPIEndpoint } from "./endpoint";

const get = async <S extends z.Schema>(
  url: string,
  schema: S,
  auth?: string,
  nextOptions?: NextFetchRequestConfig,
): Promise<ReturnType<S["parse"]>> => {
  const api_base = new URL(`${await getMeshDBAPIEndpoint()}/api/v1/`);
  const res = await fetch(new URL(url, api_base), {
    headers: {
      ...(auth && { Authorization: `Bearer ${auth}` }),
    },
    next: nextOptions,
  }).catch(console.warn);
  if (!res?.ok) throw res;
  return schema.parse(await res.json());
};

const post = async <S extends z.Schema>(
  url: string,
  schema: S,
  input: unknown,
  auth?: string,
  method = "POST",
): Promise<ReturnType<S["parse"]>> => {
  console.log("Will POST: " + input);
  const api_base = new URL(`${await getMeshDBAPIEndpoint()}/api/v1/`);
  const res = await fetch(new URL(url, api_base), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `Bearer ${auth}` }),
    },
    body: JSON.stringify(input),
  }).catch(console.warn);
  if (!res?.ok) throw res;
  return schema.parse(await res.json());
};

export const submitNNAssignForm = (input: NNAssignFormInput) =>
  post(
    `/api/v1/nn-assign/`,
    NNAssignFormResponse,
    NNAssignFormInput.parse(input),
  );

export const submitQueryForm = (
  route: string,
  input_type: string,
  input: string,
  password: string,
) =>
  get(
    `/api/v1/query/${route}/?${input_type}=${input}`,
    QueryFormResponse,
    password,
  );
