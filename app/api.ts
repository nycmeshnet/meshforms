import { z } from "zod";

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
})
export type JoinFormInput = z.infer<typeof JoinFormInput>

export const JoinFormResponse = z.object({
  building_id: z.string(),
  member_id: z.string(),
  install_number: z.string(),
  member_exists: z.boolean(),
})
export type JoinFormResponse = z.infer<typeof JoinFormResponse>

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

// const API_BASE = new URL(process.env.NEXT_PUBLIC_API_URL)
const API_BASE = new URL("http://127.0.0.1:8000") // TODO: Env var

// TODO: Env var for api token
export const submitJoinForm = (input: JoinFormInput) => post(`/api/v1/join/`, JoinFormResponse, JoinFormInput.parse(input))
