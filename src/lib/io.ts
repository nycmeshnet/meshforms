import { z } from "zod";

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
      unit: z.string().nullable(),
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
