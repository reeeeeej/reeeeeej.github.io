import type { CSSProperties } from 'react';
import type { DeviceProfile } from '../../types/scene';

interface CakeCoreProps {
  profile: DeviceProfile;
  transitionState: 'idle' | 'explode' | 'reform';
}

interface TierConfig {
  key: 'top' | 'mid' | 'base';
  radiusX: number;
  radiusY: number;
  topCenter: number;
  depth: number;
  fillCount: number;
  sideColumns: number;
  sideRows: number;
  rimCount: number;
  sparkCount: number;
  fillBias: number;
}

const tiers: TierConfig[] = [
  {
    key: 'top',
    radiusX: 14,
    radiusY: 3.6,
    topCenter: 66,
    depth: 8,
    fillCount: 38,
    sideColumns: 11,
    sideRows: 5,
    rimCount: 18,
    sparkCount: 12,
    fillBias: 1.1,
  },
  {
    key: 'mid',
    radiusX: 23,
    radiusY: 4.8,
    topCenter: 48,
    depth: 11,
    fillCount: 58,
    sideColumns: 16,
    sideRows: 6,
    rimCount: 24,
    sparkCount: 18,
    fillBias: 0.94,
  },
  {
    key: 'base',
    radiusX: 32,
    radiusY: 5.8,
    topCenter: 27,
    depth: 14,
    fillCount: 76,
    sideColumns: 20,
    sideRows: 7,
    rimCount: 32,
    sparkCount: 24,
    fillBias: 0.82,
  },
];

const particleTones = ['moon', 'ice', 'violet', 'rose'] as const;
const profileDensityScale: Record<DeviceProfile, number> = {
  'mobile-low': 0.42,
  'mobile-mid': 0.56,
  'mobile-high': 0.72,
  desktop: 1,
};

function seededUnit(seed: number) {
  return (Math.sin(seed) + 1) / 2;
}

function toneFor(index: number, shift = 0) {
  return particleTones[(index + shift) % particleTones.length];
}

function createParticleMotion(left: number, bottom: number, strength = 3) {
  const dx = left - 50;
  const dy = bottom - 46;

  return {
    ['--explode-x' as string]: `${dx * strength}px`,
    ['--explode-y' as string]: `${dy * strength - 18}px`,
  } as CSSProperties;
}

function createTopRing(tier: TierConfig, tierIndex: number) {
  return Array.from({ length: tier.rimCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / tier.rimCount;
    const left = 50 + Math.cos(angle) * tier.radiusX;
    const bottom = tier.topCenter + Math.sin(angle) * tier.radiusY;
    const size = 1.6 + (index % 2) * 0.8;

    return (
      <span
        key={`${tier.key}-ring-${index}`}
        className={`cake-core__particle cake-core__particle--${toneFor(index, tierIndex)} cake-core__particle--ring cake-core__particle--${tier.key}`}
        style={{
          left: `${left}%`,
          bottom: `${bottom}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${(index % 10) * 0.18}s`,
          ...createParticleMotion(left, bottom, 2.5),
        }}
      />
    );
  });
}

function createTopFill(tier: TierConfig, tierIndex: number) {
  return Array.from({ length: tier.fillCount }, (_, index) => {
    const seed = index + 1 + tierIndex * 47;
    const angle = seededUnit(seed * 9.3) * Math.PI * 2;
    const radius = Math.pow(seededUnit(seed * 13.7), tier.fillBias);
    const left = 50 + Math.cos(angle) * tier.radiusX * radius * 0.86;
    const bottom =
      tier.topCenter + Math.sin(angle) * tier.radiusY * radius * 0.84;
    const size = 1.4 + radius * 2.6 + (index % 3) * 0.3;

    return (
      <span
        key={`${tier.key}-fill-${index}`}
        className={`cake-core__particle cake-core__particle--${toneFor(index + 1, tierIndex)} cake-core__particle--fill cake-core__particle--${tier.key}`}
        style={{
          left: `${left}%`,
          bottom: `${bottom}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${(index % 16) * 0.14}s`,
          ...createParticleMotion(left, bottom, 2.8),
        }}
      />
    );
  });
}

