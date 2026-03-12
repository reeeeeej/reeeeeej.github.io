import { useAppStateContext } from '../app/providers/AppStateProvider';

export function useDeviceProfile() {
  return useAppStateContext().state.deviceProfile;
}
