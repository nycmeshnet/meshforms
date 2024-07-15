'use server'
import { access, constants, appendFileSync } from 'node:fs';
import { JoinFormInput } from "@/app/api";
const JOIN_FORM_LOG = process.env.JOIN_FORM_SUBMISSION_LOG_PATH as string;

export async function recordJoinFormSubmissionToCSV(submission: JoinFormInput) {
  const keys = Object.keys(submission).join(',');
  // Surround each value in quotes to avoid confusion with strings like
  // "Brooklyn, NY"
  const values = Object.values(submission).map(v => `"${v}"`).join(',');

  access(JOIN_FORM_LOG, constants.F_OK, async (err) => {
    if (err) {
      console.log(err);
      // Initialize with headers if it doesn't exist
      appendFileSync(JOIN_FORM_LOG, `${keys}\n`);
    }
    // Write the submission
    appendFileSync(JOIN_FORM_LOG, `${values}\n`);
  });

}