function createInnerSparkles(tier: TierConfig, tierIndex: number) {
  return Array.from({ length: tier.sparkCount }, (_, index) => {
    const seed = index + 1 + tierIndex * 61;
    const angle = seededUnit(seed * 8.9) * Math.PI * 2;
    const radial = Math.pow(seededUnit(seed * 12.4), 1.28);
    const vertical = seededUnit(seed * 6.7);
    const left = 50 + Math.cos(angle) * tier.radiusX * radial * 0.62;
    const bottom =
      tier.topCenter -
      tier.depth * (0.18 + vertical * 0.64) +
      Math.sin(angle) * tier.radiusY * radial * 0.38;
    const size = 1.2 + (1 - radial) * 1.8 + (index % 2) * 0.35;

    return (
      <span
        key={`${tier.key}-spark-${index}`}
        className={`cake-core__particle cake-core__particle--${toneFor(index + 2, tierIndex)} cake-core__particle--spark cake-core__particle--${tier.key}`}
        style={{
          left: `${left}%`,
          bottom: `${bottom}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${(index % 12) * 0.15}s`,
          ...createParticleMotion(left, bottom, 2.4),
        }}
      />
    );
  });
}

function createSideShell(tier: TierConfig, tierIndex: number) {
  return Array.from({ length: tier.sideColumns }, (_, columnIndex) => {
    const xProgress =
      tier.sideColumns === 1 ? 0 : columnIndex / (tier.sideColumns - 1);
    const centered = xProgress * 2 - 1;
    const curvature = Math.sqrt(Math.max(0, 1 - centered * centered));
    const shellLeft = 50 + centered * tier.radiusX * 0.92;
    const shellTop = tier.topCenter - tier.radiusY * 0.35;

    return Array.from({ length: tier.sideRows }, (_, rowIndex) => {
      const rowProgress =
        tier.sideRows === 1 ? 0 : rowIndex / (tier.sideRows - 1);
      const noise = seededUnit(
        (columnIndex + 1) * 11.7 + (rowIndex + 1) * 7.9 + tierIndex * 3.3,
      );
      const left = shellLeft + (noise - 0.5) * 1.8;
      const bottom =
        shellTop -
        rowProgress * tier.depth +
        curvature * 1.8 +
        (noise - 0.5) * 1.2;
      const size = 1.4 + curvature * 1.8 + (1 - rowProgress) * 0.6;

      return (
        <span
          key={`${tier.key}-side-${columnIndex}-${rowIndex}`}
          className={`cake-core__particle cake-core__particle--${toneFor(columnIndex + rowIndex, tierIndex)} cake-core__particle--side cake-core__particle--${tier.key}`}
          style={{
            left: `${left}%`,
            bottom: `${bottom}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${((columnIndex + rowIndex) % 14) * 0.16}s`,
            ...createParticleMotion(left, bottom, 3.2),
          }}
        />
      );
    });
  });
}

function createBottomRim(tier: TierConfig, tierIndex: number) {
  return Array.from({ length: tier.rimCount }, (_, index) => {
    const angle = (Math.PI * (index / Math.max(1, tier.rimCount - 1))) + 0.08;
    const left = 50 + Math.cos(angle) * tier.radiusX * 0.98;
    const bottom =
      tier.topCenter -
      tier.depth +
      Math.sin(angle) * tier.radiusY * 0.62 +
      tier.radiusY * 0.4;
    const size = 1.8 + (index % 2) * 0.6;

    return (
      <span
        key={`${tier.key}-rim-${index}`}
        className={`cake-core__particle cake-core__particle--moon cake-core__particle--rim cake-core__particle--${tier.key}`}
        style={{
          left: `${left}%`,
          bottom: `${bottom}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${(index % 12) * 0.18}s`,
          ...createParticleMotion(left, bottom, 3.4),
        }}
      />
    );
  });
}

