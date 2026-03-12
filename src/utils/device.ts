import type { DeviceProfile } from '../types/scene';

export function getDeviceProfile(
  viewportWidth: number,
  deviceMemory?: number,
): DeviceProfile {
  if (viewportWidth >= 900) {
    return 'desktop';
  }

  if (viewportWidth <= 390 || (deviceMemory !== undefined && deviceMemory <= 4)) {
    return 'mobile-low';
  }

  if (viewportWidth <= 480 || (deviceMemory !== undefined && deviceMemory <= 8)) {
    return 'mobile-mid';
  }

  return 'mobile-high';
}
