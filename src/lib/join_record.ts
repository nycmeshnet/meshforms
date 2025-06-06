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

  constructor() {
    this.BUCKET_NAME = process.env.JOIN_RECORD_BUCKET_NAME as string;
    this.PREFIX = process.env.JOIN_RECORD_PREFIX as string;
    this.S3_ENDPOINT = process.env.S3_ENDPOINT as string;

    // Setup the S3 client and use a ternary to allow us to talk to MinIO if we want.
    this.s3Client = new S3Client({
      endpoint: this.S3_ENDPOINT != undefined ? this.S3_ENDPOINT : undefined,
    });
  }

  // Records the submission we just got as a JSON object in an S3 bucket.
  // submission: A Join Form Submission. We append a few things to this.
  // key: The S3 path we store the submission at
  // responseCode: If we have a response code for this submission, add it here.
  async save(
    joinRecord: JoinRecord,
    preSubmission: boolean = false,
  ): Promise<string> {
    // Get the date to store this submission under (this is part of the path)
    const submissionKey = joinRecord.submission_time
      .replace(/[-:T]/g, "/")
      .slice(0, 19);

    // Create the path and specify
    // - dev vs prod join record
    // - pre vs post-join form submission
    // - 2nd quartet of join record UUID (random but not too long)
    const key = `${this.PREFIX}/v3/${preSubmission ? "pre" : "post"}/${submissionKey}/${joinRecord.uuid.split("-")[1]}.json`;

    let body = JSON.stringify(joinRecord);

    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      Body: body,
    });

    try {
      const response = await this.s3Client.send(command);
      console.log(
        `Sent Join Record for ${joinRecord.email_address} to S3 bucket: ${this.BUCKET_NAME}`,
      );
      console.log(response);
    } catch (err) {
      console.error("Error sending Join Record to S3");
      // Oof, guess we'll drop this on the floor.
      console.error(err);
      throw err;
    }

    // Return the key later so we can update it.
    return key;
  }

  // Gets the contents of a JoinRecord for testing
  async get(key: string): Promise<JoinRecord> {
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
  preSubmission: boolean = false,
): Promise<string> {
  return joinRecordS3.save(submission, preSubmission);
}

export async function getJoinRecordFromS3(key: string): Promise<JoinRecord> {
  return joinRecordS3.get(key);
}

export async function maybeLogJoinRecordFailure(
  joinRecord: JoinRecord,
  preJoinRecordFailed: boolean,
  postJoinRecordFailed: boolean,
) {
  if (!preJoinRecordFailed && !postJoinRecordFailed) {
    return;
  }

  console.error(
    `JoinRecord failed to be submitted in S3 (pre failed: ${preJoinRecordFailed}) (post failed: ${postJoinRecordFailed}): ${joinRecord}`,
  );
}
