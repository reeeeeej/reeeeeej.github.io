import { useAppStateContext } from '../app/providers/AppStateProvider';
import {
  INTRO_TO_CAKE_TRANSITION_MS,
  ALBUM_TO_CAKE_TRANSITION_MS,
  CAKE_TO_ALBUM_TRANSITION_MS,
} from '../utils/animation';
import { detectBrowserProfile } from '../utils/browser';

export function useSceneStage() {
  const { state, dispatch } = useAppStateContext();
  const browserProfile = detectBrowserProfile();

  const beginCakeScene = () => {
    if (state.isTransitioning || state.sceneStage !== 'intro') {
      return;
    }

    dispatch({ type: 'start_intro_transition' });

    window.setTimeout(() => {
      dispatch({ type: 'complete_intro_transition' });
    }, state.reducedMotionPreferred ? 180 : INTRO_TO_CAKE_TRANSITION_MS);
  };

  const beginAlbumTransition = () => {
    if (state.isTransitioning || state.sceneStage !== 'cake') {
      return;
    }

    dispatch({ type: 'start_transition_to_album' });

    window.setTimeout(() => {
      dispatch({ type: 'complete_transition_to_album' });
    }, state.reducedMotionPreferred ? 250 : browserProfile === 'ios-safari' ? 420 : CAKE_TO_ALBUM_TRANSITION_MS);
  };

  const beginCakeReturn = () => {
    if (state.isTransitioning || state.sceneStage !== 'album') {
      return;
    }

    dispatch({ type: 'start_transition_to_cake' });

    window.setTimeout(() => {
      dispatch({ type: 'complete_transition_to_cake' });
    }, state.reducedMotionPreferred ? 250 : ALBUM_TO_CAKE_TRANSITION_MS);
  };

  return {
    sceneStage: state.sceneStage,
    reducedMotionPreferred: state.reducedMotionPreferred,
    isTransitioning: state.isTransitioning,
    beginCakeScene,
    beginAlbumTransition,
    beginCakeReturn,
  };
}
