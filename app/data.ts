"use server";
// import { access, constants, appendFileSync, readFile } from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";

// const JOIN_FORM_LOG = process.env.JOIN_FORM_LOG as string;

const S3_REGION = process.env.S3_REGION as string;
const S3_ENDPOINT = process.env.S3_ENDPOINT as string;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const S3_BASE_NAME = process.env.S3_BASE_NAME as string;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY as string;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY as string;

// Setup the S3 client
const s3Client = new S3Client({
  region: S3_REGION != undefined ? S3_REGION : "us-east-1",
  endpoint:
    S3_ENDPOINT != undefined
      ? S3_ENDPOINT
      : "https://s3.us-east-1.amazonaws.com",
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
});

// Records the submission we just got as a JSON object in an S3 bucket.
// submission: A Join Form Submission. We append a few things to this.
// key: The S3 path we store the submission at
// responseCode: If we have a response code for this submission, add it here.
export async function recordJoinFormSubmissionToS3(submission: JoinFormValues, key: string = "", responseCode: string = "") {
  // Bail if there's no S3 key
  if (S3_ACCESS_KEY === undefined || S3_SECRET_KEY === undefined) {
    console.error(
      "S3 credentials not configured. I WILL NOT SAVE THIS SUBMISSION.",
    );
    return;
  }

  // Get the date to store this submission under (this is part of the path)
  const submissionKey = new Date()
    .toISOString()
    .replace(/[-:T]/g, "/")
    .slice(0, 19);

  // Create the path, or use the one provided.
  key = key != "" ? key : `${S3_BASE_NAME}/${submissionKey}.json`;

  let body = responseCode != "" ? JSON.stringify(Object.assign(submission, {code: responseCode, replayed: false, replayCode: ""})) : JSON.stringify(submission);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: body,
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (err) {
    // Oof, guess we'll drop this on the floor.
    console.error(err);
    throw err;
  }

  // Return the key later so we can update it.
  return key;
}

/*
export async function recordJoinFormSubmissionToCSV(
  submission: JoinFormValues,
) {
  const keys = Object.keys(submission).join(",");
  // Surround each value in quotes to avoid confusion with strings like
  // "Brooklyn, NY"
  const values = Object.values(submission)
    .map((v) => `"${v}"`)
    .join(",");

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
*/
