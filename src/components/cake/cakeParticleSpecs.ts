import type { DeviceProfile } from '../../types/scene';

export type CakeParticleTone = 'moon' | 'ice' | 'violet' | 'rose';
export type CakeParticleKind = 'ring' | 'fill' | 'side' | 'rim' | 'spark';
export type CakeParticleTier = 'top' | 'mid' | 'base';

export interface CakeParticleSpec {
  key: string;
  left: number;
  bottom: number;
  size: number;
  tone: CakeParticleTone;
  kind: CakeParticleKind;
  tier: CakeParticleTier;
  delay: string;
}

interface TierConfig {
  key: CakeParticleTier;
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

const particleTones: CakeParticleTone[] = ['moon', 'ice', 'violet', 'rose'];

const profileDensityScale: Record<DeviceProfile, number> = {
  'mobile-low': 0.28,
  'mobile-mid': 0.38,
  'mobile-high': 0.54,
  desktop: 1,
};

function seededUnit(seed: number) {
  return (Math.sin(seed) + 1) / 2;
}

function toneFor(index: number, shift = 0): CakeParticleTone {
  return particleTones[(index + shift) % particleTones.length];
}

function activeTiersForProfile(profile: DeviceProfile) {
  const densityScale = profileDensityScale[profile];

  return tiers.map((tier) => ({
    ...tier,
    fillCount: Math.max(16, Math.round(tier.fillCount * densityScale)),
    sideColumns: Math.max(8, Math.round(tier.sideColumns * densityScale)),
    sideRows: Math.max(4, Math.round(tier.sideRows * (0.84 + densityScale * 0.16))),
    rimCount: Math.max(12, Math.round(tier.rimCount * densityScale)),
    sparkCount: Math.max(8, Math.round(tier.sparkCount * densityScale)),
  }));
}

function createTopRing(tier: TierConfig, tierIndex: number): CakeParticleSpec[] {
  return Array.from({ length: tier.rimCount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / tier.rimCount;
    const left = 50 + Math.cos(angle) * tier.radiusX;
    const bottom = tier.topCenter + Math.sin(angle) * tier.radiusY;
    const size = 1.6 + (index % 2) * 0.8;

    return {
      key: `${tier.key}-ring-${index}`,
      left,
      bottom,
      size,
      tone: toneFor(index, tierIndex),
      kind: 'ring' as const,
      tier: tier.key,
      delay: `${(index % 10) * 0.18}s`,
    };
  });
}

function createTopFill(tier: TierConfig, tierIndex: number): CakeParticleSpec[] {
  return Array.from({ length: tier.fillCount }, (_, index) => {
    const seed = index + 1 + tierIndex * 47;
    const angle = seededUnit(seed * 9.3) * Math.PI * 2;
    const radius = Math.pow(seededUnit(seed * 13.7), tier.fillBias);
    const left = 50 + Math.cos(angle) * tier.radiusX * radius * 0.86;
    const bottom = tier.topCenter + Math.sin(angle) * tier.radiusY * radius * 0.84;
    const size = 1.4 + radius * 2.6 + (index % 3) * 0.3;

    return {
      key: `${tier.key}-fill-${index}`,
      left,
      bottom,
      size,
      tone: toneFor(index + 1, tierIndex),
      kind: 'fill' as const,
      tier: tier.key,
      delay: `${(index % 16) * 0.14}s`,
    };
  });
}

function createInnerSparkles(tier: TierConfig, tierIndex: number): CakeParticleSpec[] {
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

    return {
      key: `${tier.key}-spark-${index}`,
      left,
      bottom,
      size,
      tone: toneFor(index + 2, tierIndex),
      kind: 'spark' as const,
      tier: tier.key,
      delay: `${(index % 12) * 0.15}s`,
    };
  });
}

function createSideShell(tier: TierConfig, tierIndex: number): CakeParticleSpec[] {
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

      return {
        key: `${tier.key}-side-${columnIndex}-${rowIndex}`,
        left,
        bottom,
        size,
        tone: toneFor(columnIndex + rowIndex, tierIndex),
        kind: 'side' as const,
        tier: tier.key,
        delay: `${((columnIndex + rowIndex) % 14) * 0.16}s`,
      };
    });
  }).flat();
}

function createBottomRim(tier: TierConfig): CakeParticleSpec[] {
  return Array.from({ length: tier.rimCount }, (_, index) => {
    const angle = (Math.PI * (index / Math.max(1, tier.rimCount - 1))) + 0.08;
    const left = 50 + Math.cos(angle) * tier.radiusX * 0.98;
    const bottom =
      tier.topCenter -
      tier.depth +
      Math.sin(angle) * tier.radiusY * 0.62 +
      tier.radiusY * 0.4;
    const size = 1.8 + (index % 2) * 0.6;

    return {
      key: `${tier.key}-rim-${index}`,
      left,
      bottom,
      size,
      tone: 'moon' as const,
      kind: 'rim' as const,
      tier: tier.key,
      delay: `${(index % 12) * 0.18}s`,
    };
  });
}

export function createCakeTierParticleSpecs(profile: DeviceProfile) {
  const activeTiers = activeTiersForProfile(profile);

  const specs = {
    top: [] as CakeParticleSpec[],
    mid: [] as CakeParticleSpec[],
    base: [] as CakeParticleSpec[],
  };

  activeTiers.forEach((tier, tierIndex) => {
    const tierSpecs = [
      ...createTopRing(tier, tierIndex),
      ...createTopFill(tier, tierIndex),
      ...createSideShell(tier, tierIndex),
      ...createBottomRim(tier),
      ...createInnerSparkles(tier, tierIndex),
    ];

    specs[tier.key] = tierSpecs;
  });

  return specs;
}
