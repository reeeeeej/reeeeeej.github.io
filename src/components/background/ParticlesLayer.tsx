import type { DeviceProfile, SceneStage } from '../../types/scene';

interface ParticlesLayerProps {
  profile: DeviceProfile;
  sceneStage: SceneStage;
}

const profileParticleCount: Record<DeviceProfile, number> = {
  'mobile-low': 5,
  'mobile-mid': 7,
  'mobile-high': 10,
  desktop: 16,
};

export function ParticlesLayer({
  profile,
  sceneStage,
}: ParticlesLayerProps) {
  const count = profileParticleCount[profile];
  const transitionBoost =
    sceneStage === 'transition-to-album' || sceneStage === 'transition-to-cake';
  const isGathering = sceneStage === 'transition-to-cake';

  return (
    <div
      className={`particles-layer ${transitionBoost ? 'is-transition-boost' : ''} ${isGathering ? 'is-gathering' : ''}`}
      aria-hidden="true"
    >
      <div className="particles-layer__mist particles-layer__mist--upper" />
      <div className="particles-layer__mist particles-layer__mist--lower" />

      {Array.from({ length: count }, (_, index) => {
        const size = 28 + ((index * 9) % 44);
        const left = (index * 23) % 100;
        const top = (index * 31) % 100;
        const duration = 10 + (index % 8);
        const delay = (index % 6) * 0.5;

        return (
          <span
            key={index}
            className="particles-layer__orb"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      {Array.from({ length: Math.max(4, Math.floor(count / 2)) }, (_, index) => {
        const left = (index * 27 + 8) % 100;
        const top = (index * 18 + 11) % 100;
        const duration = 14 + index * 1.2;
        const delay = index * 0.4;

        return (
          <span
            key={`sparkle-${index}`}
            className="particles-layer__sparkle"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
