import { test, expect } from "@playwright/test";
import {
  fillOutJoinForm,
  sampleData,
  submitFailureExpected,
} from "./util";

const joinFormTimeout = 20000;

// This test will run in its own github action that does not set up MinIO.
// I tried for WEEKS and I could not find a way to mock a failure between
// Node and MinIO.
test.describe("fail meshdb is hard down and s3 is hard down", () => {
  test.skip(process.env.RUN_SKIPPED !== "true");

  test("fail meshdb is hard down and s3 is hard down", async ({ page }) => {
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

    await submitFailureExpected(page);
  });
});