export function CakeCore({ profile, transitionState }: CakeCoreProps) {
  const densityScale = profileDensityScale[profile];
  const activeTiers = tiers.map((tier) => ({
    ...tier,
    fillCount: Math.max(16, Math.round(tier.fillCount * densityScale)),
    sideColumns: Math.max(8, Math.round(tier.sideColumns * densityScale)),
    sideRows: Math.max(4, Math.round(tier.sideRows * (0.84 + densityScale * 0.16))),
    rimCount: Math.max(12, Math.round(tier.rimCount * densityScale)),
    sparkCount: Math.max(8, Math.round(tier.sparkCount * densityScale)),
  }));
  const driftCount =
    profile === 'desktop'
      ? 14
      : profile === 'mobile-high'
        ? 10
        : profile === 'mobile-mid'
          ? 7
          : 5;
  const ringDotCount =
    profile === 'desktop'
      ? 42
      : profile === 'mobile-high'
        ? 28
        : profile === 'mobile-mid'
          ? 20
          : 16;

  return (
    <div
      className={[
        'cake-core',
        transitionState === 'explode' ? 'is-exploding' : '',
        transitionState === 'reform' ? 'is-reforming' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cake-core__shadow" />

      <div className="cake-core__sculpture" aria-hidden="true">
        <div className="cake-core__aura cake-core__aura--outer" />
        <div className="cake-core__aura cake-core__aura--inner" />
        <div className="cake-core__core-light cake-core__core-light--center" />
        <div className="cake-core__core-light cake-core__core-light--base" />

        {activeTiers.map((tier) => (
          <div key={`form-${tier.key}`} className={`cake-core__tier-form cake-core__tier-form--${tier.key}`}>
            <div className={`cake-core__volume cake-core__volume--${tier.key}`} />
            <div className={`cake-core__shape cake-core__shape--${tier.key}`} />
            <div className={`cake-core__mist cake-core__mist--${tier.key}`} />
            <div className={`cake-core__tier-cap cake-core__tier-cap--${tier.key}`} />
            <div className={`cake-core__tier-side cake-core__tier-side--${tier.key}`} />
            <div className={`cake-core__tier-baseglow cake-core__tier-baseglow--${tier.key}`} />
          </div>
        ))}

        <div className="cake-core__particle-cloud">
          {activeTiers.map((tier, tierIndex) => (
            <div
              key={`particles-${tier.key}`}
              className={`cake-core__tier-particles cake-core__tier-particles--${tier.key}`}
            >
              {createTopRing(tier, tierIndex)}
              {createTopFill(tier, tierIndex)}
              {createSideShell(tier, tierIndex)}
              {createBottomRim(tier, tierIndex)}
              {createInnerSparkles(tier, tierIndex)}
            </div>
          ))}

          {Array.from({ length: driftCount }, (_, index) => {
            const seed = index + 1;
            const left = 24 + seededUnit(seed * 12.7) * 52;
            const bottom = 24 + seededUnit(seed * 9.3) * 34;
            const size = 2 + (index % 2);

            return (
              <span
                key={`drift-${index}`}
                className="cake-core__drift"
                style={{
                  left: `${left}%`,
                  bottom: `${bottom}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${index * 0.28}s`,
                  ...createParticleMotion(left, bottom, 3),
                }}
              />
            );
          })}
        </div>

        <div className="cake-core__heart-hint" />
        <div className="cake-core__candle-seat" />

        <div className="cake-core__candle-hints">
          <span className="cake-core__candle-beam" />
          <span className="cake-core__candle-beam" />
          <span className="cake-core__candle-beam" />
        </div>
      </div>

      <div className="cake-core__ring" aria-hidden="true">
        <div className="cake-core__ring-line" />
        {Array.from({ length: ringDotCount }, (_, index) => {
          const angle = (Math.PI * 2 * index) / ringDotCount;
          const x = Math.cos(angle) * 40;
          const y = Math.sin(angle) * 12;

          return (
            <span
              key={index}
              className="cake-core__ring-dot"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                animationDelay: `${index * 0.08}s`,
                ['--explode-x' as string]: `${x * 4.2}px`,
                ['--explode-y' as string]: `${y * 4.6 - 20}px`,
              }}
            />
          );
        })}
      </div>

      <div className="cake-core__label">Tap to open</div>
    </div>
  );
}
