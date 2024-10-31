"use server";
// import { access, constants, appendFileSync, readFile } from "node:fs";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { Readable } from "stream";
import { JoinRecord } from "./types";

// const JOIN_FORM_LOG = process.env.JOIN_FORM_LOG as string;

class JoinRecordS3 {
  private s3Client: S3Client;

  private S3_REGION: string; 
  private S3_ENDPOINT: string; 
  private S3_BUCKET_NAME: string; 
  private S3_BASE_NAME: string; 
  private S3_ACCESS_KEY: string; 
  private S3_SECRET_KEY: string; 

  constructor() {
    this.S3_REGION      = process.env.S3_REGION as string;
    this.S3_ENDPOINT    = process.env.S3_ENDPOINT as string;
    this.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
    this.S3_BASE_NAME   = process.env.S3_BASE_NAME as string;
    this.S3_ACCESS_KEY  = process.env.S3_ACCESS_KEY as string;
    this.S3_SECRET_KEY  = process.env.S3_SECRET_KEY as string;

    // Setup the S3 client
    this.s3Client = new S3Client({
      region: this.S3_REGION != undefined ? this.S3_REGION : "us-east-1",
      endpoint:
        this.S3_ENDPOINT != undefined
          ? this.S3_ENDPOINT
          : "https://s3.us-east-1.amazonaws.com",
      credentials: {
        accessKeyId: this.S3_ACCESS_KEY,
        secretAccessKey: this.S3_SECRET_KEY,
      },
    });
  }

  // Records the submission we just got as a JSON object in an S3 bucket.
  // submission: A Join Form Submission. We append a few things to this.
  // key: The S3 path we store the submission at
  // responseCode: If we have a response code for this submission, add it here.
  async save(
    submission: JoinRecord,
    key: string = "",
  ) {

    console.log(`bucket: ${this.S3_BUCKET_NAME}`);
    // Bail if there's no S3 key
    if (this.S3_ACCESS_KEY === undefined || this.S3_SECRET_KEY === undefined) {
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
    key = key != "" ? key : `${this.S3_BASE_NAME}/${submissionKey}.json`;

    let body = JSON.stringify(
      submission,
      /*
      Object.assign(submission, {
        code: responseCode, // Code the server returned to us
        replayed: 0, // Number of times we've replayed it from the backend (obvs we haven't)
        install_number: NaN, // Install number if we do manage to successfully submit it
      }),
      */
    );

    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
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
    console.log(`bucket: ${this.S3_BUCKET_NAME}`);
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
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
