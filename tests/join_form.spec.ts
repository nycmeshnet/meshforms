import { JoinFormInput, JoinFormResponse } from '@/app/io';
import { test, expect } from '@/tests/mock/test';

import { sampleData, fillOutJoinForm, submitSuccessExpected, submitFailureExpected } from '@/tests/util';

const joinFormTimeout = 10000;
const unitTestTimeout = 5000;

// Unit tests for the Join Form.
//
// These tests will mock a connection to MeshDB. It is simply making sure that
// the form creates a good-looking payload and can hit a mock API.

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

test('happy join form', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  await fillOutJoinForm(page, sampleData);

  await submitSuccessExpected(page, unitTestTimeout);
});


// Tests missing both first and last name
test('fail missing name', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingNameData: JoinFormInput;

  missingNameData = sampleData;
  missingNameData.first_name = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingNameData);
  
  // Shouldn't go through
  await submitFailureExpected(page);

  // Do it again with last name
  missingNameData = sampleData;
  missingNameData.last_name = "";
  await fillOutJoinForm(page, missingNameData);
  await submitFailureExpected(page);
});

// Tests missing email
// XXX (wdn): This is meant to fail right now, but we've got support for 
// email OR phone available, so we should update meshforms to do that.
test('fail missing email', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormInput;

  missingData = sampleData;
  missingData.email = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);
  
  // Shouldn't go through
  await submitFailureExpected(page);
});

// Tests missing phone
// XXX (wdn): Ditto to the above
test('fail missing phone', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormInput;

  missingData = sampleData;
  missingData.phone = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);
  
  // Shouldn't go through
  await submitFailureExpected(page);
});

// Tests missing email + phone
// XXX (wdn): Ditto to the above
test('fail missing email and phone', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  let missingData: JoinFormInput;

  missingData = sampleData;
  missingData.phone = "";
  missingData.email = "";

  // Set up sample data.
  await fillOutJoinForm(page, missingData);
  
  // Shouldn't go through
  await submitFailureExpected(page);
});

test('fail missing address', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  let missingAddressData: JoinFormInput;

  missingAddressData = sampleData;
  missingAddressData.street_address = "";
  await fillOutJoinForm(page, missingAddressData);
  await submitFailureExpected(page);

  missingAddressData = sampleData;
  missingAddressData.city = "";
  await fillOutJoinForm(page, missingAddressData);
  await submitFailureExpected(page);
});

// This one should fail and here's why: It's really annoying when people
// don't give us their apartment #, so we make it required at the expense
// of those who live in houses. They can just write "house" or "N/A" or
// something
// TODO (wdn): Add a checkbox for my house-havers
test('fail missing unit number', async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto('/join');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  let missingAddressData: JoinFormInput;

  missingAddressData = sampleData;
  missingAddressData.apartment = "";
  await fillOutJoinForm(page, missingAddressData);
  await submitFailureExpected(page);
});

