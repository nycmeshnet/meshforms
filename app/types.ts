import { JoinFormValues } from "@/components/JoinForm/JoinForm";

type JoinRecord = JoinFormValues & {code: string, replayed: number, replay_code: string}

export type { JoinRecord }

