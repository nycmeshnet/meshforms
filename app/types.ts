import { JoinFormValues } from "@/components/JoinForm/JoinForm";

type JoinRecord = JoinFormValues & {
  submission_time: string,
  code: string;
  replayed: number;
  install_number: number | null;
};

export type { JoinRecord };
