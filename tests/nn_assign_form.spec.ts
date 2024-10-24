import { test, expect } from "@/tests/mock/test";

import {
  sampleData,
  fillOutJoinForm,
  submitSuccessExpected,
  submitFailureExpected,
  submitConfirmationDialogExpected,
  sampleNJData,
  submitAndCheckToast,
  expectSuccess,
} from "@/tests/util";

const timeout = 10000;
const clickTimeout = 1000;

// Unit tests for the Join Form.
//
// These tests will mock a connection to MeshDB. It is simply making sure that
// the form creates a good-looking payload and can hit a mock API.

test("nn assign happy", async ({ page }) => {
  test.setTimeout(timeout);
  await page.goto("/nn-assign");

  await expect(page).toHaveTitle(/Assign a Network Number/);

  await page.getByPlaceholder("Install Number").fill("20000");
  await page.getByPlaceholder("Pre-Shared Key").fill("localdev");

  await page.getByRole("button", { name: /Submit/i }).click();
  await page.waitForTimeout(clickTimeout);

  await expect(page.locator("[id='alert-network-number']")).toBeVisible();
  await expect(page.locator("[id='assigned-network-number']")).toHaveText("420");
});

test("nn assign wrong password", async ({ page }) => {
  test.setTimeout(timeout);
  await page.goto("/nn-assign");

  await expect(page).toHaveTitle(/Assign a Network Number/);

  await page.getByPlaceholder("Install Number").fill("20000");
  await page.getByPlaceholder("Pre-Shared Key").fill("badpassword");

  await page.getByRole("button", { name: /Submit/i }).click();
  await page.waitForTimeout(clickTimeout);
  
  await expect(page.locator("[id='alert-network-number']")).toBeHidden();
  await expect(page.locator("[id='assigned-network-number']")).toHaveText("");
});

test("nn assign no password", async ({ page }) => {
  test.setTimeout(timeout);
  await page.goto("/nn-assign");

  await expect(page).toHaveTitle(/Assign a Network Number/);

  await page.getByPlaceholder("Install Number").fill("20000");

  await expect(page.getByRole("button", { name: /Submit/i })).toBeDisabled();
  await page.waitForTimeout(clickTimeout);
  
  await expect(page.locator("[id='alert-network-number']")).toBeHidden();
  await expect(page.locator("[id='assigned-network-number']")).toHaveText("");
});
