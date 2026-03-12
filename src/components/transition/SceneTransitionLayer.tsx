import type { DeviceProfile } from '../../types/scene';

interface SceneTransitionLayerProps {
  direction: 'to-album' | 'to-cake' | null;
  profile: DeviceProfile;
  settling?: boolean;
}

const particleCountByProfile: Record<DeviceProfile, number> = {
  'mobile-low': 14,
  'mobile-mid': 18,
  'mobile-high': 22,
  desktop: 26,
};

const particleTones = ['moon', 'ice', 'violet', 'rose'] as const;

function seededUnit(seed: number) {
  return (Math.sin(seed) + 1) / 2;
}

export function SceneTransitionLayer({
  direction,
  profile,
  settling = false,
}: SceneTransitionLayerProps) {
  if (!direction) {
    return null;
  }

  const count = particleCountByProfile[profile];

  return (
    <div
      className={`scene-transition-layer scene-transition-layer--${direction} ${settling ? 'is-settling-out' : ''}`}
      aria-hidden="true"
    >
      <div className="scene-transition-layer__cloud">
        <div className="scene-transition-layer__flare scene-transition-layer__flare--outer" />
        <div className="scene-transition-layer__flare scene-transition-layer__flare--inner" />
        <div className="scene-transition-layer__core" />

        {Array.from({ length: count }, (_, index) => {
          const angle = (Math.PI * 2 * index) / count;
          const radius = 18 + (index % 6) * 9 + seededUnit(index * 3.2) * 12;
          const spreadX = Math.cos(angle) * radius;
          const spreadY = Math.sin(angle) * (radius * 0.72) - 12;
          const driftX = spreadX * 1.55;
          const driftY = spreadY * 1.35 - 18;
          const size = 3 + (index % 3) * 1.2;
          const tone = particleTones[index % particleTones.length];

          return (
            <span
              key={index}
              className={`scene-transition-layer__particle scene-transition-layer__particle--${tone}`}
              style={{
                left: '50%',
                top: '50%',
                width: `${size}px`,
                height: `${size}px`,
                ['--particle-size' as string]: `${size}px`,
                ['--transition-from-x' as string]: `${spreadX * 0.18}px`,
                ['--transition-from-y' as string]: `${spreadY * 0.18}px`,
                ['--transition-mid-x' as string]: `${spreadX}px`,
                ['--transition-mid-y' as string]: `${spreadY}px`,
                ['--transition-to-x' as string]: `${driftX}px`,
                ['--transition-to-y' as string]: `${driftY}px`,
                ['--transition-delay' as string]: `${(index % 10) * 36}ms`,
              }}
            />
          );
        })}

        {Array.from({ length: 3 }, (_, index) => (
          <span
            key={`stream-${index}`}
            className={`scene-transition-layer__stream scene-transition-layer__stream--${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
