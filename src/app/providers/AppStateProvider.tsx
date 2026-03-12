import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from 'react';
import {
  appStateReducer,
  createInitialAppState,
  type AppState,
  type AppStateAction,
} from '../../state/appState';
import { getDeviceProfile } from '../../utils/device';

interface AppStateContextValue {
  state: AppState;
  dispatch: Dispatch<AppStateAction>;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function getReducedMotionPreference() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getCurrentDeviceProfile() {
  if (typeof window === 'undefined') {
    return 'mobile-mid' as const;
  }

  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
  };

  return getDeviceProfile(window.innerWidth, navigatorWithMemory.deviceMemory);
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    appStateReducer,
    createInitialAppState(
      getCurrentDeviceProfile(),
      getReducedMotionPreference(),
    ),
  );

  useEffect(() => {
    const syncDeviceProfile = () => {
      dispatch({
        type: 'set_device_profile',
        deviceProfile: getCurrentDeviceProfile(),
      });
    };

    syncDeviceProfile();
    window.addEventListener('resize', syncDeviceProfile);

    return () => {
      window.removeEventListener('resize', syncDeviceProfile);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => {
      dispatch({
        type: 'set_reduced_motion',
        reducedMotionPreferred: mediaQuery.matches,
      });
    };

    syncReducedMotion();
    mediaQuery.addEventListener('change', syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (state.sceneStage !== 'loading') {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'set_stage', sceneStage: 'cake' });
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state.sceneStage]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppStateContext() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppStateContext must be used within AppStateProvider');
  }

  return context;
}
