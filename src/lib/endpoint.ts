"use server";

// Literally just ask the server what endpoint to use.
export async function getMeshDBAPIEndpoint() {
  if (process.env.MESHDB_URL === undefined) {
    throw new Error("Expected MESHDB_URL environment variable");
  }
  return process.env.MESHDB_URL;
}

// Literally just ask the server what captcha keys to use
export async function getRecaptchaKeys() {
  if (!process.env.RECAPTCHA_V2_KEY) {
    console.warn("RECAPTCHA_V2_KEY not set");
  }

  if (!process.env.RECAPTCHA_V3_KEY) {
    console.warn("RECAPTCHA_V3_KEY not set");
  }

  return [process.env.RECAPTCHA_V2_KEY, process.env.RECAPTCHA_V3_KEY];
}

// Literally just ask the server what env we're in
export async function getEnvironment() {
  return process.env.MESHFORMS_ENVIRONMENT ?? "";
}
