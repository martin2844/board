import { createHash } from 'crypto';

/**
 * Generate a user hash from user agent and device ID
 */
export function generateUserHash(userAgent: string, deviceId: string): string {
    const combined = `${userAgent}:${deviceId}`;
    return createHash('sha256').update(combined).digest('hex').substring(0, 16);
}

/**
 * Generate a device ID from user agent (fallback if no device ID provided)
 */
export function generateDeviceId(userAgent: string): string {
    return createHash('md5').update(userAgent).digest('hex').substring(0, 12);
} 