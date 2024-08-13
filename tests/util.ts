import { JoinFormInput, JoinFormResponse } from '@/app/io';
import { expect, Page } from '@playwright/test';

export const sampleData: JoinFormInput = JoinFormInput.parse({
  first_name: "Jon",
  last_name: "Smith",
  email: "js@gmail.com",
  phone: "585-475-2411",
  street_address: "197 Prospect Pl",
  apartment: "1",
  city: "Brooklyn",
  state: "NY",
  zip: 11238,
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
});

// The phone number is formatted differently
export const expectedAPIRequestData: JoinFormInput = JoinFormInput.parse({
  first_name: "Jon",
  last_name: "Smith",
  email: "js@gmail.com",
  phone: "+1 585 475 2411",
  street_address: "197 Prospect Pl",
  apartment: "1",
  city: "Brooklyn",
  state: "NY",
  zip: 11238,
  roof_access: true,
  referral: "I googled it.",
  ncl: true,
});

export async function fillOutJoinForm(page: Page, sampleData: JoinFormInput) {
  // Set up some sample data

  // Personal info
  await page
    .getByPlaceholder('First Name')
    .fill(sampleData.first_name);
  await page
    .getByPlaceholder('Last Name')
    .fill(sampleData.last_name);
  await page
    .getByPlaceholder('Email Address')
    .fill(sampleData.email);
  await page
    .getByPlaceholder('Phone Number')
    .fill(sampleData.phone);

  // Address Info
  await page
    .getByPlaceholder('Street Address')
    .fill(sampleData.street_address);

  await page
    .getByPlaceholder('Unit #')
    .fill(sampleData.apartment);

  await page
    .getByPlaceholder('City')
    .fill(sampleData.city);

  await page
    .getByPlaceholder('Zip Code')
    .fill(sampleData.zip.toString());

  // How did you hear about us?
  await page
    .getByPlaceholder('How did you hear about us?')
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
  // Submit the join form
  await page
    .getByRole('button', { name: /Submit/i })
    .click();
  
  await page.waitForTimeout(1000);

  // The submission should've been stopped, and the member should be able to try again.
  await expect(
   page.locator("[name='submit_join_form']")
  ).toHaveText('Submit');
}

export async function submitSuccessExpected(page: Page, timeout: number = 10000) {
  // Listen for all console logs
  page.on('console', msg => console.log(msg.text()));

  // Submit the join form
  await page
    .getByRole('button', { name: /Submit/i })
    .click();
  
  // Make sure that the submit button says "Thanks!"
  await page.waitForTimeout(timeout);
  await expect(
   page.locator("[name='submit_join_form']")
  ).toHaveText('Thanks!');
}

