import { getJoinRecordFromS3 } from "@/lib/join_record";
import { JoinRecord } from "@/lib/types";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { test, expect } from "./mock/test";

import {
  sampleData,
  fillOutJoinForm,
  submitSuccessExpected,
  submitFailureExpected,
  submitConfirmationDialogExpected,
  sampleNJData,
  submitAndCheckToast,
  expectSuccess,
  sampleJoinRecord,
  findJoinRecord,
} from "./util";
import { isDeepStrictEqual } from "util";

const joinFormTimeout = 20000;
const unitTestTimeout = 5000;

// Unit tests for the Join Form.
//
// These tests will mock a connection to MeshDB. It is simply making sure that
// the form creates a good-looking payload and can hit a mock API.

test("change language from english to spanish", async ({ page }) => {
  test.setTimeout(10000);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  await page
    .locator("[id='joinform-locale-switcher-select']")
    .selectOption("🇪🇸 Español");

  // TODO (wdn): It would be nice if we could grab the translation out of the
  // json blob instead of hardcoding it here.
  await expect(page.locator("[id='joinform-title']")).toHaveText(
    "Únase NYC Mesh",
  );
});

test("happy join form", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  await fillOutJoinForm(page, sampleData);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitSuccessExpected(page, unitTestTimeout);

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

  // This is fucked, sorry.
  joinRecord.submission_time = sampleJoinRecord.submission_time;

  if (!isDeepStrictEqual(joinRecord, sampleJoinRecord)) {
    console.error("Expected:");
    console.error(sampleJoinRecord);
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

test("confirm city", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);
  let data: JoinFormValues = Object.assign({}, sampleData);
  data.city = "brooklyn";

  // Set up sample data.
  await fillOutJoinForm(page, data);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitConfirmationDialogExpected(page, 2000);

  // Check that the Join Record's code is correct.
  let joinRecord = await findJoinRecord(page);
  let code = 409;
  if (joinRecord.code !== code) {
    throw new Error(
      `JoinRecord code (${joinRecord.code}) did not match expected code (${code})`,
    );
  }

  await page.locator("[name='confirm']").click();

  // Make sure the JoinRecord updated properly
  await page.waitForTimeout(1000);
  joinRecord = await findJoinRecord(page);
  if (joinRecord.code !== 201) {
    throw new Error(
      `JoinRecord code (${joinRecord.code}) did not match expected code (201)`,
    );
  }

  await expectSuccess(page, 1000);
});

test("confirm street address", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);
  let data = structuredClone(sampleData);
  data.street_address = "197 prospect pl";

  // Set up sample data.
  await fillOutJoinForm(page, data);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitConfirmationDialogExpected(page, 2000);

  await page.locator("[name='confirm']").click();

  await expectSuccess(page, unitTestTimeout);
});

test("street address trust me bro", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);
  let data = structuredClone(sampleData);
  data.street_address = "333 chom st";

  // Set up sample data.
  await fillOutJoinForm(page, data);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitConfirmationDialogExpected(page, 2000);

  await page.locator("[name='reject']").click();

  await expectSuccess(page, unitTestTimeout);
});

// TODO: Add a garbage testcase
// TODO: Add confirm block (is this trust me bro?)

// Tests missing both first and last name
test("fail missing first name", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingNameData: JoinFormValues = Object.assign({}, sampleData);
  missingNameData.first_name = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingNameData);

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

test("fail missing last name", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Do it again with last name
  let missingNameData: JoinFormValues = Object.assign({}, sampleData);
  missingNameData.last_name = "";
  await fillOutJoinForm(page, missingNameData);
  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

// Tests missing email
test("fail missing email", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.email_address = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

// Tests missing phone
test("fail missing phone", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.phone_number = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);

  await expect(
    page.getByText("Please enter a valid phone number"),
  ).toBeVisible();

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

// Tests missing email + phone
test("fail missing email and phone", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.phone_number = "";
  missingData.email_address = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);

  await expect(
    page.getByText("Please enter a valid phone number"),
  ).toBeVisible();

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

// Give a bad email address
test("fail bad email", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.email_address = "notagoodemail";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);

  // Shouldn't go through
  await submitFailureExpected(page);
});

test("fail bad email 2", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.email_address = "18";
  await fillOutJoinForm(page, missingData);
  await submitFailureExpected(page);
});

// Tests bad phone
test("fail bad phone", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.phone_number = "twelve";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);

  // Shouldn't go through
  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

test("fail bad phone 2", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormValues = Object.assign({}, sampleData);
  missingData.phone_number = "12";
  await fillOutJoinForm(page, missingData);
  await submitFailureExpected(page);
});

test("fail missing address", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingAddressData: JoinFormValues = Object.assign({}, sampleData);
  missingAddressData.street_address = "";
  await fillOutJoinForm(page, missingAddressData);

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

test("fail missing city", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingAddressData: JoinFormValues = Object.assign({}, sampleData);
  missingAddressData.city = "";
  await fillOutJoinForm(page, missingAddressData);

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

// This one should fail and here's why: It's really annoying when people
// don't give us their apartment #, so we make it required at the expense
// of those who live in houses. They can just write "house" or "N/A" or
// something
// TODO (wdn): Add a checkbox for my house-havers
test("fail missing unit number", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingAddressData: JoinFormValues = Object.assign({}, sampleData);
  missingAddressData.apartment = "";
  await fillOutJoinForm(page, missingAddressData);

  await expect(page.locator("[name='submit_join_form']")).toBeDisabled();
});

test("fail nj", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  await fillOutJoinForm(page, sampleNJData);

  // Uncomment this if you want to poke around after the join form has been filled out
  //await page.pause();

  await submitAndCheckToast(
    page,
    "Non-NYC registrations are not supported at this time",
  );

  // Check that the Join Record's code is correct.
  let joinRecord = await findJoinRecord(page);
  let code = 400;
  if (joinRecord.code !== code) {
    throw new Error(
      `JoinRecord code (${joinRecord.code}) did not match expected code (${code})`,
    );
  }
});
