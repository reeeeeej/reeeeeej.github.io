import { useMemo, type ReactNode } from 'react';
import { useAlbumRotation } from '../../hooks/useAlbumRotation';
import type { DeviceProfile } from '../../types/scene';

function heartCurve(t: number) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

const profileConfig: Record<
  DeviceProfile,
  {
    outlineCount: number;
    ambientCount: number;
    dustCount: number;
    sparkleCount: number;
    monogramParticleCount: number;
  }
> = {
  'mobile-low': {
    outlineCount: 42,
    ambientCount: 14,
    dustCount: 8,
    sparkleCount: 8,
    monogramParticleCount: 18,
  },
  'mobile-mid': {
    outlineCount: 50,
    ambientCount: 18,
    dustCount: 10,
    sparkleCount: 10,
    monogramParticleCount: 22,
  },
  'mobile-high': {
    outlineCount: 58,
    ambientCount: 24,
    dustCount: 12,
    sparkleCount: 13,
    monogramParticleCount: 28,
  },
  desktop: {
    outlineCount: 68,
    ambientCount: 33,
    dustCount: 16,
    sparkleCount: 17,
    monogramParticleCount: 34,
  },
};

const ambientMotes = [
  { left: '11%', top: '18%', size: 7, delay: '0.2s', duration: '5.2s' },
  { left: '18%', top: '31%', size: 5, delay: '1.1s', duration: '4.8s' },
  { left: '14%', top: '53%', size: 6, delay: '2s', duration: '5.6s' },
  { left: '22%', top: '72%', size: 5, delay: '0.7s', duration: '5.4s' },
  { left: '31%', top: '10%', size: 4, delay: '1.5s', duration: '4.6s' },
  { left: '39%', top: '24%', size: 5, delay: '0.4s', duration: '5s' },
  { left: '50%', top: '12%', size: 6, delay: '1.9s', duration: '5.8s' },
  { left: '62%', top: '22%', size: 5, delay: '0.9s', duration: '4.9s' },
  { left: '74%', top: '14%', size: 4, delay: '1.3s', duration: '5.3s' },
  { left: '86%', top: '28%', size: 6, delay: '0.5s', duration: '5.1s' },
  { left: '82%', top: '51%', size: 5, delay: '1.6s', duration: '4.7s' },
  { left: '72%', top: '72%', size: 6, delay: '0.3s', duration: '5.7s' },
  { left: '55%', top: '82%', size: 5, delay: '1.7s', duration: '5.2s' },
  { left: '37%', top: '79%', size: 4, delay: '0.6s', duration: '4.8s' },
  { left: '8%', top: '10%', size: 5, delay: '1.2s', duration: '5.9s' },
  { left: '13%', top: '22%', size: 4, delay: '0.8s', duration: '4.9s' },
  { left: '7%', top: '39%', size: 6, delay: '1.6s', duration: '5.4s' },
  { left: '10%', top: '64%', size: 5, delay: '0.4s', duration: '5.1s' },
  { left: '19%', top: '84%', size: 4, delay: '1.9s', duration: '4.7s' },
  { left: '28%', top: '18%', size: 4, delay: '0.6s', duration: '5.5s' },
  { left: '33%', top: '34%', size: 6, delay: '1.4s', duration: '5.7s' },
  { left: '42%', top: '9%', size: 5, delay: '0.3s', duration: '5.3s' },
  { left: '46%', top: '28%', size: 4, delay: '1.1s', duration: '4.8s' },
  { left: '58%', top: '7%', size: 5, delay: '0.7s', duration: '5.6s' },
  { left: '66%', top: '31%', size: 6, delay: '1.8s', duration: '5.2s' },
  { left: '78%', top: '9%', size: 4, delay: '0.5s', duration: '4.9s' },
  { left: '91%', top: '20%', size: 5, delay: '1.5s', duration: '5.7s' },
  { left: '89%', top: '44%', size: 6, delay: '0.9s', duration: '5s' },
  { left: '93%', top: '66%', size: 5, delay: '1.3s', duration: '5.4s' },
  { left: '81%', top: '83%', size: 4, delay: '0.2s', duration: '4.8s' },
  { left: '62%', top: '86%', size: 5, delay: '1.7s', duration: '5.6s' },
  { left: '45%', top: '88%', size: 4, delay: '0.9s', duration: '5.1s' },
  { left: '28%', top: '90%', size: 5, delay: '1.1s', duration: '5.8s' },
] as const;

