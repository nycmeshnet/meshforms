import { test, expect } from "@playwright/test";
import {
  fillOutJoinForm,
  sampleData,
  sampleJoinRecord,
  submitFailureExpected,
  submitSuccessExpected,
} from "./util";
import { JoinRecord } from "@/app/types";
import { getJoinRecordFromS3 } from "@/app/join_record";
import { isDeepStrictEqual } from "util";

const joinFormTimeout = 20000;
const unitTestTimeout = 5000;

const meshdbIsDownText =
  "You will receive an email from us in the next 2-3 days with next steps, including how to submit panorama photos.";

// TODO: Figure out how to mock an S3 failure. Gotta either do it on the backend
// or somehow mock saveJoinRecordToS3 to always throw an error.
// test("meshdb is hard down and we could not record", async ({ page}) => {
//   // Block access to the join form API
//   await page.route("**/api/v1/join/**", (route) => route.abort());
// 
//   test.setTimeout(joinFormTimeout);
//   await page.goto("/join");
// 
//   // Is the page title correct?
//   await expect(page).toHaveTitle(/Join Our Community Network!/);
// 
//   // Set up sample data.
//   await fillOutJoinForm(page, sampleData);
// 
//   // Uncomment this if you want to poke around after the join form has been filled out
//   //await page.pause();
// 
//   await submitFailureExpected(page);
// });

test("meshdb is hard down but succeed anyway", async ({ page }) => {
  // Block access to the join form API
  await page.route("**/api/v1/join/**", (route) => route.abort());

  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  await fillOutJoinForm(page, sampleData);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitSuccessExpected(page, unitTestTimeout);

  await expect(page.locator("[id='p-thank-you-01']")).toHaveText(
    meshdbIsDownText,
  );

  const joinRecordKey = await page.getAttribute(
    '[data-testid="test-join-record-key"]',
    "data-state",
  );

  if (joinRecordKey === null) {
    throw new Error("Got null join record");
  }

  // This is wacky because playwright has to run this and therefore
  // needs our dotenv.
  const joinRecord: JoinRecord = await getJoinRecordFromS3(joinRecordKey);

  joinRecord.submission_time = sampleJoinRecord.submission_time;

  // In this case, we know that we won't have a code or install number, so drop
  // those from the comparison
  let hardDownSampleJoinRecord = structuredClone(sampleJoinRecord);
  hardDownSampleJoinRecord.code = null;
  hardDownSampleJoinRecord.install_number = null;

  if (!isDeepStrictEqual(joinRecord, hardDownSampleJoinRecord)) {
    console.error("Expected:");
    console.error(hardDownSampleJoinRecord);
    console.error("Got:");
    console.error(joinRecord);
    throw new Error("Bad JoinRecord. JoinRecord is not deeply equal.");
  }

  // Then go home
  await page.waitForTimeout(1000);
  await page.locator("[name='home']").click();
  await page.waitForTimeout(1000);
  const currentURL = new URL(page.url());
  expect(currentURL.pathname).toBe("/");
});
