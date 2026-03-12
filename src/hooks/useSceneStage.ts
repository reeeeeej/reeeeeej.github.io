import { useAppStateContext } from '../app/providers/AppStateProvider';
import {
  ALBUM_TO_CAKE_TRANSITION_MS,
  CAKE_TO_ALBUM_TRANSITION_MS,
} from '../utils/animation';

export function useSceneStage() {
  const { state, dispatch } = useAppStateContext();

  const beginAlbumTransition = () => {
    if (state.isTransitioning || state.sceneStage !== 'cake') {
      return;
    }

    dispatch({ type: 'start_transition_to_album' });

    window.setTimeout(() => {
      dispatch({ type: 'complete_transition_to_album' });
    }, state.reducedMotionPreferred ? 250 : CAKE_TO_ALBUM_TRANSITION_MS);
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
    beginAlbumTransition,
    beginCakeReturn,
  };
}
