type JoinFormValues = {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  street_address: string;
  apartment: string;
  city: string;
  state: string;
  zip_code: string;
  roof_access: boolean;
  referral: string;
  ncl: boolean;
  trust_me_bro: boolean;
};

// Coding like it's 1997
export function NewJoinFormValues() {
  return {
    first_name: "",
    last_name: "",
    email_address: "",
    phone_number: "",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    zip_code: "",
    roof_access: false,
    referral: "",
    ncl: false,
    trust_me_bro: false,
  };
}

export type { JoinFormValues };

type JoinLogLine = {
  key: string;
  submission: JoinFormValues;
};

export async function NewJoinLogLine() {
  return {key: "", submission: NewJoinFormValues()}
}

export type { JoinLogLine };
