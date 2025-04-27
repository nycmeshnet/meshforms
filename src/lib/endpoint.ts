"use server";

// Ask the server what endpoint to use.
export async function getMeshDBAPIEndpoint() {
  if (process.env.MESHDB_URL === undefined) {
    throw new Error("Expected MESHDB_URL environment variable");
  }
  return process.env.MESHDB_URL;
}

// Sue me
export async function panoEnabled() {
  const enabled = process.env.ENABLE_PANO_UI;
  console.log(`Pano enabled: ${enabled}`);
  if (enabled) {
    return false;
  }
  return true;
}

// Ask the server where Pano lives
export async function getPanoEndpoint() {
  const panoEndpoint = process.env.PANO_URL;
  console.log(`Pano Endpoint is ${panoEndpoint}`);
  if (panoEndpoint === undefined) {
    //throw new Error("Expected PANO_URL environment variable");
    return "";
  }
  return panoEndpoint;
}

// Ask the server what captcha keys to use
export async function getRecaptchaKeys() {
  if (!process.env.RECAPTCHA_V2_KEY) {
    console.warn("RECAPTCHA_V2_KEY not set");
  }

  if (!process.env.RECAPTCHA_V3_KEY) {
    console.warn("RECAPTCHA_V3_KEY not set");
  }

  return [process.env.RECAPTCHA_V2_KEY, process.env.RECAPTCHA_V3_KEY];
}

// Ask the server what env we're in
export async function getEnvironment() {
  return process.env.MESHFORMS_ENVIRONMENT ?? "";
}

// Get RUM environment variables
export async function getRumApplicationID() {
  return process.env.RUM_APPLICATION_ID ?? "";
}

export async function getRumClientToken() {
  return process.env.RUM_CLIENT_TOKEN ?? "";
}
