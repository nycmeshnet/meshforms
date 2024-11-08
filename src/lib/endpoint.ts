"use server";

// Literally just ask the server what endpoint to use.
export async function getMeshDBAPIEndpoint() {
  if (process.env.MESHDB_URL === undefined) {
    throw new Error("Expected MESHDB_URL environment variable");
  }
  return process.env.MESHDB_URL;
}
