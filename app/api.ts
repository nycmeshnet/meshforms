import { z } from "zod";

export const JoinFormInput = z.object({
  first_name: z.string(),
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
  console.log(input)
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
const API_BASE = new URL("http://127.0.0.1:8080") // TODO: Env var

// TODO: Env var for api token
export const submitJoinForm = (formInput: JoinFormInput) => post(`/join`, JoinFormResponse, undefined)
