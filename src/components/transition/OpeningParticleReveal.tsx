import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { DeviceProfile } from '../../types/scene';
import { createCakeTierParticleSpecs } from '../cake/cakeParticleSpecs';

interface OpeningParticleRevealProps {
  profile: DeviceProfile;
  active: boolean;
}

function seeded(seed: number) {
  return (Math.sin(seed) + 1) / 2;
}
function createRevealParticles(profile: DeviceProfile) {
  const tierSpecs = createCakeTierParticleSpecs(profile);
  const targets = [...tierSpecs.top, ...tierSpecs.mid, ...tierSpecs.base];

  return targets.map((target, index) => {
    const startX = 4 + seeded(index * 12.9 + 1.7) * 92;
    const startY = 6 + seeded(index * 18.3 + 3.4) * 88;
    const tierDelay =
      target.tier === 'base' ? 0 : target.tier === 'mid' ? 42 : 84;
    const kindDelay =
      target.kind === 'side'
        ? 18
        : target.kind === 'rim'
          ? 8
          : target.kind === 'spark'
            ? 26
            : 0;
    const revealDelayMs = Math.min(tierDelay + kindDelay + (index % 8) * 18, 240);

    return {
      id: target.key,
      tone: target.tone,
      startX,
      startY,
      targetLeft: target.left,
      targetBottom: target.bottom,
      size: target.size,
      delayMs: revealDelayMs,
    };
  });
}

export function OpeningParticleReveal({
  profile,
  active,
}: OpeningParticleRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const particles = useMemo(
    () => createRevealParticles(profile),
    [profile],
  );

  useLayoutEffect(() => {
    if (!active) {
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateBounds = () => {
      setBounds({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="opening-particle-reveal"
      aria-hidden="true"
    >
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={`cake-core__particle opening-particle-reveal__particle cake-core__particle--${particle.tone}`}
            style={{
              left: `${particle.targetLeft}%`,
              bottom: `${particle.targetBottom}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delayMs}ms`,
              ['--intro-offset-x' as string]: `${((particle.startX - particle.targetLeft) / 100) * bounds.width}px`,
              ['--intro-offset-y' as string]: `${((particle.targetBottom - (100 - particle.startY)) / 100) * bounds.height}px`,
            }}
          />
        ))}
    </div>
  );
}
