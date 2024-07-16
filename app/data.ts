'use server'
import { access, constants, appendFileSync, readFile } from 'node:fs';
import { JoinFormInput } from "@/app/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const JOIN_FORM_LOG = process.env.JOIN_FORM_LOG as string;

const S3_REGION = process.env.S3_REGION as string;
const S3_ENDPOINT = process.env.S3_ENDPOINT as string;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY as string;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY as string;

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

  uploadJoinFormLogToS3();
}

async function uploadJoinFormLogToS3() {
  console.log("New S3 Client");
  const s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    endpoint: S3_ENDPOINT,
  });

  readFile(JOIN_FORM_LOG, (err, data) => {
    if (err) throw err;
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: "join_form_log_date.csv",
      Body: data,
    });

    try {
      const response = s3Client.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  });
  
}
