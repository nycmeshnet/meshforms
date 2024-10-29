import { JoinFormValues } from "@/components/JoinForm/JoinForm";

type JoinRecord = JoinFormValues & {code: string, replayed: number, replayCode: string}

export type { JoinRecord }
