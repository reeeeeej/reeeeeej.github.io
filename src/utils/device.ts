import type { DeviceProfile } from '../types/scene';

export function getDeviceProfile(
  viewportWidth: number,
  deviceMemory?: number,
): DeviceProfile {
  if (viewportWidth >= 900) {
    return 'desktop';
  }

  if (viewportWidth <= 430 || (deviceMemory !== undefined && deviceMemory <= 6)) {
    return 'mobile-low';
  }

  if (viewportWidth <= 540 || (deviceMemory !== undefined && deviceMemory <= 8)) {
    return 'mobile-mid';
  }

  return 'mobile-high';
}
