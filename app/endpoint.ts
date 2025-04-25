"use server";

// Ask the server where MeshDB Lives
export async function getMeshDBAPIEndpoint() {
  if (process.env.MESHDB_URL === undefined) {
    throw new Error("Expected MESHDB_URL environment variable");
  }
  return process.env.MESHDB_URL;
}

// Ask the server where Pano lives
export async function getPanoEndpoint() {
  if (process.env.PANO_URL === undefined) {
    throw new Error("Expected PANO_URL environment variable");
  }
  return process.env.PANO_URL;
}
