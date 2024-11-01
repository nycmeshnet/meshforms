import { JoinFormValues } from "@/components/JoinForm/JoinForm";

type JoinRecord = JoinFormValues & {
  code: string;
  replayed: number;
  install_number: number | null;
};

export type { JoinRecord };
