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
  ncl: z.boolean(),
});
export type JoinFormInput = z.infer<typeof JoinFormInput>;

export const JoinFormResponse = z.object({
  message: z.string().optional(),
  building_id: z.number(),
  member_id: z.number(),
  install_number: z.number(),
  member_exists: z.boolean(),
});
export type JoinFormResponse = z.infer<typeof JoinFormResponse>;

export const NNAssignFormInput = z.object({
  install_number: z.number(),
  password: z.string(), // TODO: Salt/hash/whatever this
});
export type NNAssignFormInput = z.infer<typeof NNAssignFormInput>;

export const NNAssignFormResponse = z.object({
  message: z.string().optional(),
  building_id: z.number(),
  install_number: z.number(),
  network_number: z.number(),
  created: z.boolean(),
});
export type NNAssignFormResponse = z.infer<typeof NNAssignFormResponse>;

export const QueryFormInput = z.object({
  //route: z.string(),
  legacy: z.string().optional(),
  query_type: z.string(),
  data: z.string(),
  password: z.string(), // TODO: Salt/hash/whatever this
});
export type QueryFormInput = z.infer<typeof QueryFormInput>;

export const QueryFormResponse = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      install_number: z.number(),
      street_address: z.string().nullable(),
      unit: z.string(),
      city: z.string(),
      state: z.string(),
      zip_code: z.string(),
      name: z.string(),
      phone_number: z.string().nullable(),
      primary_email_address: z.string().nullable(),
      stripe_email_address: z.string().nullable(),
      additional_email_addresses: z.array(z.string()).nullable(),
      notes: z.string(),
      network_number: z.number().nullable(),
      status: z.string(),
    }),
  ),
});
export type QueryFormResponse = z.infer<typeof QueryFormResponse>;
