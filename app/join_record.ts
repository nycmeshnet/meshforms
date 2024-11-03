"use server";
// import { access, constants, appendFileSync, readFile } from "node:fs";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { Readable } from "stream";
import { JoinRecord } from "./types";

// const JOIN_FORM_LOG = process.env.JOIN_FORM_LOG as string;

class JoinRecordS3 {
  private s3Client: S3Client;

  private BUCKET_NAME: string;
  private PREFIX: string;

  private S3_ENDPOINT: string;
  private AWS_ACCESS_KEY_ID: string;
  private AWS_SECRET_ACCESS_KEY: string;

  constructor() {
    this.BUCKET_NAME = process.env.JOIN_RECORD_BUCKET_NAME as string;
    this.PREFIX = process.env.JOIN_RECORD_PREFIX as string;
    this.S3_ENDPOINT = process.env.S3_ENDPOINT as string;
    this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
    this.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

    // Setup the S3 client
    this.s3Client = new S3Client({
      endpoint:
        this.S3_ENDPOINT != undefined
          ? this.S3_ENDPOINT
          : "https://s3.us-east-1.amazonaws.com",
    });
  }

  // Records the submission we just got as a JSON object in an S3 bucket.
  // submission: A Join Form Submission. We append a few things to this.
  // key: The S3 path we store the submission at
  // responseCode: If we have a response code for this submission, add it here.
  async save(joinRecord: JoinRecord, key: string = "") {
    // Check if the S3 client is working and exit gracefully with a warning if it is not.
    try {
        const command = new ListBucketsCommand({});
        await this.s3Client.send(command);
    } catch (error) {
        console.warn('S3 Client not configured properly. I WILL NOT SAVE THIS SUBMISSION.', error);
        return;
    }


    // Get the date to store this submission under (this is part of the path)
    const submissionKey = joinRecord.submission_time
      .replace(/[-:T]/g, "/")
      .slice(0, 19);

    // Create the path, or use the one provided.
    key = key != "" ? key : `${this.PREFIX}/${submissionKey}.json`;

    let body = JSON.stringify(joinRecord);

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      Body: body,
    });

    try {
      const response = await this.s3Client.send(command);
      console.log(response);
    } catch (err) {
      // Oof, guess we'll drop this on the floor.
      console.error(err);
      throw err;
    }

    // Return the key later so we can update it.
    return key;
  }

  // Gets the contents of a JoinRecord for testing
  async get(key: string) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
    });
    const getObjectResponse = await this.s3Client.send(getObjectCommand);

    if (getObjectResponse.Body) {
      const content = await this.streamToString(
        getObjectResponse.Body as Readable,
      );
      return JSON.parse(content);
    }
    throw new Error("Could not get Record from S3");
  }

  // Decode S3 response
  async streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });
  }
}

const joinRecordS3 = new JoinRecordS3();

export async function saveJoinRecordToS3(
  submission: JoinRecord,
  key: string = "",
) {
  return joinRecordS3.save(submission, key);
}

export async function getJoinRecordFromS3(key: string) {
  return joinRecordS3.get(key);
}
