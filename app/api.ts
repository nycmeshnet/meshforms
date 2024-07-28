import { JoinFormInput, JoinFormResponse, NNAssignFormInput, NNAssignFormResponse, QueryFormInput, QueryFormResponse } from "@/app/io";
import { z } from "zod";

if (process.env.NEXT_PUBLIC_MESHDB_URL === undefined) {
  throw new Error('Expected API url environment variable');
}

//if (process.env.MESHDB_TOKEN === undefined) {
//  throw new Error('Expected API token environment variable');
//}

const API_BASE = new URL(process.env.NEXT_PUBLIC_MESHDB_URL as string + "/api/v1/");

const get = async <S extends z.Schema>(url: string, schema: S, auth?: string, nextOptions?: NextFetchRequestConfig): Promise<ReturnType<S['parse']>> => {
  const res = await fetch(new URL(url, API_BASE), {
    headers: {
      ...auth && { Authorization: `Bearer ${auth}` },
    },
    next: nextOptions,
  })
    .catch(console.warn)
  if (!res?.ok) throw res
  return schema.parse(await res.json())
}

const post = async <S extends z.Schema>(url: string, schema: S, input: unknown, auth?: string, method = 'POST'): Promise<ReturnType<S['parse']>> => {
  console.log("Will POST: " + input)
  const res = await fetch(new URL(url, API_BASE), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...auth && { Authorization: `Bearer ${auth}` },
    },
    body: JSON.stringify(input),
  })
    .catch(console.warn)
  if (!res?.ok) throw res
  return schema.parse(await res.json())
}

// TODO: Env var for api token
export const submitJoinForm = (input: JoinFormInput) => post(`/api/v1/join/`, JoinFormResponse, JoinFormInput.parse(input))
export const submitNNAssignForm = (input: NNAssignFormInput) => post(`/api/v1/nn-assign/`, NNAssignFormResponse, NNAssignFormInput.parse(input))

export const submitQueryForm = (route: string, input_type: string, input: string, password: string) => get(`/api/v1/query/${route}/?${input_type}=${input}`, QueryFormResponse, password)
