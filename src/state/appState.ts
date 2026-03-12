import type { DeviceProfile, SceneStage } from '../types/scene';

export interface AppState {
  sceneStage: SceneStage;
  selectedCardId: string | null;
  isTransitioning: boolean;
  deviceProfile: DeviceProfile;
  gestureModeEnabled: boolean;
  reducedMotionPreferred: boolean;
}

export type AppStateAction =
  | { type: 'set_stage'; sceneStage: SceneStage }
  | { type: 'start_transition_to_album' }
  | { type: 'complete_transition_to_album' }
  | { type: 'start_transition_to_cake' }
  | { type: 'complete_transition_to_cake' }
  | { type: 'open_detail'; cardId: string }
  | { type: 'close_detail' }
  | { type: 'set_device_profile'; deviceProfile: DeviceProfile }
  | { type: 'set_gesture_mode'; gestureModeEnabled: boolean }
  | { type: 'set_reduced_motion'; reducedMotionPreferred: boolean };

export function createInitialAppState(
  deviceProfile: DeviceProfile,
  reducedMotionPreferred: boolean,
): AppState {
  return {
    sceneStage: 'loading',
    selectedCardId: null,
    isTransitioning: false,
    deviceProfile,
    gestureModeEnabled: false,
    reducedMotionPreferred,
  };
}

export function appStateReducer(
  state: AppState,
  action: AppStateAction,
): AppState {
  switch (action.type) {
    case 'set_stage':
      return {
        ...state,
        sceneStage: action.sceneStage,
      };
    case 'start_transition_to_album':
      return {
        ...state,
        sceneStage: 'transition-to-album',
        isTransitioning: true,
        selectedCardId: null,
      };
    case 'complete_transition_to_album':
      return {
        ...state,
        sceneStage: 'album',
        isTransitioning: false,
      };
    case 'start_transition_to_cake':
      return {
        ...state,
        sceneStage: 'transition-to-cake',
        isTransitioning: true,
        selectedCardId: null,
      };
    case 'complete_transition_to_cake':
      return {
        ...state,
        sceneStage: 'cake',
        isTransitioning: false,
      };
    case 'open_detail':
      return {
        ...state,
        sceneStage: 'detail',
        selectedCardId: action.cardId,
      };
    case 'close_detail':
      return {
        ...state,
        sceneStage: 'album',
        selectedCardId: null,
      };
    case 'set_device_profile':
      return {
        ...state,
        deviceProfile: action.deviceProfile,
      };
    case 'set_gesture_mode':
      return {
        ...state,
        gestureModeEnabled: action.gestureModeEnabled,
      };
    case 'set_reduced_motion':
      return {
        ...state,
        reducedMotionPreferred: action.reducedMotionPreferred,
      };
    default:
      return state;
  }
}
