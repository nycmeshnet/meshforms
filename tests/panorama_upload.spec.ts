import { test, expect } from "@/tests/mock/test";

const joinFormTimeout = 10000;
const unitTestTimeout = 5000;

test("happy panorama form", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/panorama");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Upload Panoramas and other Install Photos/);
});
