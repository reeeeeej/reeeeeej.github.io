import type { DeviceProfile, SceneConfig } from '../../types/scene';
import { HintText } from '../ui/HintText';
import { CakeCore } from './CakeCore';
import { CakeGlow } from './CakeGlow';

interface CakeSceneProps {
  sceneConfig: SceneConfig;
  profile: DeviceProfile;
  stage: 'cake' | 'transition-to-album' | 'transition-to-cake';
  onActivate: () => void;
  settling?: boolean;
  interactionLocked?: boolean;
}

export function CakeScene({
  sceneConfig,
  profile,
  stage,
  onActivate,
  settling = false,
  interactionLocked = false,
}: CakeSceneProps) {
  const isTransitioning = stage !== 'cake';
  const isTransitioningOut = stage === 'transition-to-album';
  const isReturning = stage === 'transition-to-cake';

  return (
    <section
      className={[
        'cake-scene',
        isTransitioningOut ? 'is-transitioning-out' : '',
        isReturning ? 'is-returning' : '',
        settling ? 'is-settling-in' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cake-scene__ornament cake-scene__ornament--left" />
      <div className="cake-scene__ornament cake-scene__ornament--right" />

      <div className="cake-scene__copy">
        <span className="cake-scene__eyebrow">Birthday wish</span>
        <h1 className="cake-scene__title">{sceneConfig.title}</h1>
        {sceneConfig.subtitle ? (
          <p className="cake-scene__subtitle">{sceneConfig.subtitle}</p>
        ) : null}
      </div>

      <button
        type="button"
        className="cake-scene__button"
        onClick={onActivate}
        disabled={isTransitioning || interactionLocked}
        aria-label={sceneConfig.hintText}
      >
        <CakeGlow />
        <CakeCore
          profile={profile}
          transitionState={
            isTransitioningOut
              ? 'explode'
              : isReturning
                ? 'reform'
                : 'idle'
          }
        />
        <div className="cake-scene__transition" aria-hidden="true">
          <span className="cake-scene__transition-flare" />
          <span className="cake-scene__transition-stream cake-scene__transition-stream--left" />
          <span className="cake-scene__transition-stream cake-scene__transition-stream--center" />
          <span className="cake-scene__transition-stream cake-scene__transition-stream--right" />
          <span className="cake-scene__transition-card cake-scene__transition-card--one" />
          <span className="cake-scene__transition-card cake-scene__transition-card--two" />
          <span className="cake-scene__transition-card cake-scene__transition-card--three" />
        </div>
      </button>

      <HintText>
        {isTransitioningOut
          ? 'The album is unfolding...'
          : isReturning
            ? 'Gathering the keepsakes back into the cake...'
            : sceneConfig.hintText}
      </HintText>
    </section>
  );
}