const backgroundSparkDust = [
  { left: '16%', top: '12%', size: 2, delay: '0.4s' },
  { left: '24%', top: '20%', size: 2, delay: '1s' },
  { left: '34%', top: '14%', size: 3, delay: '1.7s' },
  { left: '48%', top: '18%', size: 2, delay: '0.6s' },
  { left: '61%', top: '13%', size: 2, delay: '1.3s' },
  { left: '73%', top: '18%', size: 3, delay: '0.9s' },
  { left: '83%', top: '24%', size: 2, delay: '1.5s' },
  { left: '19%', top: '37%', size: 2, delay: '0.2s' },
  { left: '30%', top: '44%', size: 3, delay: '1.2s' },
  { left: '69%', top: '41%', size: 2, delay: '0.8s' },
  { left: '80%', top: '49%', size: 3, delay: '1.9s' },
  { left: '25%', top: '63%', size: 2, delay: '0.5s' },
  { left: '37%', top: '69%', size: 3, delay: '1.1s' },
  { left: '63%', top: '68%', size: 2, delay: '1.8s' },
  { left: '74%', top: '74%', size: 3, delay: '0.7s' },
  { left: '49%', top: '83%', size: 2, delay: '1.4s' },
] as const;

const heartSparkles = [
  { left: '18%', top: '22%', size: 3, delay: '0s', trail: '18px', angle: '-18deg' },
  { left: '27%', top: '14%', size: 2, delay: '0.5s', trail: '15px', angle: '14deg' },
  { left: '35%', top: '12%', size: 2, delay: '0.9s', trail: '12px', angle: '4deg' },
  { left: '40%', top: '18%', size: 3, delay: '1.1s', trail: '20px', angle: '8deg' },
  { left: '59%', top: '17%', size: 3, delay: '0.3s', trail: '16px', angle: '-8deg' },
  { left: '66%', top: '12%', size: 2, delay: '1.7s', trail: '12px', angle: '-4deg' },
  { left: '72%', top: '15%', size: 2, delay: '1.4s', trail: '14px', angle: '-14deg' },
  { left: '82%', top: '25%', size: 3, delay: '0.8s', trail: '18px', angle: '22deg' },
  { left: '22%', top: '39%', size: 2, delay: '1.2s', trail: '14px', angle: '18deg' },
  { left: '16%', top: '49%', size: 2, delay: '0.6s', trail: '10px', angle: '18deg' },
  { left: '79%', top: '41%', size: 2, delay: '0.2s', trail: '14px', angle: '-20deg' },
  { left: '83%', top: '51%', size: 2, delay: '1.1s', trail: '10px', angle: '-18deg' },
  { left: '26%', top: '57%', size: 3, delay: '0.9s', trail: '16px', angle: '24deg' },
  { left: '72%', top: '58%', size: 3, delay: '1.5s', trail: '16px', angle: '-22deg' },
  { left: '34%', top: '72%', size: 2, delay: '1.7s', trail: '14px', angle: '28deg' },
  { left: '65%', top: '72%', size: 2, delay: '0.7s', trail: '14px', angle: '-28deg' },
  { left: '50%', top: '82%', size: 4, delay: '1.9s', trail: '20px', angle: '90deg' },
] as const;

function createOutlineParticles(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const progress = index / count;
    const t = 0.2 + progress * (Math.PI * 2 - 0.4);
    const raw = heartCurve(t);
    const point = {
      x: raw.x / 17,
      y: raw.y / 17,
    };
    const upper = Math.max(0, point.y);
    const lower = Math.max(0, -point.y);
    const lobeSpread = 1 + upper * 0.09 + Math.max(0, upper - 0.2) * 0.05;
    const tailTighten = 1 - lower * 0.08;
    const x = point.x * lobeSpread * tailTighten;
    const y =
      point.y >= 0
        ? point.y * 1.02 + 0.01
        : point.y * 0.86 + 0.03;
    const scale = index % 3 === 0 ? 1.09 : index % 3 === 1 ? 1.03 : 0.98;
    const offset = index % 2 === 0 ? -0.7 : 0.7;

    return {
      left: `${50 + x * 38.8 * scale}%`,
      top: `${45.8 - y * 31.4 * scale + offset}%`,
      size: index % 7 === 0 ? 4 : index % 3 === 0 ? 3 : 2,
      opacity: index % 4 === 0 ? 0.8 : index % 2 === 0 ? 0.58 : 0.42,
      blur: index % 5 === 0 ? '0.8px' : index % 3 === 0 ? '0.4px' : '0px',
      delay: `${(index % 7) * 0.22}s`,
    };
  });
}

