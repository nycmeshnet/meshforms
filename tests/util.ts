import { getJoinRecordFromS3 } from "@/lib/join_record";
import { JoinRecord } from "@/lib/types";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { expect, Page } from "@playwright/test";

export const sampleData: JoinFormValues = {
  first_name: "Jon",
  last_name: "Smith",
  email_address: "js@gmail.com",
  phone_number: "585-475-2411",
  street_address: "197 Prospect Place",
  apartment: "1",
  city: "Brooklyn",
  state: "NY",
  zip_code: "11238",
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
  trust_me_bro: false,
};

export const sampleJoinRecord: JoinRecord = {
  first_name: "Jon",
  last_name: "Smith",
  email_address: "js@gmail.com",
  phone_number: "+1 585-475-2411",
  street_address: "197 Prospect Place",
  apartment: "1",
  city: "Brooklyn",
  state: "NY",
  zip_code: "11238",
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
  trust_me_bro: false,
  submission_time: "2024-11-01T08:24:24",
  code: 201,
  replayed: 0,
  install_number: 1002,
};

export const expectedTrustMeBroValues: JoinFormValues = {
  first_name: "Jon",
  last_name: "Smith",
  email_address: "js@gmail.com",
  phone_number: "585-475-2411",
  street_address: "197 prospect pl",
  apartment: "1",
  city: "brooklyn",
  state: "NY",
  zip_code: "11238",
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
  trust_me_bro: false,
};

export const sampleNJData: JoinFormValues = {
  first_name: "Jon",
  last_name: "Smith",
  email_address: "js@gmail.com",
  phone_number: "585-475-2411",
  street_address: "711 Hudson Street",
  city: "Hoboken",
  state: "NJ",
  zip_code: "07030",
  apartment: "1",
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
  trust_me_bro: false,
};

let expectedAPIRequestDataMut: JoinFormValues = sampleData;
expectedAPIRequestDataMut.phone_number = "+1 585-475-2411";

export const expectedAPIRequestData = expectedAPIRequestDataMut;

export async function fillOutJoinForm(page: Page, sampleData: JoinFormValues) {
  // Set up some sample data

  // Personal info
  await page.getByPlaceholder("First Name").fill(sampleData.first_name);
  await page.getByPlaceholder("Last Name").fill(sampleData.last_name);
  await page.getByPlaceholder("Email Address").fill(sampleData.email_address);
  await page.getByPlaceholder("Phone Number").fill(sampleData.phone_number);

  // Address Info
  await page.getByPlaceholder("Street Address").fill(sampleData.street_address);
  await page.getByPlaceholder("Unit / Apartment #").fill(sampleData.apartment);
  await page.getByPlaceholder("City").fill(sampleData.city);
  await page.getByPlaceholder("State").fill(sampleData.state);
  await page.getByPlaceholder("Zip Code").fill(sampleData.zip_code.toString());

  // How did you hear about us?
  await page
    .getByPlaceholder("How did you hear about us?")
    .fill(sampleData.referral);

  // Agree to the NCL
  if (sampleData.ncl) {
    await page.locator("[name='ncl']").check();
  }

  // Roof Access
  if (sampleData.roof_access) {
    await page.locator("[name='roof_access']").check();
  }
}

export async function submitFailureExpected(page: Page) {
  await page.waitForTimeout(1000);
  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  await page.waitForTimeout(1000);

  // The submission should've been stopped, and the member should be able to try again.
  await expect(page.locator("[name='submit_join_form']")).toHaveText("Submit");
}

export async function submitAndCheckToast(page: Page, toastMessage: string) {
  await page.waitForTimeout(1000);
  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  await page.waitForTimeout(1000);

  // The submission should've been stopped, and the member should be able to try again.
  await expect(page.locator("[name='submit_join_form']")).toHaveText("Submit");
  await expect(page.getByTestId("toasty")).toContainText(toastMessage);
}

export async function submitSuccessExpected(
  page: Page,
  timeout: number = 10000,
) {
  await page.waitForTimeout(1000);
  // Listen for all console logs
  page.on("console", (msg) => console.log(msg.text()));

  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  await expectSuccess(page, timeout);
}

export async function expectSuccess(page: Page, timeout: number = 1000) {
  await page.waitForTimeout(timeout);
  await expect(page.locator("[name='submit_join_form']")).toBeHidden();
  await expect(page.locator("[id='alert-thank-you']")).toBeVisible();
}

export async function submitConfirmationDialogExpected(
  page: Page,
  timeout: number = 10000,
) {
  // Listen for all console logs
  page.on("console", (msg) => console.log(msg.text()));

  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  await page.waitForTimeout(timeout);
  await expect(page.locator("[id='alert-dialog-title']")).toBeVisible();
}

export async function findJoinRecord(page: Page): Promise<JoinRecord> {
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
  return joinRecord;
}
