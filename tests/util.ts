import { JoinFormResponse } from "@/app/io";
import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { expect, Page } from "@playwright/test";

export const sampleData: JoinFormValues = {
  firstName: "Jon",
  lastName: "Smith",
  emailAddress: "js@gmail.com",
  phoneNumber: "585-475-2411",
  streetAddress: "197 Prospect Pl",
  apartment: "1",
  city: "Brooklyn",
  state: "NY",
  zipCode: "11238",
  roofAccess: true,
  referral: "I googled it.",
  ncl: true,
};

let expectedAPIRequestData: JoinFormValues = sampleData;
expectedAPIRequestData.phoneNumber = "+1 585 475 2411";

export async function fillOutJoinForm(page: Page, sampleData: JoinFormValues) {
  // Set up some sample data

  // Personal info
  await page.getByPlaceholder("First Name").fill(sampleData.firstName);
  await page.getByPlaceholder("Last Name").fill(sampleData.lastName);
  await page.getByPlaceholder("Email Address").fill(sampleData.emailAddress);
  await page.getByPlaceholder("Phone Number").fill(sampleData.phoneNumber);

  // Address Info
  await page.getByPlaceholder("Street Address").fill(sampleData.streetAddress);
  await page.getByPlaceholder("Unit #").fill(sampleData.apartment);
  await page.getByPlaceholder("City").fill(sampleData.city);
  await page.getByPlaceholder("Zip Code").fill(sampleData.zipCode.toString());

  // How did you hear about us?
  await page
    .getByPlaceholder("How did you hear about us?")
    .fill(sampleData.referral);

  // Agree to the NCL
  if (sampleData.ncl) {
    await page.locator("[name='ncl']").check();
  }

  // Roof Access
  if (sampleData.roofAccess) {
    await page.locator("[name='roofAccess']").check();
  }
}

export async function submitFailureExpected(page: Page) {
  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  await page.waitForTimeout(1000);

  // The submission should've been stopped, and the member should be able to try again.
  await expect(page.locator("[name='submit_join_form']")).toHaveText("Submit");
}

export async function submitSuccessExpected(
  page: Page,
  timeout: number = 10000,
) {
  // Listen for all console logs
  page.on("console", (msg) => console.log(msg.text()));

  // Submit the join form
  await page.getByRole("button", { name: /Submit/i }).click();

  // Make sure that the submit button says "Thanks!"
  await page.waitForTimeout(timeout);
  await expect(page.locator("[name='submit_join_form']")).toHaveText("Thanks!");
}
