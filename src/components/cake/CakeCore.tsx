import type { CSSProperties } from 'react';
import type { DeviceProfile } from '../../types/scene';
import { createCakeTierParticleSpecs } from './cakeParticleSpecs';

interface CakeCoreProps {
  profile: DeviceProfile;
  transitionState: 'idle' | 'explode' | 'reform';
}

function seededUnit(seed: number) {
  return (Math.sin(seed) + 1) / 2;
}

function createParticleMotion(left: number, bottom: number, strength = 3) {
  const dx = left - 50;
  const dy = bottom - 46;

  return {
    ['--explode-x' as string]: `${dx * strength}px`,
    ['--explode-y' as string]: `${dy * strength - 18}px`,
  } as CSSProperties;
}

export function CakeCore({
  profile,
  transitionState,
}: CakeCoreProps) {
  const tierParticles = createCakeTierParticleSpecs(profile);
  const driftCount =
    profile === 'desktop'
      ? 14
      : profile === 'mobile-high'
        ? 7
        : profile === 'mobile-mid'
          ? 4
          : 2;
  const ringDotCount =
    profile === 'desktop'
      ? 42
      : profile === 'mobile-high'
        ? 18
        : profile === 'mobile-mid'
          ? 12
          : 8;

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

        {(['top', 'mid', 'base'] as const).map((tierKey) => (
          <div key={`form-${tierKey}`} className={`cake-core__tier-form cake-core__tier-form--${tierKey}`}>
            <div className={`cake-core__volume cake-core__volume--${tierKey}`} />
            <div className={`cake-core__shape cake-core__shape--${tierKey}`} />
            <div className={`cake-core__mist cake-core__mist--${tierKey}`} />
            <div className={`cake-core__tier-cap cake-core__tier-cap--${tierKey}`} />
            <div className={`cake-core__tier-side cake-core__tier-side--${tierKey}`} />
            <div className={`cake-core__tier-baseglow cake-core__tier-baseglow--${tierKey}`} />
          </div>
        ))}

        <div className="cake-core__particle-cloud">
          {(['top', 'mid', 'base'] as const).map((tierKey) => (
            <div
              key={`particles-${tierKey}`}
              className={`cake-core__tier-particles cake-core__tier-particles--${tierKey}`}
            >
              {tierParticles[tierKey].map((particle) => (
                <span
                  key={particle.key}
                  className={`cake-core__particle cake-core__particle--${particle.tone} cake-core__particle--${particle.kind} cake-core__particle--${particle.tier}`}
                  style={{
                    left: `${particle.left}%`,
                    bottom: `${particle.bottom}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDelay: particle.delay,
                    ...createParticleMotion(
                      particle.left,
                      particle.bottom,
                      particle.kind === 'ring'
                        ? 2.5
                        : particle.kind === 'fill'
                          ? 2.8
                          : particle.kind === 'spark'
                            ? 2.4
                            : particle.kind === 'side'
                              ? 3.2
                              : 3.4,
                    ),
                  }}
                />
              ))}
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
