"use server";
import { access, constants, appendFileSync, readFile } from "node:fs";
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { JoinFormValues, NewJoinFormValues } from "@/components/JoinForm/JoinForm";
import { Readable } from "node:stream";

type JoinLogLine = {
  key: string;
  submission: JoinFormValues;
};

export async function NewJoinLogLine() {
  return {key: "", submission: NewJoinFormValues()}
}

const JOIN_FORM_LOG = process.env.JOIN_FORM_LOG as string;

const S3_REGION = process.env.S3_REGION as string;
const S3_ENDPOINT = process.env.S3_ENDPOINT as string;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const S3_BASE_NAME = process.env.S3_BASE_NAME as string;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY as string;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY as string;

if (S3_ACCESS_KEY === undefined || S3_SECRET_KEY === undefined) {
  console.error(
    "S3 credentials not configured. I WILL NOT SAVE THIS SUBMISSION.",
  );
}

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

// Records the submission we just got as a JSON object in an S3 bucket.
export async function recordJoinFormSubmissionToS3(submission: JoinFormValues) {
  if (S3_ACCESS_KEY === undefined || S3_SECRET_KEY === undefined) {
    console.error(
      "S3 credentials not configured. I WILL NOT SAVE THIS SUBMISSION.",
    );
    return;
  }

  const submissionKey = new Date()
    .toISOString()
    .replace(/[-:T]/g, "/")
    .slice(0, 19);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: `${S3_BASE_NAME}/${submissionKey}.json`,
    Body: JSON.stringify(submission),
  });

  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
    // Record the submission to a local CSV file as a last-ditch effort
    recordJoinFormSubmissionToCSV(submission);
    throw err;
  }
}


async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
}


async function listAllObjects(bucketName: string) {
  let continuationToken: string | undefined = undefined;
  const allObjects: Array<JoinLogLine> = [];

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });
      
      const listResponse = await s3Client.send(listCommand);

      for (const obj of listResponse.Contents || []) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: obj.Key,
        });
        const getObjectResponse = await s3Client.send(getObjectCommand);

        if (getObjectResponse.Body) {
          const content = await streamToString(getObjectResponse.Body as Readable);
          allObjects.push({
            key: obj.Key,
            submission: JSON.parse(content)
          });
        }
      }

      // Update the continuation token to get the next page of results
      continuationToken = listResponse.NextContinuationToken;

    } while (continuationToken);

    return allObjects; // Contains all objects in the bucket
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    throw error;
  }
}


export type { JoinLogLine };

export async function fetchSubmissions(): Array<JoinLogLine> {
  return listAllObjects(S3_BUCKET_NAME);
}
