/**
 * Simple Device/Browser identification utility for Sanad Platform.
 * Generates a persistent ID for the browser instance.
 */

export function getDeviceId(): string {
  const key = 'sanad_device_id_v2';
  let id = localStorage.getItem(key);
  
  if (!id) {
    id = 'DEV-' + Math.random().toString(36).substring(2, 12).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    localStorage.setItem(key, id);
  }
  
  return id;
}

/**
 * Checks if the user's current device is authorized.
 */
export function isDeviceAuthorized(userDevices: string[] | undefined, currentId: string): boolean {
  if (!userDevices || userDevices.length === 0) return true; // Initial login
  return userDevices.includes(currentId);
}
