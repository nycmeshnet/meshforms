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
) =>
  get(
    `/api/v1/query/${route}/?${input_type}=${input}`,
    QueryFormResponse,
  );
