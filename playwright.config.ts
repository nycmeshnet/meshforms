import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

import dotenv from "dotenv";
import path from "path";

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* This depends on MinIO, so it can't be run in parallel otherwise we'll get race conditions */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Opt out of parallel tests. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Exclude tests not meant to use S3. */
  testIgnore: '**/*s3_down*',

  /* Configure projects for major browsers */
  // XXX (willnilges): I don't care so much about testing per-browser functionality
  // right now as much as I care about testing basic logic and such, so I'm gonna
  // use what WOMM. I invite someone to get the others working locally in Docker
  // or something.
  projects: [
    /*
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    */

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    /*
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
});
