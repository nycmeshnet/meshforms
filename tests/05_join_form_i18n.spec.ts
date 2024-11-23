import { JoinFormValues } from "@/components/JoinForm/JoinForm";
import { test, expect } from "./mock/test";

import {
  sampleData,
  fillOutJoinForm,
  submitConfirmationDialogExpected,
  expectSuccess,
} from "./util";

const joinFormTimeout = 40000;
const unitTestTimeout = 5000;

test("es confirm street address", async ({ page }) => {
  test.setTimeout(joinFormTimeout);
  await page.goto("/join");

  // Is the page title correct?
  await expect(page).toHaveTitle(/Join Our Community Network!/);

  await page
    .locator("[id='joinform-locale-switcher-select']")
    .selectOption("🇪🇸 Español");

  await expect(page.locator("[id='joinform-title']")).toHaveText(
    "Únase NYC Mesh",
  );

  let data: JoinFormValues = Object.assign({}, sampleData);
  data.street_address = "197 prospect pl";

  // Set up sample data.
  await fillOutJoinForm(page, data);

  await submitConfirmationDialogExpected(page, 2000);

  // Ensure the dialogue is translated
  await expect(page.locator("[id='alert-dialog-description']")).toHaveText("Debíamos que reformatear algunos de sus datos. Por favor asegurar que los campos abajos son ascertados.");

  await page.locator("[name='confirm']").click();

  await expectSuccess(page, unitTestTimeout);
});
