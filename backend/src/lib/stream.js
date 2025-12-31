import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const streamClient = new StreamClient(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export async function upsertStreamUser(userData) {
  try {
    await streamClient.upsertUsers([userData]);
    console.log(`Stream user upserted: ${userData.id}`);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
}

export async function deleteStreamUser(userId) {
  try {
    await streamClient.deleteUsers([userId]);
    console.log(`Stream user deleted: ${userId}`);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
    throw error;
  }
}
