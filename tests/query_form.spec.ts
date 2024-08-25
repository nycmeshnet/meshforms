import { QueryFormInput, QueryFormResponse } from '@/app/io';
import { test, expect } from '@/tests/mock/test';

import { sampleData, fillOutJoinForm, submitSuccessExpected, submitFailureExpected } from '@/tests/util';

const queryFormTimeout = 2000;
const unitTestTimeout = 5000;

// Unit tests for the Query Form
//
// These tests will mock a connection to MeshDB. It is simply making sure that
// the form creates a good-looking payload and can hit a mock API.

test('happy query form email', async ({ page }) => {
  test.setTimeout(queryFormTimeout);
  await page.goto('/query');

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  // Set up sample data.
  await fillOutJoinForm(page, sampleData);

  await submitSuccessExpected(page, unitTestTimeout);
});
