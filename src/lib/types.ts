import { JoinFormValues } from "@/components/JoinForm/JoinForm";

type JoinRecord = JoinFormValues & {
  version: number;
  uuid: string;
  submission_time: string;
  code: number | null;
  replayed: number;
  install_number: number | null;
};

export type { JoinRecord };
