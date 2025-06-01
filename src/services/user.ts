import db from "@/lib/db";
import { User } from "@/types/user";
import { generateUserHash, generateDeviceId } from "@/lib/userHash";

export async function findOrCreateUser(userAgent: string, ipAddress: string, deviceId?: string): Promise<User> {
  // Generate device ID if not provided
  const finalDeviceId = deviceId || generateDeviceId(userAgent);

  // Generate user hash from user agent and device ID
  const userHash = generateUserHash(userAgent, finalDeviceId);

  // Check if user already exists
  const existingUser = await db("users").where({ hash: userHash }).first();

  if (existingUser) {
    // Update IP address if it has changed
    if (existingUser.ip_address !== ipAddress) {
      await db("users").where({ hash: userHash }).update({
        ip_address: ipAddress,
        updated_at: new Date()
      });
    }
    return existingUser;
  }

  // Create new user
  const newUser: User = {
    hash: userHash,
    ip_address: ipAddress,
    user_agent: userAgent,
    device_id: finalDeviceId,
  };

  await db("users").insert(newUser);
  const createdUser = await db("users").where({ hash: userHash }).first();
  return createdUser;
}