function createMonogramDust(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const radiusX = 34 + (index % 3) * 6;
    const radiusY = 18 + (index % 4) * 4;

    return {
      left: `${50 + Math.cos(angle) * radiusX}%`,
      top: `${50 + Math.sin(angle) * radiusY}%`,
      size: index % 5 === 0 ? 4 : 3,
      opacity: index % 2 === 0 ? 0.82 : 0.58,
      delay: `${(index % 8) * 0.18}s`,
    };
  });
}

interface AlbumViewportRenderProps {
  canOpenCard: () => boolean;
}

interface AlbumViewportProps {
  active: boolean;
  entering: boolean;
  exiting: boolean;
  profile: DeviceProfile;
  children: (controls: AlbumViewportRenderProps) => ReactNode;
}

export function AlbumViewport({
  active,
  entering,
  exiting,
  profile,
  children,
}: AlbumViewportProps) {
  const { viewportRef, handlers, canOpenCard, isDragging } = useAlbumRotation(active);
  const config = profileConfig[profile];
  const outlineParticles = useMemo(
    () => createOutlineParticles(config.outlineCount),
    [config.outlineCount],
  );
  const monogramDust = useMemo(
    () => createMonogramDust(config.monogramParticleCount),
    [config.monogramParticleCount],
  );

  return (
    <div
      ref={viewportRef}
      className={`album-viewport ${entering ? 'is-entering' : ''} ${exiting ? 'is-exiting' : ''} ${active ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''}`}
      data-profile={profile}
      {...handlers}
    >
      <div className="album-viewport__stage">
        <div className="album-viewport__assembly">
          <div className="album-viewport__glow album-viewport__glow--top" aria-hidden="true" />
          <div className="album-viewport__glow album-viewport__glow--bottom" aria-hidden="true" />
          <div className="album-viewport__heart" aria-hidden="true" />
          <div className="album-viewport__ambient" aria-hidden="true">
            {ambientMotes.slice(0, config.ambientCount).map((mote, index) => (
              <span
                key={`${mote.left}-${mote.top}-${index}`}
                className="album-viewport__ambient-mote"
                style={{
                  left: mote.left,
                  top: mote.top,
                  width: `${mote.size}px`,
                  height: `${mote.size}px`,
                  animationDelay: mote.delay,
                  animationDuration: mote.duration,
                }}
              />
            ))}
          </div>
          <div className="album-viewport__dust" aria-hidden="true">
            {backgroundSparkDust.slice(0, config.dustCount).map((dust, index) => (
              <span
                key={`${dust.left}-${dust.top}-${index}`}
                className="album-viewport__dust-particle"
                style={{
                  left: dust.left,
                  top: dust.top,
                  width: `${dust.size}px`,
                  height: `${dust.size}px`,
                  animationDelay: dust.delay,
                }}
              />
            ))}
          </div>
          <div className="album-viewport__monogram" aria-hidden="true">
            <span className="album-viewport__monogram-word">mo</span>
            {monogramDust.map((particle, index) => (
              <span
                key={`mo-dust-${index}`}
                className="album-viewport__monogram-dust"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
          <div className="album-viewport__outline-particles" aria-hidden="true">
            {outlineParticles.map((particle, index) => (
              <span
                key={`${particle.left}-${particle.top}-${index}`}
                className="album-viewport__outline-particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  filter: `blur(${particle.blur})`,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
          <div className="album-viewport__sparkles" aria-hidden="true">
            {heartSparkles.slice(0, config.sparkleCount).map((sparkle, index) => (
              <span
                key={`${sparkle.left}-${sparkle.top}-${index}`}
                className="album-viewport__sparkle"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  width: `${sparkle.size}px`,
                  height: `${sparkle.size}px`,
                  animationDelay: sparkle.delay,
                  ['--sparkle-trail' as string]: sparkle.trail,
                  ['--sparkle-angle' as string]: sparkle.angle,
                }}
              />
            ))}
          </div>
          <div className="album-viewport__core" aria-hidden="true">
            <span className="album-viewport__core-ring" />
            <span className="album-viewport__core-ring album-viewport__core-ring--inner" />
          </div>
          {children({ canOpenCard })}
        </div>
      </div>
    </div>
  );
}
