import { JoinFormInput } from '@/app/io';
import { test, expect, Page } from '@playwright/test';

// Integration tests for the Join Form.
//
// These tests can hit either a self-hosted dev instance of MeshDB
// (See https://github.com/nycmeshnet/meshdb) or it can hit the beta
// env.

// TODO (wdn): I want to test
// - Full cooperation with real address X
// - Missing address
// - Missing phone
// - Missing email
// - Missing phone + Missing email
// - Missing last name
// - Bad phone
// - Bad email
// Can we mirror what meshdb does?

async function fillOutJoinForm(page: Page, sampleData: JoinFormInput) {
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

// This tests the actual form.
test('happy join form', async ({ page }) => {
  test.setTimeout(10000)
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  const sampleData: JoinFormInput = JoinFormInput.parse({
    first_name: "Jon",
    last_name: "Smith",
    email: "js@gmail.com",
    phone: "585-475-2411",
    street_address: "876 Bergen St",
    apartment: "7",
    city: "Brooklyn",
    state: "NY",
    zip: 11238,
    roof_access: true,
    referral: "I googled it.",
    ncl: true,
  });

  // Set up sample data.
  await fillOutJoinForm(page, sampleData);
  
  // Submit the join form
  await page
    .getByRole('button', { name: /Submit/i })
    .click();
  
  // Make sure that the submit button says "Thanks!"
  await page.waitForTimeout(3000);
  await expect(
   page.locator("[name='submit_join_form']")
  ).toHaveText('Thanks!');
});

