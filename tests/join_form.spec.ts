import { test, expect } from '@playwright/test';

// TODO (wdn): I want to test
// - Full cooperation with real address
// - Missing address
// - Missing phone
// - Missing email
// - Missing phone + Missing email
// - Missing last name
// - Bad phone
// - Bad email
// Can we mirror what meshdb does?

// This tests the actual form.
test('happy join form', async ({ page }) => {
  test.setTimeout(10000)
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up some sample data
  await page
    .getByPlaceholder('First Name')
    .fill('Jon');
  await page
    .getByPlaceholder('Last Name')
    .fill('Smith');
  await page
    .getByPlaceholder('Email Address')
    .fill('js@gmail.com');

  await page
    .getByPlaceholder('Phone Number')
    .fill('585-475-2411');

  // Address Info
  await page
    .getByPlaceholder('Street Address')
    .fill('876 Bergen St');

  await page
    .getByPlaceholder('Unit #')
    .fill('7');

  await page
    .getByPlaceholder('City')
    .fill('Brooklyn');

  await page
    .getByPlaceholder('Zip Code')
    .fill('11238');

  // How did you hear about us?
  await page
    .getByPlaceholder('How did you hear about us?')
    .fill('I googled it.');

  // Agree to the NCL
  await page.locator("[name='ncl']").check();
  
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

