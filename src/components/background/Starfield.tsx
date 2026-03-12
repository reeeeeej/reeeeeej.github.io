import type { DeviceProfile } from '../../types/scene';

interface StarfieldProps {
  profile: DeviceProfile;
}

const profileStarCount: Record<DeviceProfile, number> = {
  'mobile-low': 12,
  'mobile-mid': 20,
  'mobile-high': 30,
  desktop: 64,
};

export function Starfield({ profile }: StarfieldProps) {
  const count = profileStarCount[profile];
  const driftingStars =
    profile === 'desktop'
      ? Math.max(10, Math.floor(count / 3))
      : Math.max(4, Math.floor(count / 4));

  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield__veil starfield__veil--top" />
      <div className="starfield__veil starfield__veil--side" />
      <div className="starfield__aurora" />
      <div className="starfield__dust starfield__dust--left" />
      <div className="starfield__dust starfield__dust--right" />

      {Array.from({ length: count }, (_, index) => {
        const size = 1 + (index % 3);
        const left = (index * 17 + (index % 4) * 7) % 100;
        const top = (index * 29 + (index % 6) * 5) % 100;
        const duration = 5 + (index % 7);
        const delay = (index % 5) * 0.7;

        return (
          <span
            key={index}
            className="starfield__star"
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

      {Array.from({ length: driftingStars }, (_, index) => {
        const width = 36 + (index % 4) * 14;
        const left = (index * 19 + 9) % 100;
        const top = (index * 23 + 14) % 100;
        const duration = 18 + (index % 5) * 4;
        const delay = index * 0.8;

        return (
          <span
            key={`trail-${index}`}
            className="starfield__trail"
            style={{
              width: `${width}px`,
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
