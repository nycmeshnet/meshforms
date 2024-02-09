import { z } from "zod";

if (process.env.NEXT_PUBLIC_MESHDB_URL === undefined) {
  throw new Error('Expected API url environment variable');
}

const API_BASE = new URL(process.env.NEXT_PUBLIC_MESHDB_URL as string);

export const JoinFormInput = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  street_address: z.string(),
  apartment: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.number(),
  roof_access: z.boolean(),
  referral: z.string(),
  ncl: z.boolean(),
})
export type JoinFormInput = z.infer<typeof JoinFormInput>

export const JoinFormResponse = z.object({
  message: z.string().optional(),
  building_id: z.number(),
  member_id: z.number(),
  install_number: z.number(),
  member_exists: z.boolean(),
})
export type JoinFormResponse = z.infer<typeof JoinFormResponse>

export const NNAssignFormInput = z.object({
  install_number: z.number(),
  password: z.string(), // TODO: Salt/hash/whatever this
})
export type NNAssignFormInput = z.infer<typeof NNAssignFormInput>

export const NNAssignFormResponse = z.object({
  message: z.string().optional(),
  building_id: z.number(),
  install_number: z.number(),
  network_number: z.number(),
  created: z.boolean(),
})
export type NNAssignFormResponse = z.infer<typeof NNAssignFormResponse>

export const QueryFormInput = z.object({
  //route: z.string(),
  query_type: z.string(),
  data: z.string(),
  password: z.string(), // TODO: Salt/hash/whatever this
})
export type QueryFormInput = z.infer<typeof QueryFormInput>

export const QueryFormResponse = z.array(z.object({
    install_number: z.number(),
    street_address: z.string().nullable(),
    unit: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    name: z.string(),
    email_address: z.string().nullable(),
    stripe_email_address: z.string().nullable(),
    secondary_emails: z.array(z.string()).nullable(),
    notes: z.string(),
    network_number: z.number().nullable(),
    install_status: z.string(),
}))
export type QueryFormResponse = z.infer<typeof QueryFormResponse>

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

export const submitQueryForm = (route: string, input_type: string, input: string, password: string) => get(`/api/v1/query/${route}/?${input_type}=${input}&password=${password}`, QueryFormResponse)
